import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import CreatePortfolio from './CreatePortfolio';
import PortfolioDetail from './PortfolioDetail';
import Login from './Login';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create" element={<CreatePortfolio />} />
                    <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
