import { Router,Request,Response } from 'express';

import { safeContract } from '../controllers/safeContract';
import { BytesLike, ethers } from 'ethers';
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

router.get('/sig/exec/txhash/:txhash',async (req: Request,res: Response) => {
    try {
        const txhash = req.query.txhash as string;
        const transactions = await dbController.getTransactionsByTxHash(txhash);
        if (transactions === undefined) {  
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const sigRequired = await safeContract.getThreshold();
        const transaction = transactions[0];

        const sigsArray: string[] = []
        transactions.forEach(transaction => {
            sigsArray.push(transaction.signature);
        });

        const sigs: BytesLike = convertSignaturesToByteLike(sigsArray);
        if (transactions.length >= sigRequired) {
            const tx = await safeContract.execTransaction(
                transaction.to,
                transaction.value,
                transaction.data,
                transaction.operation,
                "0",
                "0",
                "0",
                ethers.ZeroAddress,
                ethers.ZeroAddress,
                sigs
            )
            return res.json(tx);
        } else {
            return res.status(400).json({ error: 'Not enough signatures' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get transactions' });
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

function convertSignaturesToByteLike(sigs: string[]): BytesLike {
    let sigsBytes = "0x";

    sigs.forEach(sig => {
        // 移除 '0x' 前缀（如果存在）  
        sig = sig.startsWith('0x') ? sig.slice(2) : sig;

        // 确保签名长度正确（130个字符 = 65字节）  
        if (sig.length !== 130) {
            throw new Error(`Invalid signature length: ${sig}`);
        }

        // 提取 r, s, v  
        const r = sig.slice(0,64);
        const s = sig.slice(64,128);
        const v = sig.slice(128);

        // 按照合约期望的格式组合  
        sigsBytes += r + s + v;
    });

    // 验证最终结果的长度  
    if (sigsBytes.length !== 2 + sigs.length * 130) {
        throw new Error("Invalid combined signatures length");
    }

    return sigsBytes;
}