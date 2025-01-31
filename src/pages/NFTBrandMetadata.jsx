import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBrandMetadata } from '../data/data';
import CategoryBox from '../components/CategoryBox';
import BrandMetadataBox from '../components/BrandMetadataBox';

const NFTBrandMetadata = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) {
      setMetadata([]);
    }

    const { data, error } = await fetchBrandMetadata(forceRefresh);
    
    if (error) {
      setError(error);
    } else {
      setMetadata(data);
      // Set the first available category as active if we have new data
      if (data && data.length > 0 && !activeCategory) {
        const firstCategory = data[0].category?.toLowerCase() || 'uncategorized';
        setActiveCategory(firstCategory);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData(false); // Load cached data on initial render
  }, []);

  const handleRefresh = () => {
    fetchData(true); // Force refresh when button is clicked
  };

  // Dynamically group brands by category and get unique categories
  const { groupedBrands, categories } = useMemo(() => {
    const grouped = metadata.reduce((acc, brand) => {
      const category = brand.category?.toLowerCase() || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(brand);
      return acc;
    }, {});

    const uniqueCategories = Object.keys(grouped).map((category) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: grouped[category].length,
    }));

    return { groupedBrands: grouped, categories: uniqueCategories };
  }, [metadata]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleToggle = (brandId) => {
    setExpandedBrand(expandedBrand === brandId ? null : brandId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-red-500 text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/20 text-white p-4 md:p-8 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,0.9),rgba(24,24,27,0.7))]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.header
          className="mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400 to-purple-500">
                Explore NFT Brand Metadata
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                Browse through detailed metadata for NFT brands, organized by category. Dive into the rich details and learn more about the brands behind the NFTs.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </motion.header>

        <div className="space-y-12">
          {/* Categories Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-2xl -z-10" />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-white flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                  Categories
                </span>
              </h2>
              <span className="text-base text-blue-300/80 bg-blue-500/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {categories.length} Categories Found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group"
                >
                  <CategoryBox
                    category={category.name}
                    count={category.count}
                    isActive={activeCategory === category.id}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Brand Cards Section */}
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.section
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-2xl -z-10" />
                <div className="flex items-center justify-between border-b border-gray-700/50 pb-4 backdrop-blur-sm">
                  <div>
                    <h2 className="text-3xl font-semibold text-white flex items-center">
                      <span className="capitalize bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                        {activeCategory}
                      </span>
                      <span className="ml-4 text-base px-4 py-1.5 bg-blue-500/10 text-blue-300 rounded-full backdrop-blur-sm">
                        {groupedBrands[activeCategory]?.length || 0} Brands
                      </span>
                    </h2>
                    <p className="text-lg text-gray-300 mt-2">
                      Explore metadata for brands under "{activeCategory}".
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-gray-400 hover:text-white transition-colors duration-300 group"
                  >
                    <svg
                      className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {(groupedBrands[activeCategory] || []).map((brand, index) => (
                    <motion.div
                      key={brand.contract_address || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <BrandMetadataBox
                        metadata={brand}
                        isExpanded={expandedBrand === brand.contract_address}
                        onToggle={() => handleToggle(brand.contract_address)}
                      />
                    </motion.div>
                  ))}
                  {(groupedBrands[activeCategory] || []).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 text-center py-16 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700"
                    >
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-xl font-medium text-gray-400">
                        No brands found in this category.
                      </p>
                      <p className="text-base text-gray-500 mt-2">
                        Try selecting a different category.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NFTBrandMetadata;
