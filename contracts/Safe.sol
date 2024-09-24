// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

// 导入依赖的库和合约
// import "./base/ModuleManager.sol";
import "./base/OwnerManager.sol";
import "./common/SignatureDecoder.sol";
// import "./common/StorageAccessible.sol";
import "./interfaces/ISignatureValidator.sol";
import "./external/SafeMath.sol";
import "./base/Executor.sol";

/**
 * @title Safe - 一个支持基于EIP-712签名消息确认的多重签名钱包
 * @dev 主要概念：
 *      - Threshold（阈值）：Safe交易所需的确认数量。
 *      - Owners（所有者）：控制Safe的钱包地址列表。只有他们可以添加/删除所有者、更改阈值和批准交易。这些操作都由`OwnerManager`管理。
 *      - Transaction Hash（交易哈希）：使用EIP-712类型化结构数据哈希方案计算交易哈希。
 *      - Nonce（随机数）：每笔交易应有不同的随机数以防止重播攻击。
 *      - Signature（签名）：Safe所有者对交易哈希的有效签名。
 *      - Guard（保护）：Guard是一个可以执行交易前后检查的合约，由`GuardManager`管理。
 *      - Modules（模块）：可用于扩展Safe写功能的合约，由`ModuleManager`管理。
 *      - Fallback（回退）：Fallback处理程序是一个合约，可为Safe提供额外的只读功能，由`FallbackManager`管理。
 *      注意：这个实现版本的合约不发出事件以节省gas，因此需要一个跟踪节点进行索引。
 *      请参见`SafeL2.sol`获取基于事件的实现。
 */
// 一共需要部署两个合约
// 一个是safe.sol 或者 safeL2.sol
// 另一个是CompatibilityFallbackHandler.sol(这个我们暂时用不到, 因为我们的owner都是EOA钱包)
contract Safe is
    Executor,
    OwnerManager,
    SignatureDecoder,
    ISignatureValidatorConstants
{
    using SafeMath for uint256;

    string public constant VERSION = "1.4.1";

    // keccak256("EIP712Domain(uint256 chainId,address verifyingContract)");
    bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH = 0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;

    // keccak256("SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)");
    bytes32 private constant SAFE_TX_TYPEHASH = 0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8;

    // 合约事件
    event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler);
    event ApproveHash(bytes32 indexed approvedHash, address indexed owner);
    event SignMsg(bytes32 indexed msgHash);
    event ExecutionFailure(bytes32 indexed txHash, uint256 payment);
    event ExecutionSuccess(bytes32 indexed txHash, uint256 payment);

    // 状态变量
    uint256 public nonce;
    bytes32 private _deprecatedDomainSeparator;
    mapping(address => mapping(bytes32 => uint256)) public approvedHashes; // 映射跟踪任何所有者批准的所有哈希

    // 构造函数，确保该合约只能作为代理合约的singleton使用
    constructor() {
        threshold = 1; // 设置阈值，无法调用setup，因此创建一个没有所有者且阈值为1的Safe
    }

    /**
     * @notice 设置Safe合约的初始存储。
     * @dev 该方法只能调用一次。如果代理在未设置的情况下创建，任何人都可以调用setup并声明代理。
     * @param _owners Safe所有者列表。
     * @param _threshold Safe交易所需的确认数量。
     * @param to 可选委托调用的合约地址。
     * @param data 可选委托调用的数据负载。
     * @param fallbackHandler 处理对该合约的回退调用的处理程序。
     * @param paymentToken 用于支付的代币（0表示ETH）。
     * @param payment 应支付的金额。
     * @param paymentReceiver 应接收付款的地址（或tx.origin）。
     */
    function setup(
        address[] calldata _owners,
        uint256 _threshold,
        address to,
        bytes calldata data,
        address fallbackHandler,
        address paymentToken,
        uint256 payment,
        address payable paymentReceiver
    ) external {
        setupOwners(_owners, _threshold); // setupOwners检查阈值是否已设置，从而防止该方法被调用两次
        if (payment > 0) {
        }
        emit SafeSetup(msg.sender, _owners, _threshold, to, fallbackHandler); // 触发事件
    }

    /**
     * @notice 执行一个`operation`类型的交易，并支付`gasPrice` * `gasLimit`给`refundReceiver`。
     * @dev 即使用户交易失败，费用也会始终转移。
     * @param to Safe交易的目标地址。
     * @param value Safe交易的ETH值。
     * @param data Safe交易的数据负载。
     * @param operation Safe交易的操作类型。
     * @param safeTxGas 用于Safe交易的gas量。
     * @param baseGas 与交易执行无关的gas成本（如基本交易费用、签名检查、退款支付）。
     * @param gasPrice 用于支付计算的gas价格。
     * @param gasToken 用于支付的代币地址（或0表示ETH）。
     * @param refundReceiver gas付款接收者的地址（或tx.origin）。
     * @param signatures 应验证的签名数据。可以是打包的ECDSA签名，合约签名（EIP-1271）或已批准的哈希。
     * @return success 表示交易成功的布尔值。
     */
    function execTransaction(
        address to,
        uint256 value, // eth value
        bytes calldata data, // calldata
        Enum.Operation operation, // call or delegate call
        uint256 safeTxGas, // 填写0就可以
        uint256 baseGas, // 忽略
        uint256 gasPrice,// 忽略
        address gasToken, // 忽略
        address payable refundReceiver, // 忽略
        bytes memory signatures // 签名必须按照onwer地址从小到大排列
    ) public payable virtual returns (bool success) {
        bytes32 txHash;

        // 限制变量生命周期以防止`stack too deep`错误
        {
            // 这里的签名, 是对什么的签名?
            bytes memory txHashData = encodeTransactionData(
                to,
                value,
                data,
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                nonce
            ); // 根据nonce && data 生成交易哈希, 所以不会有重复的hash, 也就不会有重复的签名, 因此防止了重放攻击
            nonce++; // 增加随机数并执行交易
            txHash = keccak256(txHashData);
            // 这里会遍历检查签名, 签名必须按照onwer地址从小到大排列
            checkSignatures(txHash, txHashData, signatures); // 检查签名
        }

        // 使用作用域来限制变量生命周期以防止`stack too deep`错误  
        // Use scope here to limit variable lifetime and prevent `stack too deep` errors  
        {  
            // 如果gasPrice为0，我们假设几乎所有可用gas都可以使用（总是多于safeTxGas）  
            // If the gasPrice is 0 we assume that nearly all available gas can be used (it is always more than safeTxGas)  
            // 我们仅减少2500（对比以前3000）保证传递的值仍高于safeTxGas  
            // We only subtract 2500 (compared to the 3000 before) to ensure that the amount passed is still higher than safeTxGas  
            success = execute(to, value, data, operation, gasPrice == 0 ? (gasleft() - 2500) : safeTxGas);  

            // 如果safeTxGas和gasPrice未设置（例如均为0），则内部交易需要成功  
            // If no safeTxGas and no gasPrice was set (e.g. both are 0), then the internal tx is required to be successful  
            // 这使得能够使用`estimateGas`，因为它寻找交易不恢复的最小gas  
            // This makes it possible to use `estimateGas` without issues, as it searches for the minimum gas where the tx doesn't revert  
            require(success || safeTxGas != 0 || gasPrice != 0, "GS013");  

            uint256 payment = 0;  
            if (success) emit ExecutionSuccess(txHash, payment);  
            else emit ExecutionFailure(txHash, payment);  
        }  
    }  

    /**  
     * @notice 检查提供的签名是否对提供的数据和哈希有效。否则，抛出错误。  
     * @param dataHash 数据的哈希（可以是消息哈希或交易哈希）  
     * @param data 应该被签名的数据（将传递给外部验证合约）  
     * @param signatures 应该被验证的签名数据。  
     *                   可以是打包的 ECDSA 签名（{bytes32 r}{bytes32 s}{uint8 v}），合约签名（EIP-1271）或批准的哈希。  
     */  
    function checkSignatures(bytes32 dataHash, bytes memory data, bytes memory signatures) public view {  
        // 加载阈值以避免多次存储加载  
        uint256 _threshold = threshold;  
        // 检查是否设置了阈值  
        require(_threshold > 0, "GS001");  
        checkNSignatures(dataHash, data, signatures, _threshold);  
    }  

    /**  
     * @notice 检查提供的签名是否对提供的数据和哈希有效。否则，抛出错误。  
     * @dev 由于 EIP-1271 进行外部调用，请注意重入攻击。  
     * @param dataHash 数据的哈希（可以是消息哈希或交易哈希）  
     * @param data 应该被签名的数据（将传递给外部验证合约）  
     * @param signatures 应该被验证的签名数据。  
     *                   可以是打包的 ECDSA 签名（{bytes32 r}{bytes32 s}{uint8 v}），合约签名（EIP-1271）或批准的哈希。  
     * @param requiredSignatures 所需有效签名的数量。  
     */  
    function checkNSignatures(bytes32 dataHash, bytes memory data, bytes memory signatures, uint256 requiredSignatures) public view {  
        // 检查提供的签名数据是否太短  
        require(signatures.length >= requiredSignatures.mul(65), "GS020");
        // 地址为 0 的所有者是不可接受的。  
        address lastOwner = address(0);  
        address currentOwner;  
        uint8 v;  
        bytes32 r;  
        bytes32 s;  
        uint256 i;  
        for (i = 0; i < requiredSignatures; i++) {  
            (v, r, s) = signatureSplit(signatures, i);  
            if (v == 0) {  
                require(keccak256(data) == dataHash, "GS027");  
                // 如果 v 为 0，则它是合约签名  
                // 处理合约签名时，合约的地址编码在 r 中  
                currentOwner = address(uint160(uint256(r)));  

                // 检查签名数据指针 (s) 是否不指向静态部分的签名字节  
                // 此检查并不完全准确，因为可能发送的签名数量超过了阈值。  
                // 这里我们仅检查指针不指向正在处理的部分  
                require(uint256(s) >= requiredSignatures.mul(65), "GS021");  

                // 检查签名数据指针 (s) 的边界（指向数据长度 -> 32 字节）  
                require(uint256(s).add(32) <= signatures.length, "GS022");  

                // 检查合约签名是否在边界内：数据开始为 s + 32，结束为开始 + 签名长度  
                uint256 contractSignatureLen;  
                // solhint-disable-next-line no-inline-assembly  
                assembly {  
                    contractSignatureLen := mload(add(add(signatures, s), 0x20))  
                }  
                require(uint256(s).add(32).add(contractSignatureLen) <= signatures.length, "GS023");  

                // 检查签名  
                bytes memory contractSignature;  
                // solhint-disable-next-line no-inline-assembly  
                assembly {  
                    // 合约签名的数据附加到连接的签名后，偏移量存储在 s 中  
                    contractSignature := add(add(signatures, s), 0x20)  
                }  
                require(ISignatureValidator(currentOwner).isValidSignature(data, contractSignature) == EIP1271_MAGIC_VALUE, "GS024");  
            } else if (v == 1) {  
                // 如果 v 为 1，则它是一个批准的哈希  
                // 处理批准哈希时，批准者的地址编码在 r 中  
                currentOwner = address(uint160(uint256(r)));  
                // 消息的发送者或通过单独交易预先批准的哈希自动获得批准  
                require(msg.sender == currentOwner || approvedHashes[currentOwner][dataHash] != 0, "GS025");  
            } else if (v > 30) {
                // json-rpc 签名 , 调用的eth_sign
                // 如果 v > 30，则默认 va（27,28）已针对 eth_sign 流进行了调整  
                // 为了支持 eth_sign 和类似功能，我们调整 v 并在应用 ecrecover 之前对 messageHash 进行哈希处理  
                currentOwner = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", dataHash)), v - 4, r, s);  
            } else {  
                // metamask 签名
                // 默认是使用提供的数据哈希的 ecrecover 流  
                // 对于 EOA 签名，使用 messageHash 执行 ecrecover  
                currentOwner = ecrecover(dataHash, v, r, s);  
            }  
            require(currentOwner > lastOwner && owners[currentOwner] != address(0) && currentOwner != SENTINEL_OWNERS, "GS026");  
            lastOwner = currentOwner;  
        }  
    }

    /**  
     * @notice 标记哈希 `hashToApprove` 为已批准。  
     * @dev 这可以与预先批准的哈希交易签名一起使用。  
     *      重要提示：已批准的哈希将永远保持批准状态。没有撤销机制，因此其行为类似于 ECDSA 签名。  
     * @param hashToApprove 要标记为已批准的哈希，用于由此合约验证的签名。  
     */  
    function approveHash(bytes32 hashToApprove) external {  
        require(owners[msg.sender] != address(0), "GS030");  
        approvedHashes[msg.sender][hashToApprove] = 1;  
        emit ApproveHash(hashToApprove, msg.sender);  
    }  

    /**  
     * @notice 返回合约当前部署的链的 ID。  
     * @return 当前链的 ID，作为 uint256。  
     */  
    function getChainId() public view returns (uint256) {  
        uint256 id;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            id := chainid()  
        }  
        return id;  
    }

    /**  
     * @dev 返回该合约的域分隔符，按照 EIP-712 标准定义。  
     * @return bytes32 域分隔符哈希值。  
     */  
    function domainSeparator() public view returns (bytes32) {  
        return keccak256(abi.encode(DOMAIN_SEPARATOR_TYPEHASH, getChainId(), this));  
    }  

    /**  
     * @notice 返回事务哈希的原始数据（参见 getTransactionHash）。  
     * @param to 目标地址。  
     * @param value 以太币价值。  
     * @param data 数据负载。  
     * @param operation 操作类型。  
     * @param safeTxGas 应用于安全交易的 gas。  
     * @param baseGas 独立于交易执行的 gas 成本（例如基本交易费用、签名检查、退款支付）。  
     * @param gasPrice 应用于此交易的最大 gas 价格。  
     * @param gasToken 用于支付的令牌地址（如果是 ETH，则为 0）。  
     * @param refundReceiver gas 支付的接收者地址（如果是 tx.origin，则为 0）。  
     * @param _nonce 交易的随机数。  
     * @return 交易哈希字节。  
     */  
    function encodeTransactionData(  
        address to,  
        uint256 value,  
        bytes calldata data,  
        Enum.Operation operation,  
        uint256 safeTxGas,  
        uint256 baseGas,  
        uint256 gasPrice,  
        address gasToken,  
        address refundReceiver,  
        uint256 _nonce  
    ) public view returns (bytes memory) {  
        bytes32 safeTxHash = keccak256(  
            abi.encode(  
                SAFE_TX_TYPEHASH,  
                to,  
                value,  
                keccak256(data),  
                operation,  
                safeTxGas,  
                baseGas,  
                gasPrice,  
                gasToken,  
                refundReceiver,  
                _nonce  
            )  
        );  
        return abi.encodePacked(bytes1(0x19), bytes1(0x01), domainSeparator(), safeTxHash);  
    }  

    /**  
     * @notice 返回待所有者签名的交易哈希。  
     * @param to 目标地址。  
     * @param value 以太币价值。  
     * @param data 数据负载。  
     * @param operation 操作类型。  
     * @param safeTxGas 应用于安全交易的 gas。  
     * @param baseGas 用于触发安全交易的数据的 gas 成本。  
     * @param gasPrice 应用于此交易的最大 gas 价格。  
     * @param gasToken 用于支付的令牌地址（如果是 ETH，则为 0）。  
     * @param refundReceiver gas 支付的接收者地址（如果是 tx.origin，则为 0）。  
     * @param _nonce 交易的随机数。  
     * @return 交易哈希。  
     */  
    function getTransactionHash(  
        address to,  
        uint256 value,  
        bytes calldata data,  
        Enum.Operation operation,  
        uint256 safeTxGas,  
        uint256 baseGas,  
        uint256 gasPrice,  
        address gasToken,  
        address refundReceiver,  
        uint256 _nonce  
    ) public view returns (bytes32) {  
        return keccak256(encodeTransactionData(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce));  
    }
}
