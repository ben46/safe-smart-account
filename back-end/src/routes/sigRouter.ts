import { Router,Request,Response } from 'express';

import { safeContract } from '../controllers/safeContract';
import { ethers } from 'ethers';
const router = Router();

interface TransactionQuery {
    data: string;
    signature: string;
    owner: string;
}  

router.get('/sig/add',async (req,res) => {

    const { data,operation,signature,owner } = req.query;  

    // 将查询参数映射到结构体  
    const transaction: TransactionQuery = {
        data: data as string,
        signature: signature as string,
        owner: owner as string,
    };  
    
    const nonce = await safeContract.nonce()
    const txData = await safeContract.encodeTransactionData(
        safeContract.target as string,
        "0",
        transaction.data,
        "0","0","0","0",ethers.ZeroAddress,ethers.ZeroAddress,nonce
    )

    const txHash = await safeContract.getTransactionHash(
        safeContract.target as string,
        "0",
        transaction.data,
        "0","0","0","0",
        ethers.ZeroAddress,ethers.ZeroAddress,nonce
    )

    try {
        await safeContract.checkNSignatures(txHash,txData,transaction.signature,"1")
        res.json({ status: 'success' });
    } catch (error) {
        res.json({ status: 'failed' });
    }
});

export { router as sigRouter };  
