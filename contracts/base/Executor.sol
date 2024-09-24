// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  
import "../common/Enum.sol";  

/**  
 * @title 执行器（Executor） - 一个可以执行交易的合约  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract Executor {  
    /**  
     * @notice 执行提供参数的 delegatecall 或 call。  
     * @dev 此方法不对交易进行任何合理性检查，例如：  
     *      - `to` 地址的合约是否有代码  
     *      验证这些检查的责任在于调用者。  
     * @param to 目标地址。  
     * @param value 以太币值。  
     * @param data 数据有效载荷。  
     * @param operation 操作类型。  
     * @return success 布尔标志，指示调用是否成功。  
     */  
    function execute(  
        address to,  
        uint256 value,  
        bytes memory data,  
        Enum.Operation operation,  
        uint256 txGas  
    ) internal returns (bool success) {  
        if (operation == Enum.Operation.DelegateCall) {  
            // solhint-disable-next-line no-inline-assembly  
            assembly {  
                success := delegatecall(txGas, to, add(data, 0x20), mload(data), 0, 0)  
            }  
        } else {  
            // solhint-disable-next-line no-inline-assembly  
            assembly {  
                success := call(txGas, to, value, add(data, 0x20), mload(data), 0, 0)  
            }  
        }  
    }  
}