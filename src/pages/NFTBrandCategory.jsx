import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import { Loader } from '../components/ui/loader';
import store from '../store/store';
import RefreshButton from '../components/RefreshButton';
import { fetchNFTBrandCategories } from '../api/nftBrandCategory';
import BrandCategoryCard from '../components/BrandCategoryCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { CardDescription } from '../components/ui/card';

const NFTBrandCategory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [useStore, setUseStore] = useState(true);

  useEffect(() => {
    const fetchDirectly = async () => {
      try {
        setLoading(true);
        const response = await fetchNFTBrandCategories();
        setBrands(response.data);
      } catch (err) {
        setError('Failed to fetch NFT brand categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = store.subscribe((state) => {
      if (useStore) {
        const { data, isLoading, error } = store.getNFTBrandCategories();
        setBrands(data || []);
        setLoading(isLoading);
        setError(error);
      }
    });

    if (useStore) {
      store.fetchNFTBrandCategories();
    } else {
      fetchDirectly();
    }

    return () => unsubscribe();
  }, [useStore]);

  const handleRefresh = () => {
    if (useStore) {
      store.fetchNFTBrandCategories();
    } else {
      fetchDirectly();
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(brands.map(brand => brand.category))].sort();

  // Filter brands based on category and search query
  const filteredBrands = brands.filter(brand => {
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    const matchesSearch = brand.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-red-500 text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xl font-bold mb-2">Error</p>
              <CardDescription>{error}</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <Loader />
        <CardDescription>Loading brand categories...</CardDescription>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            NFT Brand Categories
          </h1>
          <p className="text-gray-400">Explore and discover NFT brands by category</p>
        </header>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and Category Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-400">
          Showing {filteredBrands.length} {filteredBrands.length === 1 ? 'brand' : 'brands'}
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map((brand, index) => (
            <motion.div
              key={brand.contract_address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BrandCategoryCard brand={brand} />
            </motion.div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400">No brands found matching your criteria</p>
          </div>
        )}
        <RefreshButton 
          onClick={handleRefresh}
          useStore={useStore}
          onToggleStore={() => setUseStore(!useStore)}
        />
      </div>
    </div>
  );
};

export default NFTBrandCategory;
