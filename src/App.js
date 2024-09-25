import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CreatePortfolio from './CreatePortfolio';
import PortfolioDetail from './PortfolioDetail';
import Login from './Login';
import './Styles.css'; // Import global styles

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
