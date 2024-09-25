import { Router,Request,Response } from 'express';

const router = Router();

// mock 数据
const mockCalldata = [
    {
        id: '1',
        calldata: 'mock calldata 1',
        upgradeContent: 'mock upgrade content 1',
        version: '1.0',
        submitterEmail: 'mock@example.com',
        submitterName: 'Mock User',
        createdAt: new Date().toUTCString(),
    },
    // {
    //     id: '2',
    //     calldata: 'mock calldata 2',
    //     upgradeContent: 'mock upgrade content 2',
    //     version: '2.0',
    //     submitterEmail: 'mock2@example.com',
    //     submitterName: 'Mock User 2',
    //     createdAt: new Date().toUTCString(),
    // },
];

interface CalldataQuery {
    calldata: string;
    upgradeContent: string;
    version: string;
    submitterEmail: string;
    submitterName: string;
}

router.get('/upgrade/all',async (req: Request,res: Response) => {
    try {
        return res.json(mockCalldata);
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
        submitterName,
    };

    try {
        const newUpgrade = {
            id: `${mockCalldata.length + 1}`,
            calldata: upgrade.calldata,
            upgradeContent: upgrade.upgradeContent,
            version: upgrade.version,
            submitterEmail: upgrade.submitterEmail,
            submitterName: upgrade.submitterName,
            createdAt: new Date().toUTCString(),
        };

        mockCalldata.push(newUpgrade);
        res.json({
            status: 'success',
            upgrade: newUpgrade,
            id: newUpgrade.id,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add upgrade' });
    }
});

export { router as calldataRouter };
