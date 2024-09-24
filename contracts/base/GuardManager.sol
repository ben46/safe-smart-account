// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  

import "../common/Enum.sol";  
import "../common/SelfAuthorized.sol";  
import "../interfaces/IERC165.sol";  

interface Guard is IERC165 {  
    function checkTransaction(  
        address to,  
        uint256 value,  
        bytes memory data,  
        Enum.Operation operation,  
        uint256 safeTxGas,  
        uint256 baseGas,  
        uint256 gasPrice,  
        address gasToken,  
        address payable refundReceiver,  
        bytes memory signatures,  
        address msgSender  
    ) external;  

    function checkAfterExecution(bytes32 txHash, bool success) external;  
}  

abstract contract BaseGuard is Guard {  
    function supportsInterface(bytes4 interfaceId) external view virtual override returns (bool) {  
        return  
            interfaceId == type(Guard).interfaceId || // 0xe6d7a83a  
            interfaceId == type(IERC165).interfaceId; // 0x01ffc9a7  
    }  
}  

/**  
 * @title Guard Manager - 管理在安全交易前后执行检查的交易保护合约的合约。  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract GuardManager is SelfAuthorized {  
    event ChangedGuard(address indexed guard);  

    // keccak256("guard_manager.guard.address")  
    bytes32 internal constant GUARD_STORAGE_SLOT = 0x4a204f620c8c5ccdca3fd54d003badd85ba500436a431f0cbda4f558c93c34c8;  

    /**  
     * @dev 设置一个在执行前检查交易的保护合约  
     *      这只能通过安全交易实现。  
     *      ⚠️ 重要提示：由于保护合约有完全权力阻止安全交易执行，  
     *        一个损坏的保护合约可能会导致安全合约服务拒绝（Denial of Service）。请确保对保护合约代码进行仔细审计并设计恢复机制。  
     * @notice 为安全合约设置交易保护合约 `guard`。确保您信任该保护合约。  
     * @param guard 要使用的保护合约地址，或 0 地址以禁用保护合约  
     */  
    function setGuard(address guard) external authorized {  
        if (guard != address(0)) {  
            require(Guard(guard).supportsInterface(type(Guard).interfaceId), "GS300");  
        }  
        bytes32 slot = GUARD_STORAGE_SLOT;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            sstore(slot, guard)  
        }  
        emit ChangedGuard(guard);  
    }  

    /**  
     * @dev 内部方法，用于检索当前的保护合约  
     *      我们没有公共方法，因为我们在字节码大小限制上有些紧张，  
     *      要检索保护合约地址，可以使用 `StorageAccessible` 合约中的 `getStorageAt`  
     *      方法，使用槽 `GUARD_STORAGE_SLOT`  
     * @return guard 保护合约的地址  
     */  
    function getGuard() internal view returns (address guard) {  
        bytes32 slot = GUARD_STORAGE_SLOT;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            guard := sload(slot)  
        }  
    }  
}