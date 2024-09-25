import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Sahara-AI smart contracts upgrade</h2>
            <div style={{ display: 'flex',justifyContent: 'center' }}>
                <button style={{ width: '300px',margin: '10px' }} onClick={() => navigate('/tech')}>I am tech</button>
                <button style={{ width: '300px',margin: '10px' }} onClick={() => navigate('/boss')}>I am owner</button>
            </div>
        </div>
    );
}

export default Home;
