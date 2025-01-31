import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Brands Overview' },
    { path: '/analysis', label: 'Advanced Analysis' },
    // { path: '/dashboard', label: 'Analysis' },
    // { path: '/metadata', label: 'Brand Metadata' },
    { path: '/metrics', label: 'Brand Metrics' },
    // { path: '/metrics-detail', label: 'Brand Metrics Detail' },
    { path: '/contract-metrics', label: 'Contract Metrics' },
    { path: '/contract-profile', label: 'Contract Profile' },
    { path: '/profile', label: 'Brand Profile' },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />

      {/* Main navbar */}
      <nav className="relative border-b border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center transform transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-white font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-primary group-hover:to-secondary transition-all duration-200">
                  Brand Analytics
                </span>
              </Link>
            </motion.div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group px-1"
                >
                  <motion.div
                    className="relative px-3 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
