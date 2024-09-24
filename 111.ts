import { assert } from "console";
import { ethers } from "ethers";

// 示例的合约信息和需要填入的参数  
const DOMAIN_SEPARATOR_TYPEHASH = "0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218"
const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8"

// 地址和其他必要信息  
const toAddress = "0x目标地址";
const value = ethers.utils.parseEther("0.1"); // 发送的ETH值  
const data = "0x"; // 交易数据负载（此处为例，实际可以替换)  
const operation = 0; // 操作类型 (0: call, 1: delegatecall)  
const safeTxGas = 0; // gas用量可设置为0  
const baseGas = 0; // 忽略  
const gasPrice = 0; // 忽略  
const gasToken = "0x"; // 忽略  
const refundReceiver = "0x退款接收者地址"; // 忽略  
const nonce = 0; // 交易的随机数  
const safeAddress = "0x00"

async function encodeTransactionData(
    to: string,
    value: ethers.BigNumber,
    data: string,
    operation: number,
    safeTxGas: number,
    baseGas: number,
    gasPrice: number,
    gasToken: string,
    refundReceiver: string,
    nonce: number,
    // chainId: number,
    contractAddress: string
): Promise<string> {
    const domainSeparator = "0x00"
    // TODO: get domainSeparator from contract
    assert(domainSeparator !== "0x00", "domainSeparator is required");

    const safeTxHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            [
                "bytes32",
                "address",
                "uint256",
                "bytes",
                "uint8",
                "uint256",
                "uint256",
                "uint256",
                "address",
                "address",
                "uint256",
            ],
            [
                SAFE_TX_TYPEHASH,
                to,
                value,
                ethers.utils.keccak256(data), // 取数据的哈希  
                operation,
                safeTxGas,
                baseGas,
                gasPrice,
                gasToken,
                refundReceiver,
                nonce
            ]
        )
    );

    return ethers.utils.keccak256(
        ethers.utils.concat([ethers.utils.toUtf8Bytes("\x19\x01"),domainSeparator,safeTxHash])
    );
}

// 示例函数生成签名  
async function signTransaction(privateKey: string,to: string,value: ethers.BigNumber,data: string) {
    const wallet = new ethers.Wallet(privateKey);
    const nonceValue = 0; // 这里需要管理nonce的值  
    assert(nonceValue !== 0, "nonceValue is required");
    const contractAddress = "0x你的合约地址"; // 替换为合约地址  
    const txHash = await encodeTransactionData(
        to, // access manager合约地址
        value,// 0
        data, // 升级
        0, // operation  
        0, // safeTxGas  
        0, // baseGas  
        0, // gasPrice  
        "0x", // gasToken  
        "0x", // refundReceiver  
        nonceValue,
        contractAddress
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(txHash));
    return signature;
}

// 使用示例  
const privateKey = "你的私钥"; // 请安全存储私钥  
signTransaction(privateKey,toAddress,value,data)
    .then(signature => {
        console.log("交易签名：",signature);
    })
    .catch(err => {
        console.error("签名失败：",err);
    });