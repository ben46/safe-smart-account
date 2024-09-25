// src/pages/Tech.tsx
import React,{ useState } from 'react';
import axios from 'axios';
import './Tech.css'; // 引入CSS文件

const Tech: React.FC = () => {
    const [calldata,setCalldata] = useState("");
    const [upgradeContent,setUpgradeContent] = useState("");
    const [version,setVersion] = useState("");
    const [email,setEmail] = useState("");
    const [name,setName] = useState("");

    const handleSubmit = async () => {
        const data = { calldata,upgradeContent,version,email,name };
        await axios.post('/api/upgrades',data); // 假设后端提供这个接口
    };

    return (
        <div className="container">
            <h1 className="title">SAHARA-AI smart contracts upgrades</h1>
            <h2 className="subtitle">for tech</h2>
            <textarea
                placeholder="calldata"
                value={calldata}
                onChange={(e) => setCalldata(e.target.value)}
                className="textarea-calldata"
            />
            <textarea
                placeholder="upgrade content"
                value={upgradeContent}
                onChange={(e) => setUpgradeContent(e.target.value)}
                className="textarea-upgradeContent"
            />
            <input
                type="text"
                placeholder="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
            />
            <input
                type="email"
                placeholder="committer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="commiter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}

export default Tech;
