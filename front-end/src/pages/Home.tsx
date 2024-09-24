import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Sahara-AI智能合约升级</h2>
            <div style={{ display: 'flex',justifyContent: 'center' }}>
                <button style={{ width: '300px',margin: '10px' }} onClick={() => navigate('/tech')}>我是技术</button>
                <button style={{ width: '300px',margin: '10px' }} onClick={() => navigate('/boss')}>我是老板</button>
            </div>
        </div>
    );
}

export default Home;
