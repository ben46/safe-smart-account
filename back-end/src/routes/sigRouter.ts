import { Router,Request,Response } from 'express';

import { safeContract } from '../controllers/safeContract';
import { ethers } from 'ethers';
const router = Router();
import { dbController,Transaction } from '../controllers/dbController';

interface TransactionQuery {
    data: string;
    signature: string;
    owner: string;
}  

router.get('/sig/txhash/:txhash',async (req: Request,res: Response) => {
    try {
        const txhash = req.params.txhash;
        const transactions = await dbController.getTransactionsByTxHash(txhash);
        if (transactions) {
            res.json(transactions);
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get transaction' });
    }
});

router.get('/sig/all',async (req: Request,res: Response) => {
    try {
        const transactions = await dbController.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});


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
        const signature: Transaction = {
            to: safeContract.target as string,
            value: "0",
            operation: "0",
            data: transaction.data,
            signature: transaction.signature,
            owner: transaction.owner,
            txHash: txHash,
            txData: txData
        }
        const id = await dbController.insertTransaction(signature);
        res.json({
            status: 'success',
            transaction: signature,
            id: id
        });
    } catch (error) {
        res.json({ status: 'failed' });
    }
});

export { router as sigRouter };  
