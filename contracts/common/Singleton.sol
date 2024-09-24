// SPDX-License-Identifier: LGPL-3.0-only  
pragma solidity >=0.7.0 <0.9.0;  

/**  
 * @title Singleton - 单例合约的基础（应始终是第一个超类合约）  
 *        该合约与我们的代理合约紧密耦合（参见 `proxies/SafeProxy.sol`）  
 * @author Richard Meissner - @rmeissner  
 */  
abstract contract Singleton {  
    // 单例必须始终是第一个声明的变量，以确保与代理合约中的位置相同。  
    // 还应确保地址单独存储（使用一个完整字）。  
    address private singleton;  
}