// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "../base/Executor.sol";

/**
 * @title 模拟交易访问器（Simulate Transaction Accessor）。
 * @notice 可与 StorageAccessible 配合使用，以模拟安全交易（Safe transactions）。
 * @author Richard Meissner - @rmeissner
 */
contract SimulateTxAccessor is Executor {
    address private immutable accessorSingleton;

    constructor() {
        accessorSingleton = address(this);
    }

    /**
     * @notice 修饰符，使函数只能通过 delegatecall 调用。
     * 如果通过常规调用调用该函数，则将会回滚。
     */
    modifier onlyDelegateCall() {
        require(address(this) != accessorSingleton, "SimulateTxAccessor 应仅通过 delegatecall 调用");
        _;
    }

    /**
     * @notice 模拟安全交易并返回使用的 gas、成功布尔值和返回数据。
     * @dev 执行指定的操作 {Call, DelegateCall} 并返回操作特定的数据。
     *      必须通过 delegatecall 调用。
     *      返回的数据格式为 `abi.encode(uint256(estimation), bool(success), bytes(returnData))`。
     *      具体来说，返回数据将是：
     *      `estimate:uint256 || success:bool || returnData.length:uint256 || returnData:bytes`。
     * @param to 目标地址。
     * @param value 原生代币值。
     * @param data 数据有效载荷。
     * @param operation 操作类型 {Call, DelegateCall}。
     * @return estimate 使用的 gas。
     * @return success 成功的布尔值。
     * @return returnData 返回的数据。
     */
    function simulate(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) external onlyDelegateCall returns (uint256 estimate, bool success, bytes memory returnData) {
        uint256 startGas = gasleft();
        success = execute(to, value, data, operation, gasleft());
        estimate = startGas - gasleft();
        // solhint-disable-next-line no-inline-assembly
        assembly {
            // 加载空闲内存位置
            let ptr := mload(0x40)
            // 我们通过将空闲内存位置设置为
            // 当前空闲内存位置 + 数据大小 + 32 字节的数据大小值来为返回数据分配内存
            mstore(0x40, add(ptr, add(returndatasize(), 0x20)))
            // 存储大小
            mstore(ptr, returndatasize())
            // 存储数据
            returndatacopy(add(ptr, 0x20), 0, returndatasize())
            // 将返回数据指向正确的内存位置
            returnData := ptr
        }
    }
}
