// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  
import "../common/Enum.sol";  
import "../common/SelfAuthorized.sol";  
import "./Executor.sol";  

/**  
 * @title 模块管理器（Module Manager） - 负责管理安全合约的模块  
 * @notice 模块是可以由安全合约的所有者添加到安全合约中的扩展，具有无限访问权限。  
           ⚠️ 警告：模块存在安全风险，因为它们可以执行任意交易，  
           因此只能将经过信任和审计的模块添加到安全合约中。恶意模块可能会  
           完全接管安全合约。  
 * @author Stefan George - @Georgi87  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract ModuleManager is SelfAuthorized, Executor {  
    event EnabledModule(address indexed module);  
    event DisabledModule(address indexed module);  
    event ExecutionFromModuleSuccess(address indexed module);  
    event ExecutionFromModuleFailure(address indexed module);  

    address internal constant SENTINEL_MODULES = address(0x1);  

    mapping(address => address) internal modules;  

    /**  
     * @notice 设置函数用于设置合约的初始存储。  
     *         可选择性地向另一个合约执行 delegate call 来设置模块。  
     * @param to 要执行的调用的可选目标地址。  
     * @param data 要执行的调用的可选数据。  
     */  
    function setupModules(address to, bytes memory data) internal {  
        require(modules[SENTINEL_MODULES] == address(0), "GS100");  
        modules[SENTINEL_MODULES] = SENTINEL_MODULES;  
        if (to != address(0)) {  
            require(isContract(to), "GS002");  
            // 设置必须成功完成，否则交易将失败。  
            require(execute(to, 0, data, Enum.Operation.DelegateCall, type(uint256).max), "GS000");  
        }  
    }  

    /**  
     * @notice 为安全合约启用模块 `module`。  
     * @dev 这只能通过安全交易实现。  
     * @param module 要被列入白名单的模块。  
     */  
    function enableModule(address module) public authorized {  
        // 模块地址不能为 null 或 sentinel。  
        require(module != address(0) && module != SENTINEL_MODULES, "GS101");  
        // 模块不能被添加两次。  
        require(modules[module] == address(0), "GS102");  
        modules[module] = modules[SENTINEL_MODULES];  
        modules[SENTINEL_MODULES] = module;  
        emit EnabledModule(module);  
    }  

    /**  
     * @notice 为安全合约禁用模块 `module`。  
     * @dev 这只能通过安全交易实现。  
     * @param prevModule 模块链表中的前一个模块。  
     * @param module 要移除的模块。  
     */  
    function disableModule(address prevModule, address module) public authorized {  
        // 验证模块地址并检查其是否对应于模块索引。  
        require(module != address(0) && module != SENTINEL_MODULES, "GS101");  
        require(modules[prevModule] == module, "GS103");  
        modules[prevModule] = modules[module];  
        modules[module] = address(0);  
        emit DisabledModule(module);  
    }  

    /**  
     * @notice 向 `to` 执行 `operation`（0: Call, 1: DelegateCall），并带有 `value`（原生代币）  
     * @dev 函数为虚拟函数，允许重写以便于 L2 单例发出事件进行索引。  
     * @param to 模块交易的目标地址。  
     * @param value 模块交易的以太币值。  
     * @param data 模块交易的数据有效载荷。  
     * @param operation 模块交易的操作类型。  
     * @return success 布尔标志，指示调用是否成功。  
     */  
    function execTransactionFromModule(  
        address to,  
        uint256 value,  
        bytes memory data,  
        Enum.Operation operation  
    ) public virtual returns (bool success) {  
        // 仅允许列入白名单的模块。  
        require(msg.sender != SENTINEL_MODULES && modules[msg.sender] != address(0), "GS104");  
        // 执行交易，无需进一步确认。  
        success = execute(to, value, data, operation, type(uint256).max);  
        if (success) emit ExecutionFromModuleSuccess(msg.sender);  
        else emit ExecutionFromModuleFailure(msg.sender);  
    }  

    /**  
     * @notice 向 `to` 执行 `operation`（0: Call, 1: DelegateCall），并带有 `value`（原生代币），并返回数据  
     * @param to 模块交易的目标地址。  
     * @param value 模块交易的以太币值。  
     * @param data 模块交易的数据有效载荷。  
     * @param operation 模块交易的操作类型。  
     * @return success 布尔标志，指示调用是否成功。  
     * @return returnData 调用返回的数据。  
     */  
    function execTransactionFromModuleReturnData(  
        address to,  
        uint256 value,  
        bytes memory data,  
        Enum.Operation operation  
    ) public returns (bool success, bytes memory returnData) {  
        success = execTransactionFromModule(to, value, data, operation);  
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

    /**  
     * @notice 返回模块是否启用  
     * @return 如果模块启用，则返回 true  
     */  
    function isModuleEnabled(address module) public view returns (bool) {  
        return SENTINEL_MODULES != module && modules[module] != address(0);  
    }  

    /**  
     * @notice 返回模块数组。  
     *         如果所有条目适合一个页面，下一指针将是 0x1。  
     *         如果还有其他页面，下一指针将是返回数组的最后一个元素。  
     * @param start 页面的起始地址。必须是一个模块或起始指针（0x1 地址）  
     * @param pageSize 应返回的最大模块数。必须大于 0  
     * @return array 模块数组。  
     * @return next 下一页的起始地址。  
     */  
    function getModulesPaginated(address start, uint256 pageSize) external view returns (address[] memory array, address next) {  
        require(start == SENTINEL_MODULES || isModuleEnabled(start), "GS105");  
        require(pageSize > 0, "GS106");  
        // 初始化数组，最大页大小  
        array = new address[](pageSize);  

        // 填充返回数组  
        uint256 moduleCount = 0;  
        next = modules[start];  
        while (next != address(0) && next != SENTINEL_MODULES && moduleCount < pageSize) {  
            array[moduleCount] = next;  
            next = modules[next];  
            moduleCount++;  
        }  

        /**  
          由于参数验证，我们可以假设循环将始终遍历有效的模块列表值，  
          而变量 `next` 将要么是启用的模块，要么是 sentinel 地址（表示结束）。   
          
          如果在循环中尚未到达结束，仍需将下一指针设置为模块数组的最后一个元素，  
          因为变量 `next`（其本身是一个模块）充当下一页起始的指针，但不包括在当前页中，  
          如果将其作为起始传递，则也不会包含在下一页中。  
        */  
        if (next != SENTINEL_MODULES) {  
            next = array[moduleCount - 1];  
        }  
        // 设置返回数组的正确大小  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            mstore(array, moduleCount)  
        }  
    }  

    /**  
     * @notice 如果 `account` 是合约，则返回 true。  
     * @dev 如果在合约的构造函数中调用此函数，将返回 false，  
     *      因为在构造函数完成之前，代码尚未真正创建。  
     * @param account 正在查询的地址  
     */  
    function isContract(address account) internal view returns (bool) {  
        uint256 size;  
        // solhint-disable-next-line no-inline-assembly  
        assembly {  
            size := extcodesize(account)  
        }  
        return size > 0;  
    }  
}