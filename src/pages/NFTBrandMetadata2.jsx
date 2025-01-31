import { useState, useEffect, useMemo } from 'react';
import CategoryBox from '../components/CategoryBox';
import BrandMetadataCard from '../components/BrandMetadataCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '../components/ui/loader';
import { Card, CardContent, CardDescription } from '../components/ui/card';
import store from '../store/store';
import RefreshButton from '../components/RefreshButton';

const NFTBrandMetadata2 = () => {
  const [metadata, setMetadata] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = store.subscribe((state) => {
      const { data, isLoading, error } = store.getBrandMetadata();
      setMetadata(data || []);
      setLoading(isLoading);
      setError(error);

      // Set the first available category as active if we have new data
      if (data && data.length > 0 && !activeCategory) {
        const firstCategory = data[0].category?.toLowerCase() || 'uncategorized';
        setActiveCategory(firstCategory);
      }
    });

    // Initial data load if not already loaded
    if (!store.getState().brandMetadata) {
      store.refreshData();
    } else {
      // If data exists, set it immediately
      const { data, isLoading, error } = store.getBrandMetadata();
      setMetadata(data || []);
      setLoading(isLoading);
      setError(error);
    }

    return () => unsubscribe();
  }, [activeCategory]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-red-500 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-2xl font-bold mb-3">Error</p>
              <CardDescription className="text-lg">{error}</CardDescription>
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
        <CardDescription className="text-xl text-gray-300">
          Loading NFT brand metadata, please wait...
        </CardDescription>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Brand Metadata 2</h1>
            <p className="text-gray-400">Explore and analyze NFT brand metadata</p>
          </div>
          <RefreshButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoryBox
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {activeCategory
                  ? groupedBrands[activeCategory]?.map((brand, index) => (
                      <BrandMetadataCard
                        key={brand.id || index}
                        brand={brand}
                        index={index}
                      />
                    ))
                  : metadata.map((brand, index) => (
                      <BrandMetadataCard
                        key={brand.id || index}
                        brand={brand}
                        index={index}
                      />
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTBrandMetadata2;
