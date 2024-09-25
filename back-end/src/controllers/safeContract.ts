

import { ethers } from 'ethers';
import "dotenv/config";
import { Safe__factory } from '../typechain-types';

// 这里替换为你的合约地址和 ABI  
const contractAddress = process.env.MULTI_SIG_WALLET_ADDR as string
const RPC = process.env.RPC as string
const provider = new ethers.JsonRpcProvider(RPC)
const PRIVATE_KEY = process.env.PRIVATE_KEY as string

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = Safe__factory.connect(contractAddress, wallet);

export { contract as safeContract };