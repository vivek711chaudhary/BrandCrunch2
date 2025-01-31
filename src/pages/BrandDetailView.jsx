import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader } from '../components/ui/loader';
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HashtagIcon,
  LinkIcon,
  TagIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { getCombinedBrandData } from '../data/data';

const BrandDetailView = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const result = await getCombinedBrandData();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch brand data');
        }

        const brand = result.data.find(
          b => b.brand.toLowerCase() === brandName.toLowerCase()
        );

        if (!brand) {
          throw new Error('Brand not found');
        }

        setBrandData(brand);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-500 mb-4">Brand Not Found</h1>
          <p className="text-gray-400 mb-4">
            No data found for brand: {brandName}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { metadata, profile, contract_metadata, contract_profile, category } = brandData.data;

  const socialLinks = [
    { name: 'Discord', url: metadata.discord_url, icon: <HashtagIcon className="w-5 h-5" /> },
    { name: 'Twitter', url: metadata.twitter_url, icon: <GlobeAltIcon className="w-5 h-5" /> },
    { name: 'Instagram', url: metadata.instagram_url, icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { name: 'Medium', url: metadata.medium_url, icon: <TagIcon className="w-5 h-5" /> },
    { name: 'Telegram', url: metadata.telegram_url, icon: <UserGroupIcon className="w-5 h-5" /> },
  ].filter(link => link.url);

  const stats = [
    {
      title: 'Diamond Hands',
      value: profile.diamond_hands || '0',
      icon: <CircleStackIcon className="w-6 h-6 text-purple-400" />,
    },
    {
      title: 'Token Score',
      value: profile.token_score || '0',
      icon: <ChartBarIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      title: 'Profitable Trades',
      value: profile.profitable_trades || '0',
      icon: <ChartBarIcon className="w-6 h-6 text-green-400" />,
    },
    {
      title: 'Total Volume',
      value: `$${(profile.profitable_volume + profile.loss_making_volume).toLocaleString()}`,
      icon: <BuildingStorefrontIcon className="w-6 h-6 text-yellow-400" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {metadata.thumbnail_url && (
            <img
              src={metadata.thumbnail_url}
              alt={brandData.brand}
              className="w-20 h-20 rounded-full bg-gray-800"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">{brandData.brand}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <span className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-400">
                {category.category}
              </span>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400">
                {metadata.blockchain}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800/50 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Brand Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Description</h3>
                  <p className="text-gray-400 mt-2">{metadata.description || 'No description available.'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Category Details</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="text-white">{category.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Blockchain</p>
                      <p className="text-white">{category.blockchain}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Contract Address</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="text-sm bg-gray-900 rounded px-2 py-1 text-white">
                      {contract_metadata.contract_address}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(contract_metadata.contract_address)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contract Type</p>
                  <p className="text-white">{contract_metadata.contract_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Chain ID</p>
                  <p className="text-white">{contract_metadata.chain_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Trading Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Profitable Volume</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${contract_profile.profitable_volume.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Profitable Trades</p>
                    <p className="text-2xl font-bold text-green-400">
                      {contract_profile.profitable_trades}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Loss Making Volume</p>
                    <p className="text-2xl font-bold text-red-400">
                      ${contract_profile.loss_making_volume.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Loss Making Trades</p>
                    <p className="text-2xl font-bold text-red-400">
                      {contract_profile.loss_making_trades}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              {socialLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      {link.icon}
                      <span className="text-white">{link.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No social links available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandDetailView;
