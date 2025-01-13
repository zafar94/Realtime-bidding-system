import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuctionDetail from './components/AuctionDetail';
import CreateAuction from './components/CreateAuction';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auction/:itemId" element={<AuctionDetail />} />
        <Route path="/create-auction" element={<CreateAuction />} />
      </Routes>
    </Router>
  );
};

export default App;
