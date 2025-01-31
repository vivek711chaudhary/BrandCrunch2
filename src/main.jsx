import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles/globals.css';
import App from './App.jsx';
import NFTBrandMetadata from './pages/NFTBrandMetadata';
import NFTBrandMetrics from './pages/NFTBrandMetrics';
import NFTBrandProfile from './pages/BrandProfile';
import NFTContractMetrics from './pages/NFTContractMetrics';
import NFTBrandMetricsDetail from './pages/NFTBrandMetricsDetail';
import NFTBrandContractProfile from './pages/NFTContractProfile';
import NFTBrandCategory from './pages/NFTBrandCategory';
import { AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import Navbar from './components/Navbar.jsx';
import BrandAnalysis from './pages/BrandAnalysis'

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-gray-900 text-white" 
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
};

const Navigation = () => (
  <nav className="bg-gray-800 p-4 sticky top-0 z-50 w-full">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] flex items-center justify-between">
      {/* <div className="flex items-center space-x-4">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/metadata">Brand Metadata</NavLink>
        <NavLink to="/metrics">Brand Metrics</NavLink>
        <NavLink to="/metrics-detail">Brand Metrics Detail</NavLink>
        <NavLink to="/profile">Brand Profile</NavLink>
        <NavLink to="/contract-metrics">Contract Metrics</NavLink>
        <NavLink to="/contract-profile">Contract Profile</NavLink>
        <NavLink to="/categories">Brand Categories</NavLink>
      </div> */}
      <Navbar/>
    </div>
  </nav>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/metadata" element={<NFTBrandMetadata />} />
          <Route path="/metrics" element={<NFTBrandMetrics />} />
          <Route path="/metrics-detail" element={<NFTBrandMetricsDetail />} />
          <Route path="/profile" element={<NFTBrandProfile />} />
          <Route path="/contract-metrics" element={<NFTContractMetrics />} />
          <Route path="/contract-profile" element={<NFTBrandContractProfile />} />
          <Route path="/categories" element={<NFTBrandCategory />} />
          <Route path="/analysis" element={<BrandAnalysis />} />
          <Route path="/nft-contract-profile" element={<NFTBrandContractProfile />} />
        </Routes>
      </AnimatePresence>
    </Router>
  </React.StrictMode>
);
