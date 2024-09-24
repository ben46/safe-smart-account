// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  
import "../common/SelfAuthorized.sol";  

/**  
 * @title 所有者管理器（OwnerManager） - 管理安全合约的所有者和授权交易的阈值。  
 * @dev 使用链表存储所有者，因为 Solidity 编译器生成的代码  
 *      比使用动态数组更高效。  
 * @author Stefan George - @Georgi87  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract OwnerManager is SelfAuthorized {  
    event AddedOwner(address indexed owner);  
    event RemovedOwner(address indexed owner);  
    event ChangedThreshold(uint256 threshold);  

    //SENTINEL_OWNERS 在这段代码中是一个特殊的地址常量，用作链表的哨兵节点。它的主要作用是简化链表操作并提高代码的健壮性。让我解释一下它的具体用途：
    //SENTINEL_OWNERS 被用作所有者链表的起始点。在 setupOwners 函数中，第一个真实所有者被设置为 SENTINEL_OWNERS 的下一个节点。
    //在遍历所有者时（如 getOwners 函数），SENTINEL_OWNERS 用作循环的终止条件。当遍历到 SENTINEL_OWNERS 时，表示已经遍历完所有真实的所有者。
    //代码中多次检查确保新添加的所有者地址不等于 SENTINEL_OWNERS，这防止了将这个特殊地址误用为实际所有者。
    //使用 SENTINEL_OWNERS 作为链表的头节点，可以简化在链表开头添加或删除节点的操作，无需特殊处理第一个元素。
    //在 isOwner 函数中，通过检查地址是否为 SENTINEL_OWNERS 来快速排除这个特殊地址。
    //通过使用这个哨兵节点（SENTINEL_OWNERS），代码可以更简洁地处理链表操作，尤其是在处理边界情况（如空列表或只有一个所有者）时。这种方法提高了代码的可读性和维护性，同时也减少了潜在的错误。
    address internal constant SENTINEL_OWNERS = address(0x1);  
    // 链表结构示意  
    // SENTINEL_OWNERS -> Owner A -> Owner B -> Owner C -> SENTINEL_OWNERS  
    // 具体结构  
    // SENTINEL_OWNERS  
    //      |  
    //      v  
    //   +--------+  
    //   | Owner A|  
    //   +--------+  
    //      |  
    //      v  
    //   +--------+  
    //   | Owner B|  
    //   +--------+  
    //      |  
    //      v  
    //   +--------+  
    //   | Owner C|  
    //   +--------+  
    //      |  
    //      v  
    // SENTINEL_OWNERS  
    mapping(address => address) internal owners;  // 链表结构
    uint256 internal ownerCount;  
    uint256 internal threshold;  

    /**  
     * @notice 设置合约的初始存储。  
     * @param _owners 安全合约的所有者列表。  
     * @param _threshold 安全交易所需的确认数。  
     */  
    function setupOwners(address[] memory _owners, uint256 _threshold) internal {  
        // 阈值在初始化时只能为 0。  
        // 检查可确保设置函数只能被调用一次。  
        require(threshold == 0, "GS200");  
        // 验证阈值小于已添加的所有者数量。  
        require(_threshold <= _owners.length, "GS201");  
        // 至少需要有一个安全合约所有者。  
        require(_threshold >= 1, "GS202");  
        // 初始化安全合约所有者。  
        address currentOwner = SENTINEL_OWNERS;  
        for (uint256 i = 0; i < _owners.length; i++) {  
            // 所有者地址不能为空。  
            address owner = _owners[i];  
            require(owner != address(0) && owner != SENTINEL_OWNERS && owner != address(this) && currentOwner != owner, "GS203");  
            // 不允许重复的所有者。  
            require(owners[owner] == address(0), "GS204");  
            owners[currentOwner] = owner;  
            currentOwner = owner;  
        }  
        owners[currentOwner] = SENTINEL_OWNERS;  
        ownerCount = _owners.length;  
        threshold = _threshold;  
    }  

    /**  
     * @notice 将所有者 `owner` 添加到安全合约，并将阈值更新为 `_threshold`。  
     * @dev 这只能通过安全交易完成。  
     * @param owner 新的所有者地址。  
     * @param _threshold 新的阈值。  
     */  
    function addOwnerWithThreshold(address owner, uint256 _threshold) public authorized {  
        // 所有者地址不能为空，不能为 sentinel 或安全合约本身。  
        require(owner != address(0) && owner != SENTINEL_OWNERS && owner != address(this), "GS203");  
        // 不允许重复的所有者。  
        require(owners[owner] == address(0), "GS204");  
        owners[owner] = owners[SENTINEL_OWNERS];  
        owners[SENTINEL_OWNERS] = owner;  
        ownerCount++;  
        emit AddedOwner(owner);  
        // 如果阈值发生变化，则更改阈值。  
        if (threshold != _threshold) changeThreshold(_threshold);  
    }  

    /**  
     * @notice 从安全合约中移除所有者 `owner`，并将阈值更新为 `_threshold`。  
     * @dev 这只能通过安全交易完成。  
     * @param prevOwner 指向要移除的所有者的前一个所有者，在链表中  
     * @param owner 要移除的所有者地址。  
     * @param _threshold 新的阈值。  
     */  
    function removeOwner(address prevOwner, address owner, uint256 _threshold) public authorized {  
        // 仅允许在仍可达到阈值的情况下移除所有者。  
        require(ownerCount - 1 >= _threshold, "GS201");  
        // 验证所有者地址并检查其是否对应于所有者索引。  
        require(owner != address(0) && owner != SENTINEL_OWNERS, "GS203");  
        require(owners[prevOwner] == owner, "GS205");  
        owners[prevOwner] = owners[owner];  
        owners[owner] = address(0);  
        ownerCount--;  
        emit RemovedOwner(owner);  
        // 如果阈值发生变化，则更改阈值。  
        if (threshold != _threshold) changeThreshold(_threshold);  
    }  

    /**  
     * @notice 用 `newOwner` 替换安全合约中的所有者 `oldOwner`。  
     * @dev 这只能通过安全交易完成。  
     * @param prevOwner 指向要替换的所有者的前一个所有者，在链表中  
     * @param oldOwner 要替换的所有者地址。  
     * @param newOwner 新的所有者地址。  
     */  
    function swapOwner(address prevOwner, address oldOwner, address newOwner) public authorized {  
        // 所有者地址不能为空，不能为 sentinel 或安全合约本身。  
        require(newOwner != address(0) && newOwner != SENTINEL_OWNERS && newOwner != address(this), "GS203");  
        // 不允许重复的所有者。  
        require(owners[newOwner] == address(0), "GS204");  
        // 验证 oldOwner 地址并检查其对应于所有者索引。  
        require(oldOwner != address(0) && oldOwner != SENTINEL_OWNERS, "GS203");  
        require(owners[prevOwner] == oldOwner, "GS205");  
        owners[newOwner] = owners[oldOwner];  
        owners[prevOwner] = newOwner;  
        owners[oldOwner] = address(0);  
        emit RemovedOwner(oldOwner);  
        emit AddedOwner(newOwner);  
    }  

    /**  
     * @notice 将安全合约的阈值更改为 `_threshold`。  
     * @dev 这只能通过安全交易完成。  
     * @param _threshold 新的阈值。  
     */  
    function changeThreshold(uint256 _threshold) public authorized {  
        // 验证阈值小于所有者数量。  
        require(_threshold <= ownerCount, "GS201");  
        // 至少需要有一个安全合约所有者。  
        require(_threshold >= 1, "GS202");  
        threshold = _threshold;  
        emit ChangedThreshold(threshold);  
    }  

    /**  
     * @notice 返回安全交易所需的确认数，即阈值。  
     * @return 阈值数量。  
     */  
    function getThreshold() public view returns (uint256) {  
        return threshold;  
    }  

    /**  
     * @notice 返回 `owner` 是否为安全合约的所有者。  
     * @return 布尔值，表示所有者是否为安全合约的所有者。  
     */  
    function isOwner(address owner) public view returns (bool) {  
        return owner != SENTINEL_OWNERS && owners[owner] != address(0);  
    }  

    /**  
     * @notice 返回安全合约所有者的列表。  
     * @return 安全合约所有者的数组。  
     */  
    function getOwners() public view returns (address[] memory) {  
        address[] memory array = new address[](ownerCount);  

        // 填充返回数组  
        uint256 index = 0;  
        address currentOwner = owners[SENTINEL_OWNERS];  
        while (currentOwner != SENTINEL_OWNERS) {  
            array[index] = currentOwner;  
            currentOwner = owners[currentOwner];  
            index++;  
        }  
        return array;  
    }  
}