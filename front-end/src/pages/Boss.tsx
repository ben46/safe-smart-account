// src/pages/Boss.tsx
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ethers } from 'ethers';

import { Safe__factory } from '../typechain-types';
import { multiSigWallet as multiSigWalletAddress } from '../../address.json';

// 这里替换为你的合约地址和 ABI  
const provider = ethers.getDefaultProvider() as ethers.providers.JsonRpcProvider;
const contract = Safe__factory.connect(multiSigWalletAddress,provider.getSigner());
const endPoint = 'http://localhost:3000';
export { contract as safeContract };

const Boss: React.FC = () => {
    const [upgrades,setUpgrades] = useState([]);
    const [selectedUpgrade,setSelectedUpgrade] = useState(null);
    const [wallets,setWallets] = useState([]);

    useEffect(() => {
        const fetchUpgrades = async () => {
            const result = await axios.get(`${endPoint}/api/upgrade/all`); // 假设后端提供这个接口
            setUpgrades(result.data);
        };
        fetchUpgrades();
    },[]);

    const handleSelectChange = (selectedOption: string) => {
        // setSelectedUpgrade(selectedOption);
        // fetchWallets(selectedOption.value);
    };

    const fetchWallets = async (version: string) => {
        const result = await axios.get(`${endPoint}/api/wallets?version=${version}`); // 假设后端提供这个接口
        setWallets(result.data);
    };

    const handleSign = async () => {
        // if (!selectedUpgrade) return;

        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        // const signature = await signer.signMessage(selectedUpgrade.calldata);

        // // 发送签名到后端
        // await axios.post('/api/signatures',{
        //     version: selectedUpgrade.value,
        //     signature,
        // });

        // fetchWallets(selectedUpgrade.value);
    };


    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Sahara-AI合约升级</h1>
            <h2>多签钱包签名 (老板)</h2>
            <div style={{ width: '300px',margin: '20px auto' }}>
                <Select
                // options={upgrades.map(upgrade => ({ value: upgrade.version,label: upgrade.version }))}
                // onChange={handleSelectChange}
            />
            {/* {selectedUpgrade && (
                <div>
                    <p>Calldata: {selectedUpgrade.calldata}</p>
                    <p>升级内容: {selectedUpgrade.upgradeContent}</p>
                    <p>版本号: {selectedUpgrade.version}</p>
                    <p>提交人的邮箱: {selectedUpgrade.email}</p>
                    <p>提交人的名字: {selectedUpgrade.name}</p>
                </div>
            )} */}
            </div>

            {wallets.length > 0 && (
                <div>
                    <table style={{ margin: '20px auto',borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>钱包地址</th>
                                <th>是否已经签名</th>
                                <th>签名时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {wallets.map(wallet => (
                                <tr key={wallet.address}>
                                    <td>{wallet.address}</td>
                                    <td>{wallet.signed ? "是" : "否"}</td>
                                    <td>{wallet.signedAt ? new Date(wallet.signedAt).toLocaleString() : "-"}</td>
                                </tr>
                            ))} */}
                        </tbody>
                    </table>
                    <button onClick={handleSign}>签名</button>
                </div>
            )}
        </div>
    );
}

export default Boss;
