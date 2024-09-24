// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  

import "./TokenCallbackHandler.sol";  
import "../interfaces/ISignatureValidator.sol";  
import "../Safe.sol";  

/**  
 * @title 兼容性回调处理器（Compatibility Fallback Handler） - 提供预 1.3.0 和 1.3.0+ 安全合约之间的兼容性。  
 * @author Richard Meissner - @rmeissner  
 */  
contract CompatibilityFallbackHandler is TokenCallbackHandler, ISignatureValidator {  
    // keccak256("SafeMessage(bytes message)");  
    bytes32 private constant SAFE_MSG_TYPEHASH = 0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca;  

    bytes4 internal constant SIMULATE_SELECTOR = bytes4(keccak256("simulate(address,bytes)"));  

    address internal constant SENTINEL_MODULES = address(0x1);  
    bytes4 internal constant UPDATED_MAGIC_VALUE = 0x1626ba7e;  

    /**  
     * @notice 传统的 EIP-1271 签名验证方法。  
     * @dev ISignatureValidator 的实现（请参见 `interfaces/ISignatureValidator.sol`）  
     * @param _data 代表地址(msg.sender)签名的任意长度数据。  
     * @param _signature 与 _data 相关联的签名字节数组。  
     * @return EIP-1271 魔术值。  
     */  
    function isValidSignature(bytes memory _data, bytes memory _signature) public view override returns (bytes4) {  
        // 调用者应为安全合约  
        Safe safe = Safe(payable(msg.sender));  
        bytes memory messageData = encodeMessageDataForSafe(safe, _data);  
        bytes32 messageHash = keccak256(messageData);  
        if (_signature.length == 0) {  
            require(safe.signedMessages(messageHash) != 0, "Hash not approved");  
        } else {  
            safe.checkSignatures(messageHash, messageData, _signature);  
        }  
        return EIP1271_MAGIC_VALUE;  
    }  

    /**  
     * @dev 返回要由所有者签名的消息的哈希。  
     * @param message 原始消息字节。  
     * @return 消息哈希。  
     */  
    function getMessageHash(bytes memory message) public view returns (bytes32) {  
        return getMessageHashForSafe(Safe(payable(msg.sender)), message);  
    }  

    /**  
     * @dev 返回消息哈希的原文（参见 getMessageHashForSafe）。  
     * @param safe 要传递消息的安全合约。  
     * @param message 应该被编码的消息。  
     * @return 编码的消息。  
     */  
    function encodeMessageDataForSafe(Safe safe, bytes memory message) public view returns (bytes memory) {  
        bytes32 safeMessageHash = keccak256(abi.encode(SAFE_MSG_TYPEHASH, keccak256(message)));  
        return abi.encodePacked(bytes1(0x19), bytes1(0x01), safe.domainSeparator(), safeMessageHash);  
    }  

    /**  
     * @dev 返回可以由所有者签名的消息的哈希。  
     * @param safe 要传递消息的安全合约。  
     * @param message 应该被哈希的消息。  
     * @return 消息哈希。  
     */  
    function getMessageHashForSafe(Safe safe, bytes memory message) public view returns (bytes32) {  
        return keccak256(encodeMessageDataForSafe(safe, message));  
    }  

    /**  
     * @notice 更新的 EIP-1271 签名验证方法的实现。  
     * @param _dataHash 代表地址(msg.sender)上签名数据的哈希。  
     * @param _signature 与 _dataHash 相关联的签名字节数组。  
     * @return 如果签名有效，则返回更新的 EIP1271 魔术值，否则返回 0x0。  
     */  
    function isValidSignature(bytes32 _dataHash, bytes calldata _signature) external view returns (bytes4) {  
        ISignatureValidator validator = ISignatureValidator(msg.sender);  
        bytes4 value = validator.isValidSignature(abi.encode(_dataHash), _signature);  
        return (value == EIP1271_MAGIC_VALUE) ? UPDATED_MAGIC_VALUE : bytes4(0);  
    }  

    /**  
     * @dev 返回前 10 个模块的数组。  
     * @return 模块数组。  
     */  
    // function getModules() external view returns (address[] memory) {  
    //     // 调用者应为安全合约  
    //     Safe safe = Safe(payable(msg.sender));  
    //     (address[] memory array, ) = safe.getModulesPaginated(SENTINEL_MODULES, 10);  
    //     return array;  
    // }  

    /**  
     * @dev 在自我的上下文中对目标合约执行 delegatecall。  
     * 内部会恢复执行以避免副作用（使其静态）。捕获恢复并将编码的结果作为字节返回。  
     * @dev 灵感来源于 https://github.com/gnosis/util-contracts/blob/bb5fe5fb5df6d8400998094fb1b32a178a47c3a1/contracts/StorageAccessible.sol  
     * @param targetContract 要执行的合约地址。  
     * @param calldataPayload 应该发送到目标合约的 calldata（编码的方法名称和参数）。  
     */  
    function simulate(address targetContract, bytes calldata calldataPayload) external returns (bytes memory response) {  
        /**  
         * 抑制编译器关于未使用参数的警告，同时允许  
         * 为文档目的保留参数名称。这不会  
         * 生成代码。  
         */  
        targetContract;  
        calldataPayload;  

        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            let internalCalldata := mload(0x40)  
            /**  
             * 存储 `simulateAndRevert.selector`。  
             * 使用字符串表示以强制右侧填充  
             */  
            mstore(internalCalldata, "\xb4\xfa\xba\x09")  
            /**  
             * 利用此处和内部方法两个具有相同签名的事实，  
             * 仅在符号名称（因此，选择器）上有所不同，并直接复制 calldata。  
             * 这节省了约 250 字节的代码和每次运行额外 300 瓦特的油费。  
             */  
            calldatacopy(add(internalCalldata, 0x04), 0x04, sub(calldatasize(), 0x04))  

            /**  
             * 此处的 `pop` 是编译器所需，因为顶级表达式  
             * 不能在内联汇编中有返回值。`call` 通常  
             * 返回一个指示是否恢复的 0 或 1 值，但  
             * 由于我们知道它总是会恢复，我们可以安全地忽略它。  
             */  
            pop(  
                call(  
                    gas(),  
                    // address() 已更改为 caller() 以使用安全合约的实现  
                    caller(),  
                    0,  
                    internalCalldata,  
                    calldatasize(),  
                    /**  
                     * `simulateAndRevert` 调用总是会恢复，并且  
                     * 取而代之的是在返回数据中编码它是否成功。  
                     * 返回数据的第一个 32 字节字包含  
                     * `success` 值，因此写入内存地址 0x00（该地址  
                     * 被保留为 Solidity 临时存储，可以使用）。  
                     */  
                    0x00,  
                    0x20  
                )  
            )  

            /**  
             * 分配并复制响应字节，确保相应地增加  
             * 自由内存指针（以防该方法作为  
             * 内部函数调用）。剩余的 `returndata[0x20:]`  
             * 包含 ABI 编码的响应字节，因此我们可以直接写入  
             * 内存。  
             */  
            let responseSize := sub(returndatasize(), 0x20)  
            response := mload(0x40)  
            mstore(0x40, add(response, responseSize))  
            returndatacopy(response, 0x20, responseSize)  

            if iszero(mload(0x00)) {  
                revert(add(response, 0x20), mload(response))  
            }  
        }  
    }  
}