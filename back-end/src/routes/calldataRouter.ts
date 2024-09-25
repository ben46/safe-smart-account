import { Router,Request,Response } from 'express';
import { dbController,Calldata } from '../controllers/dbController';

const router = Router();

interface CalldataQuery {
    calldata: string;
    upgradeContent: string;
    version: string;
    submitterEmail: string;
    submitterName: string;
}

router.get('/upgrade/all',async (req: Request,res: Response) => {
    try {
        const upgrades = await dbController.getAllCalldatas();
        return res.json(upgrades);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get upgrades' });
    }
});  


router.post('/upgrade/add',async (req: Request,res: Response) => {
    const { calldata,upgradeContent,version,submitterEmail,submitterName } = req.body;

    const upgrade: CalldataQuery = {
        calldata,
        upgradeContent,
        version,
        submitterEmail,
        submitterName
    };

    try {
        const newUpgrade: Calldata = {
            calldata: upgrade.calldata,
            upgradeContent: upgrade.upgradeContent,
            version: upgrade.version,
            submitterEmail: upgrade.submitterEmail,
            submitterName: upgrade.submitterName,
            createdAt: new Date().toUTCString()
        };

        const id = await dbController.insertCalldata(newUpgrade);
        res.json({
            status: 'success',
            upgrade: newUpgrade,
            id: id
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add upgrade' });
    }
});  

export { 
    router as calldataRouter
}