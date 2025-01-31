import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNFTBrandMetricsData } from '../api/nftBrandMetricsApi';
import BrandMetricsDetailBox from '../components/BrandMetricsDetailBox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Loader } from '../components/ui/loader';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4
    }
  }
};

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const NFTBrandMetricsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [expandedBrand, setExpandedBrand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchNFTBrandMetricsData();
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch NFT brand metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (brandId) => {
    setExpandedBrand(expandedBrand === brandId ? null : brandId);
  };

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-red-500 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
              <CardTitle className="mb-2">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <motion.div
        className="min-h-screen w-full"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl mb-3">
              NFT Brand Metrics Detail
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Track comprehensive performance metrics and insights for NFT brands
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-64 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader />
                <CardDescription>Loading brand metrics...</CardDescription>
              </motion.div>
            ) : (
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    className="grid grid-cols-1 gap-6 w-full"
                    variants={pageVariants}
                  >
                    {metrics.map((brand, index) => (
                      <motion.div
                        key={brand.contracts}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full transform hover:scale-[1.01] transition-transform duration-200"
                      >
                        <BrandMetricsDetailBox
                          metrics={brand}
                          isExpanded={expandedBrand === brand.contracts}
                          onToggle={() => handleToggle(brand.contracts)}
                        />
                      </motion.div>
                    ))}
                    {metrics.length === 0 && (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <CardDescription>No brand metrics available</CardDescription>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NFTBrandMetricsDetail;
