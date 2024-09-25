import express,{ Request,Response } from 'express';
import { dbController } from '../controllers/dbController';

const router = express.Router();

router.get('/transaction/txhash/:txhash',async (req: Request,res: Response) => {
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

router.get('/transactions',async (req: Request,res: Response) => {
    try {
        const transactions = await dbController.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});
