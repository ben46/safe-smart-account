// src/App.tsx
import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Tech from './pages/Tech';
import Boss from './pages/Boss';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tech" element={<Tech />} />
        <Route path="/boss" element={<Boss />} />
      </Routes>
    </Router>
  );
}

export default App;
