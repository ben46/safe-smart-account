// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  

import "../common/SelfAuthorized.sol";  

/**  
 * @title 回调管理器（Fallback Manager） - 管理对该合约的回调调用的合约  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract FallbackManager is SelfAuthorized {  
    event ChangedFallbackHandler(address indexed handler);  

    // keccak256("fallback_manager.handler.address")  
    bytes32 internal constant FALLBACK_HANDLER_STORAGE_SLOT = 0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5;  

    /**  
     *  @notice 内部函数，用于设置回调处理程序。  
     *  @param handler 处理回调调用的合约。  
     */  
    function internalSetFallbackHandler(address handler) internal {  
        /*  
            如果回调处理程序设置为自身，将会打开以下攻击向量：  
            想象我们有一个这样的函数：  
            function withdraw() internal authorized {  
                withdrawalAddress.call.value(address(this).balance)("");  
            }  

            如果触发了回调方法，回调处理程序会将 msg.sender 地址附加到 calldata 中并调用回调处理程序。  
            一个潜在的攻击者可以使用 withdraw 函数的 3 字节签名来调用一个安全合约（Safe）。由于 3 字节不构成有效的签名，  
            调用将结束在回调处理程序中。由于它将 msg.sender 地址附加到 calldata 中，攻击者可以构造一个地址，  
            使得先前 calldata 的前 3 字节与地址的第一个字节构成有效的函数签名。随后的调用将导致对安全合约内部保护方法的无授权访问。  
            出于某种原因，Solidity 会将 calldata 的前 4 字节与函数签名进行匹配，而不管这 4 字节之后是否有更多数据。  
        */  
        require(handler != address(this), "GS400");  

        bytes32 slot = FALLBACK_HANDLER_STORAGE_SLOT;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            sstore(slot, handler)  
        }  
    }  

    /**  
     * @notice 为安全合约设置回调处理程序为 `handler`。  
     * @dev 仅会转发没有值且有数据的回调调用。  
     *      这只能通过安全交易实现。  
     *      不能设置为安全合约自身。  
     * @param handler 处理回调调用的合约。  
     */  
    function setFallbackHandler(address handler) public authorized {  
        internalSetFallbackHandler(handler);  
        emit ChangedFallbackHandler(handler);  
    }  

    // @notice 如果已设置回调处理程序，则会将所有调用转发到该处理程序。如果未设置任何处理程序，则返回 0。  
    // @dev 将未填充的调用者地址附加到 calldata 中，供处理程序可选地使用。  
    //      处理程序可以使用 `HandlerContext.sol` 来提取地址。  
    //      这是因为在下一个调用帧中，`msg.sender` 将是 FallbackManager 的地址，  
    //      而拥有原始调用者地址可能会启用额外的验证场景。  
    // solhint-disable-next-line payable-fallback,no-complex-fallback  
    fallback() external {  
        bytes32 slot = FALLBACK_HANDLER_STORAGE_SLOT;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            let handler := sload(slot)  
            if iszero(handler) {  
                return(0, 0)  
            }  
            calldatacopy(0, 0, calldatasize())  
            // msg.sender 地址向左移动 12 字节以去除填充  
            // 然后将去除填充的地址存储在 calldata 的后面  
            mstore(calldatasize(), shl(96, caller()))  
            // 为附加地址添加 20 字节  
            let success := call(gas(), handler, 0, 0, add(calldatasize(), 20), 0, 0)  
            returndatacopy(0, 0, returndatasize())  
            if iszero(success) {  
                revert(0, returndatasize())  
            }  
            return(0, returndatasize())  
        }  
    }  
}