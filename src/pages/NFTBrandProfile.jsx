import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNFTBrandProfiles } from '../api/nftBrandProfile';
import BrandProfileBox from '../components/BrandProfileBox';
import { cacheManager } from '../utils/cache';

const CACHE_KEY = 'nft_brand_profiles';

const NFTBrandProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [expandedBrand, setExpandedBrand] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Clear existing data when forcing refresh
      if (forceRefresh) {
        setProfiles([]);
        console.log('Forcing refresh, cleared existing data');
      }

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = cacheManager.get(CACHE_KEY);
        if (cachedData) {
          console.log('Using cached profile data from:', new Date(cachedData.timestamp).toLocaleTimeString());
          setProfiles(cachedData.data);
          setLoading(false);
          return;
        }
        console.log('No cached profile data found or cache expired');
      }

      console.log('Fetching fresh profile data from API...');
      const response = await fetchNFTBrandProfiles();
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Cache the successful response with timestamp
      const timestamp = Date.now();
      cacheManager.set(CACHE_KEY, {
        data: response.data,
        timestamp
      });
      console.log('Profile data cached at:', new Date(timestamp).toLocaleTimeString());

      setProfiles(response.data);
    } catch (err) {
      setError('Failed to fetch NFT brand profiles');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false); // Load cached data on initial render
  }, []);

  const handleRefresh = () => {
    fetchData(true); // Force refresh when button is clicked
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
    <div className="container mx-auto px-4 py-8 max-w-[1600px] bg-gray-900 text-white">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            NFT Brand Profiles
          </h1>
          <p className="text-gray-400">View detailed profiles of NFT brands</p>
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
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="mt-4 text-gray-400">Loading profiles...</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => {
            // Create a unique key using both profile ID and index
            const uniqueKey = `${profile.brand}-${profile.blockchain}-${index}`;
            
            return (
              <motion.div
                key={uniqueKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BrandProfileBox
                  profile={profile}
                  isExpanded={expandedBrand === profile.id}
                  onToggle={() => handleToggle(profile.id)}
                />
              </motion.div>
            );
          })}
          {profiles.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">No brand profiles available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTBrandProfile;
