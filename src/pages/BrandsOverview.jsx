import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getCombinedBrandData } from '../data/data';
import { fetchNFTBrandMetadata } from '../api/nftMetadata';
import CategoryBox from '../components/CategoryBox';
import BrandFilters from '../components/BrandFilters';
import { analyzeBrandOverview } from '../services/aiAnalysis/brandOverviewAnalysis';

// Import background images
import sportsImg from '../assets/sports.jpeg';
import fashionImg from '../assets/fashion.jpeg';
import collectiblesImg from '../assets/collectibles.jpeg';
import foodsImg from '../assets/Foodsbeverages.jpeg';
import skincareImg from '../assets/Skincarecosmetics.jpeg';
import mediaImg from '../assets/media.jpeg';
import travelImg from '../assets/travel.jpeg';
import unknownImg from '../assets/unknown.jpeg';

const CACHE_KEYS = {
  BRANDS_DATA: 'brands_overview_data',
  METADATA: 'brands_metadata',
  CATEGORIES: 'brands_categories',
  STATS: 'brands_stats'
};

// Map categories to their respective images
const categoryImages = {
  'Sports': sportsImg,
  'Fashion': fashionImg,
  'Collectibles': collectiblesImg,
  'Food & Beverages': foodsImg,
  'Foods & Beverages': foodsImg,
  'Skincare & Cosmetics': skincareImg,
  'Media & Entertainment': mediaImg,
  'Travel & Hospitality': travelImg,
  'Unknown': unknownImg
};

// Category colors for different brand categories with proper naming
const CATEGORY_COLORS = {
  'sports': { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444' },  // Red
  'travel': { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981' },  // Emerald
  'food & beverage': { bg: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B' },  // Amber
  'fashion': { bg: 'rgba(147, 51, 234, 0.2)', text: '#9333EA' },  // Purple
  'media & entertainment': { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6' },  // Blue
  'collectibles': { bg: 'rgba(236, 72, 153, 0.2)', text: '#EC4899' },  // Pink
  'skincare & cosmetics': { bg: 'rgba(14, 165, 233, 0.2)', text: '#0EA5E9' },  // Sky Blue
  'unknown': { bg: 'rgba(156, 163, 175, 0.2)', text: '#9CA3AF' }  // Gray for unknown
};

// Format category name for display
const formatCategoryName = (category) => {
  return category
    .split(' & ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' & ');
};

const BrandCard = ({ brand, category }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  
  const categoryStyle = CATEGORY_COLORS[category?.toLowerCase() || 'unknown'];
  
  const getNormalizedString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const categoryImage = categoryImages[category] || 
    categoryImages[Object.keys(categoryImages).find(key => 
      getNormalizedString(key).includes(getNormalizedString(category)) ||
      getNormalizedString(category).includes(getNormalizedString(key))
    )] || categoryImages['Unknown'];

  const data = brand.data || {};
  const metadata = data.metadata || {};
  const metrics = data.metrics || {};
  const profile = data.profile || {};
  const contractMetrics = data.contract_metrics || {};

  const socialLinks = [
    { name: 'Discord', url: metadata.discord_url },
    { name: 'Instagram', url: metadata.instagram_url },
    { name: 'Medium', url: metadata.medium_url },
    { name: 'Telegram', url: metadata.telegram_url },
    { name: 'Twitter', url: metadata.twitter_url }
  ].filter(link => link.url);

  const formatNumber = (num) => {
    if (!num) return 'Not Available';
    const n = parseFloat(num);
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
  };

  const formatCurrency = (value) => {
    if (!value) return 'Not Available';
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Not Available';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatContractAddress = (address) => {
    if (!address) return 'Not Available';
    return (
      <div className="flex items-center space-x-2">
        <span className="font-mono text-sm">{address}</span>
        <button
          onClick={() => copyToClipboard(address)}
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg 
            className="w-4 h-4 text-gray-400 hover:text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
            />
          </svg>
        </button>
      </div>
    );
  };

  const renderDescription = (description) => {
    if (!description) return 'Not Available';
    
    const maxLength = 150; // Show first 150 characters initially
    const isLongText = description.length > maxLength;
    
    return (
      <div className="space-y-2">
        <p className={`text-gray-300 text-sm leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
          {showFullDescription ? description : description.slice(0, maxLength)}
          {!showFullDescription && isLongText && '...'}
        </p>
        {isLongText && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDescription(!showFullDescription);
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          >
            {showFullDescription ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  };

  const renderMetricRow = (label, value, isCurrency = false, fullWidth = false, isDescription = false) => {
    const formattedValue = isCurrency ? formatCurrency(value) : 
                          isDescription ? renderDescription(value) : 
                          (value || 'Not Available');
    const valueClassName = isCurrency && value ? 'text-green-400 font-medium' : 'text-gray-300';
    
    return (
      <div className={`${fullWidth ? 'block' : 'flex justify-between items-center'} py-2`}>
        <span className="text-gray-400">{label}:</span>
        {fullWidth ? (
          <div className={`${valueClassName} mt-2`}>
            {formattedValue}
          </div>
        ) : (
          <span className={valueClassName}>{formattedValue}</span>
        )}
      </div>
    );
  };

  const fetchAIAnalysis = async () => {
    if (aiAnalysis || isAnalysisLoading) return;
    
    try {
      setIsAnalysisLoading(true);
      setAnalysisError(null);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const analysis = await analyzeBrandOverview(brand, apiKey);
      setAiAnalysis(analysis);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setAnalysisError(err.message || 'Failed to generate analysis');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai_analysis') {
      fetchAIAnalysis();
    }
  }, [activeTab]);

  const extractScoreFromAnalysis = (analysis) => {
    const scoreMatch = analysis.match(/(\d+)\/100/);
    return scoreMatch ? parseInt(scoreMatch[1]) : null;
  };

  const ScoreIndicator = ({ score }) => {
    const percentage = score || 0;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{score || 0}</span>
            <span className="text-gray-400">/100</span>
          </div>
          <span className={`text-sm ${
            percentage >= 80 ? 'text-green-400' :
            percentage >= 60 ? 'text-yellow-400' :
            percentage >= 40 ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {percentage >= 80 ? 'Excellent' :
             percentage >= 60 ? 'Good' :
             percentage >= 40 ? 'Fair' :
             'Poor'}
          </span>
        </div>
        <div className="relative w-full h-1.5 bg-gray-700 rounded-full">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full ${
              percentage >= 80 ? 'bg-green-500' :
              percentage >= 60 ? 'bg-yellow-500' :
              percentage >= 40 ? 'bg-orange-500' :
              'bg-red-500'
            } transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // const AnalysisSection = ({ title, content }) => {
  //   const [isExpanded, setIsExpanded] = useState(true);
    
  //   return (
  //     <div className="mb-4 bg-gray-800/40 rounded-lg p-4">
  //       <button
  //         onClick={() => setIsExpanded(!isExpanded)}
  //         className="w-full flex items-center justify-between text-white hover:text-blue-300 transition-colors"
  //       >
  //         <span className="text-base font-medium analysis-heading">{title}</span>
  //         <svg
  //           className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //         >
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  //         </svg>
  //       </button>
  //       {isExpanded && (
  //         <div className="mt-3 text-white/90 analysis-text">
  //           {content}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const formatAnalysisText = (text) => {
    if (!text) return [];

    const sections = text.split('\n\n').reduce((acc, section) => {
      const [title, ...content] = section.split('\n');
      if (title.includes('Performance Score')) return acc;

      const formattedContent = content.map(line => {
        if (line.startsWith('*') || line.startsWith('•')) {
          return (
            <div key={line} className="flex items-start space-x-2.5 mb-2.5">
              <span className="text-blue-400 mt-1">•</span>
              <span className="text-[15px] leading-relaxed">{line.replace(/^[*•]\s*/, '')}</span>
            </div>
          );
        }
        return <p key={line} className="mb-2.5 text-[15px] leading-relaxed">{line}</p>;
      });

      acc.push({
        title: title.replace(/\*\*/g, ''),
        content: <div className="space-y-1.5">{formattedContent}</div>
      });

      return acc;
    }, []);

    return sections;
  };

  const AnalysisSection = ({ title, content }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 tracking-tight">
        {title}
      </h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-base leading-relaxed text-gray-700 font-normal tracking-wide">
          {content}
        </p>
      </div>
    </div>
  );
};

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="w-full overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-gray-800 border-gray-700">
        <CardHeader className="relative p-4" style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${categoryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <CardTitle className="text-white text-xl font-bold">
            {brand.brand || 'Unknown Brand'}
          </CardTitle>
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm"
            style={{ 
              backgroundColor: categoryStyle?.bg || CATEGORY_COLORS.unknown.bg,
              color: categoryStyle?.text || CATEGORY_COLORS.unknown.text
            }}>
            {category || 'Unknown'}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Progress</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="ai_analysis">AI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-2">
              {renderMetricRow('Description', metadata.description || profile.description, false, true, true)}
              {renderMetricRow('Category', category)}
              {renderMetricRow('Total Volume', metrics.total_volume, true)}
              {renderMetricRow('Total Revenue', metrics.total_revenue, true)}
            </TabsContent>

            <TabsContent value="performance" className="mt-4 space-y-2">
              {renderMetricRow('Growth Rate', metrics.growth_rate ? `${metrics.growth_rate.toFixed(2)}%` : null)}
              {renderMetricRow('Primary Sale Revenue', metrics.primary_sale_revenue, true)}
              {renderMetricRow('Secondary Sale Revenue', metrics.secondary_sale_revenue, true)}
              {renderMetricRow('Royalty Revenue', metrics.royalty_revenue, true)}
              {renderMetricRow('Market Cap', metrics.mcap, true)}
            </TabsContent>

            <TabsContent value="contracts" className="mt-4 space-y-2">
              {renderMetricRow('Number of Contracts', metrics.No_of_contracts)}
              <div className="flex justify-between items-start py-2">
                <span className="text-gray-400">Contract Address:</span>
                <div className="flex-1 ml-4 text-right">
                  {formatContractAddress(metrics.contracts || contractMetrics.contract)}
                </div>
              </div>
              {renderMetricRow('Blockchain', metrics.blockchain)}
              {renderMetricRow('Chain ID', metrics.chain_id)}
            </TabsContent>

            <TabsContent value="social" className="mt-4 space-y-2">
              {socialLinks.length > 0 ? (
                socialLinks.map((link, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-400">{link.name}:</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate ml-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {truncateText(link.url, 30)}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No social links available</p>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="mt-4 space-y-2">
              {renderMetricRow('Total Assets', metrics.assets_all)}
              {renderMetricRow('Holders', metrics.holders)}
              {renderMetricRow('Traders', metrics.traders)}
              {renderMetricRow('Retained Traders', metrics.retained_traders)}
              {renderMetricRow('Interactions', metrics.interactions)}
            </TabsContent>

            <TabsContent value="ai_analysis" className="mt-4">
              <div className="min-h-[500px] bg-gray-900/50 rounded-lg">
                {isAnalysisLoading ? (
                  <div className="flex flex-col items-center justify-center h-[500px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-400 text-sm">Generating analysis...</p>
                  </div>
                ) : analysisError ? (
                  <div className="p-6">
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                      <p className="text-sm">{analysisError}</p>
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="p-6">
                    {/* Brand Metrics Analysis Title */}
                    <div className="flex items-center space-x-2 mb-6">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h2 className="text-lg font-semibold text-white analysis-heading">Brand Overview Analysis</h2>
                    </div>

                    {/* Score Section */}
                    <div className="mb-6 bg-gray-800/40 rounded-lg p-4">
                      <h3 className="text-base font-medium text-white mb-3 analysis-heading">Brand Performance Score</h3>
                      <ScoreIndicator score={extractScoreFromAnalysis(aiAnalysis)} />
                    </div>
                    
                    {/* Analysis Sections */}
                    {/* <div className=" gap-4 overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: 'calc(500px - 200px)' }}>
                      {formatAnalysisText(aiAnalysis).map((section, index) => (
                        <AnalysisSection
                          key={index}
                          title={section.title}
                          content={section.content}
                        />
                      ))}
                    </div> */}

<div 
      className="gap-4 overflow-y-auto custom-scrollbar pr-2 bg-white p-6 rounded-lg shadow-sm"
      style={{ maxHeight: 'calc(500px - 200px)' }}
    >
      {formatAnalysisText(aiAnalysis).map((section, index) => (
        <AnalysisSection
          key={index}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px]">
                    <button
                      onClick={() => fetchAIAnalysis()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors analysis-text font-medium"
                    >
                      Generate Analysis
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CategoryBoxSmall = ({ category, count, isActive, onClick }) => {
  const categoryStyle = CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.unknown;
  
  // Get background image using case-insensitive lookup
  const getNormalizedString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const backgroundImage = categoryImages[category] || 
    categoryImages[Object.keys(categoryImages).find(key => 
      getNormalizedString(key).includes(getNormalizedString(category)) ||
      getNormalizedString(category).includes(getNormalizedString(key))
    )] || categoryImages['Unknown'];
  
  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-4 transition-all duration-300 overflow-hidden relative ${
        isActive 
          ? 'border border-blue-500/30 shadow-lg shadow-blue-500/20' 
          : 'border border-gray-700/50 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for better text visibility with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 transition-opacity duration-500" />

      {/* Animated gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500
        ${isActive 
          ? 'from-blue-500/30 via-purple-500/30 to-pink-500/30 group-hover:opacity-100' 
          : 'from-blue-400/20 via-purple-400/20 to-pink-400/20 group-hover:opacity-100'
        }`} 
      />

      <div className="relative z-10 flex items-center justify-between">
        <span 
          className="text-sm font-semibold text-white"
          style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            letterSpacing: '0.025em'
          }}
        >
          {formatCategoryName(category)}
        </span>
        <span 
          className={`px-3.5 py-1.5 text-sm font-semibold rounded-full backdrop-blur-md 
            ${isActive 
              ? 'bg-white/20 text-white border border-white/30' 
              : 'bg-black/40 text-white border border-white/10 hover:bg-white/10'
            } shadow-sm transition-all duration-300`}
          style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            background: isActive 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
              : 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))'
          }}
        >
          {count}
        </span>
      </div>
    </motion.div>
  );
};

const LoadingMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="text-gray-400 mt-3 text-sm"
  >
    {message}
  </motion.div>
);

const BrandsOverview = () => {
  const [brandsData, setBrandsData] = useState([]);
  const [brandCategories, setBrandCategories] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    blockchain: 'ethereum',
    timeRange: '24h',
    offset: 0,
    limit: 10,
    sortBy: 'total_volume',
    sortOrder: 'desc'
  });

  const handleParamChange = (param, value) => {
    console.log('Changing parameter:', param, 'to value:', value);
    setParams(prev => ({
      ...prev,
      [param]: value,
      offset: param === 'limit' ? prev.offset : 0
    }));
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data with params:', params);

      const [brandData, metadataResponse] = await Promise.all([
        getCombinedBrandData(params),
        fetchNFTBrandMetadata(params)
      ]);

      console.log('Received brand data:', brandData);
      console.log('Received metadata:', metadataResponse);

      if (!brandData || !Array.isArray(brandData)) {
        throw new Error('Invalid brand data response from server');
      }

      if (!metadataResponse || !metadataResponse.data || !Array.isArray(metadataResponse.data)) {
        throw new Error('Invalid metadata response from server');
      }

      const categoryMap = {};
      const stats = {};

      // Process metadata to get categories
      metadataResponse.data.forEach(item => {
        if (item && item.brand && item.category) {
          categoryMap[item.brand.toLowerCase()] = item.category.toLowerCase();
        }
      });

      console.log('Category map:', categoryMap);

      // Process brand data and update category stats
      brandData.forEach(brand => {
        if (!brand || !brand.brand) {
          console.log('Skipping invalid brand:', brand);
          return;
        }
        
        const brandLower = brand.brand.toLowerCase();
        const category = categoryMap[brandLower] || 'unknown';
        stats[category] = (stats[category] || 0) + 1;
      });

      console.log('Category stats:', stats);

      setBrandsData(brandData);
      setBrandCategories(categoryMap);
      setCategoryStats(stats);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch brands data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, [params]); // Refresh when params change

  const filteredBrands = brandsData.filter(brand => {
    if (!activeCategory) return true;
    if (!brand || !brand.brand) {
      console.log('Filtering out invalid brand:', brand);
      return false;
    }
    
    const brandLower = brand.brand.toLowerCase();
    const brandCategory = brandCategories[brandLower] || 'unknown';
    return brandCategory.toLowerCase() === activeCategory.toLowerCase();
  });

  console.log('Filtered brands:', filteredBrands);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading brands data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">NFT Brand Overview</h1>
        <BrandFilters 
          blockchain={params.blockchain}
          timeRange={params.timeRange}
          limit={params.limit}
          sortBy={params.sortBy}
          sortOrder={params.sortOrder}
          onParamChange={handleParamChange}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading data:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <CategoryBox
          key="all"
          category="All"
          count={brandsData.length}
          isActive={!activeCategory}
          onClick={() => setActiveCategory(null)}
        />
        {Object.entries(categoryStats).map(([category, count]) => (
          <CategoryBox
            key={category}
            category={category}
            count={count}
            isActive={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand, index) => (
          <BrandCard
            key={`${brand.brand}-${index}`}
            brand={brand}
            category={brandCategories[brand.brand?.toLowerCase()] || 'unknown'}
          />
        ))}
      </div>

      {filteredBrands.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No brands found{activeCategory ? ` in ${activeCategory} category` : ''}.</p>
        </div>
      )}
    </div>
  );
};

export default BrandsOverview;
