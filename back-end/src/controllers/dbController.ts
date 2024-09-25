import sqlite3 from 'sqlite3';
import { open,Database } from 'sqlite';

interface Transaction {
    to: string;
    value: string;
    data: string;
    operation: string;
    signature: string;
    owner: string;
    txData: string;
    txHash: string;
}

class DbController {
    private db: Database | null = null;

    async initialize(): Promise<void> {
        this.db = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        await this.createTable();
    }

    private async createTable(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.exec(`  
      CREATE TABLE IF NOT EXISTS transactions (  
        id INTEGER PRIMARY KEY AUTOINCREMENT,  
        to TEXT NOT NULL,  
        value TEXT NOT NULL,  
        data TEXT,  
        operation TEXT NOT NULL,  
        signature TEXT,  
        owner TEXT NOT NULL,  
        txData TEXT,  
        txHash TEXT  
      )  
    `);
    }

    async insertTransaction(transaction: Transaction): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.run(`  
      INSERT INTO transactions (to, value, data, operation, signature, owner, txData, txHash)  
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)  
    `,[transaction.to,transaction.value,transaction.data,transaction.operation,
        transaction.signature,transaction.owner,transaction.txData,transaction.txHash]);

        return result.lastID!;
    }

    async getTransactionsByTxHash(txHash:string): Promise<Transaction[] | undefined> {
        if (!this.db) throw new Error('Database not initialized');

        return this.db.get<Transaction[]>('SELECT * FROM transactions WHERE txHash = ? order by owner asc', txHash);
    }

    async getTransactionById(id: number): Promise<Transaction | undefined> {
        if (!this.db) throw new Error('Database not initialized');

        return this.db.get<Transaction>('SELECT * FROM transactions WHERE id = ?',id);
    }

    async getAllTransactions(): Promise<Transaction[]> {
        if (!this.db) throw new Error('Database not initialized');

        return this.db.all<Transaction[]>('SELECT * FROM transactions');
    }

    async updateTransaction(id: number,transaction: Partial<Transaction>): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const fields = Object.keys(transaction).map(key => `${key} = ?`).join(', ');
        const values = Object.values(transaction);

        await this.db.run(`UPDATE transactions SET ${fields} WHERE id = ?`,[...values,id]);
    }

    async deleteTransaction(id: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.run('DELETE FROM transactions WHERE id = ?',id);
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}

const dbController = new DbController();
export { 
    Transaction,
    dbController
}