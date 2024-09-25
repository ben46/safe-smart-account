
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

// import { Safe__factory } from '../typechain-types';
// const mulltiSigWalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// // const provider = ethers.getDefaultProvider() as ethers.providers.JsonRpcProvider;
// // const contract = Safe__factory.connect(mulltiSigWalletAddress,provider.getSigner());
const endPoint = 'http://localhost:3000';
// // export { contract as safeContract };

interface Calldata {
    id: string;
    calldata: string;
    upgradeContent: string;
    version: string;
    submitterEmail: string;
    submitterName: string;
    createdAt?: string;
}

interface Signature {
    calldataId: string;
    to: string;
    value: string;
    data: string;
    operation: string;
    signature: string;
    owner: string;
    txData: string;
    txHash: string;
}

const Boss: React.FC = () => {
    const [calldatas,setCalldatas] = useState<Calldata[]>([]);
    const [signatures,setSignatures] = useState<{ [key: string]: Signature[] }>({});

    useEffect(() => {
        // const fetchUpgrades = async () => {
        //     const result = await axios.get(`${endPoint}/api/upgrade/all`);
        //     setCalldatas(result.data);
        //     for (const calldata of result.data) {
        //         await fetchSignatures(calldata.id);
        //     }
        // };
        // fetchUpgrades();
    },[]);

    const fetchSignatures = async (calldataId: string) => {
        const result = await axios.get(`${endPoint}/api/sig?calldataId=${calldataId}`);
        setSignatures(prev => ({ ...prev,[calldataId]: result.data }));
    };

    const handleSign = async (selectedCalldataId: string,selectedCalldata: string) => {
        // const signer = provider.getSigner(); // fix this
        // const signature = await signer.signMessage(selectedCalldata);
        // await axios.post('/api/sig/add',{
        //     calldataId: selectedCalldataId,
        //     data: selectedCalldata,
        //     signature: signature,
        //     owner: await signer.getAddress()
        // });
        // await fetchSignatures(selectedCalldataId);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center my-8">Sahara-AI合约升级</h1>
            <h2 className="text-2xl font-semibold text-center mb-8">多签钱包签名 (老板)</h2>
            {calldatas.map((calldata) => (
                <div key={calldata.id} className="mb-8 p-6 border rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Calldata ID: {calldata.id}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p><strong>Calldata:</strong> {calldata.calldata}</p>
                            <p><strong>Upgrade Content:</strong> {calldata.upgradeContent}</p>
                            <p><strong>Version:</strong> {calldata.version}</p>
                        </div>
                        <div>
                            <p><strong>Submitter Email:</strong> {calldata.submitterEmail}</p>
                            <p><strong>Submitter Name:</strong> {calldata.submitterName}</p>
                            <p><strong>Created At:</strong> {calldata.createdAt}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSign(calldata.id,calldata.calldata)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign
                    </button>

                    <h4 className="text-lg font-semibold mt-6 mb-2">Signatures:</h4>
                    {signatures[calldata.id] && signatures[calldata.id].length > 0 ? (
                        signatures[calldata.id].map((sig,index) => (
                            <div key={index} className="mb-4 p-4 border rounded">
                                <p><strong>To:</strong> {sig.to}</p>
                                <p><strong>Value:</strong> {sig.value}</p>
                                <p><strong>Data:</strong> {sig.data}</p>
                                <p><strong>Operation:</strong> {sig.operation}</p>
                                <p><strong>Signature:</strong> {sig.signature}</p>
                                <p><strong>Owner:</strong> {sig.owner}</p>
                                <p><strong>Tx Data:</strong> {sig.txData}</p>
                                <p><strong>Tx Hash:</strong> {sig.txHash}</p>
                            </div>
                        ))
                    ) : (
                        <p>No signatures yet.</p>
                    )}
                </div>
            ))} 
         </div>
    );
}

export default Boss;
