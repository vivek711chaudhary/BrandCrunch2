import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchBrandContractProfile } from '../data/data';
import { analyzeContractProfile } from '../services/aiAnalysis/contractProfileAnalysis';

const NFTContractProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingContract, setAnalyzingContract] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const [queryParams, setQueryParams] = useState({
    blockchain: searchParams.get('blockchain') || 'ethereum',
    timeRange: searchParams.get('timeRange') || '24h',
    offset: searchParams.get('offset') || '0',
    limit: searchParams.get('limit') || '30',
    sortBy: searchParams.get('sortBy') || 'diamond_hands',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const blockchainOptions = ['ethereum', 'polygon', 'solana'];
  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ];
  const sortByOptions = [
    { value: 'diamond_hands', label: 'Diamond Hands' },
    { value: 'profitable_volume', label: 'Profitable Volume' },
    { value: 'loss_making_volume', label: 'Loss Making Volume' },
    { value: 'profitable_trades', label: 'Profitable Trades' },
    { value: 'loss_making_trades', label: 'Loss Making Trades' },
    { value: 'collection_score', label: 'Collection Score' }
  ];
  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    const value = parseFloat(num);
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
  };

  const analyzeContract = async (profile) => {
    setAnalyzingContract(profile.contract_address);
    try {
      const analysis = await analyzeContractProfile(profile, import.meta.env.VITE_GEMINI_API_KEY);
      setAiAnalysis(prev => ({
        ...prev,
        [profile.contract_address]: analysis
      }));
    } catch (error) {
      console.error(`Error analyzing contract ${profile.contract_address}:`, error);
    } finally {
      setAnalyzingContract(null);
    }
  };

  const toggleSection = (contractAddress) => {
    setExpandedSections(prev => ({
      ...prev,
      [contractAddress]: !prev[contractAddress]
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBrandContractProfile(queryParams);
      setProfiles(response.data);
      setSearchParams(queryParams);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryParams]);

  const handleParamChange = (param, value) => {
    setQueryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Query Parameters UI */}
      <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Query Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Blockchain</label>
            <Select
              value={queryParams.blockchain}
              onValueChange={(value) => handleParamChange('blockchain', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                {blockchainOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
            <Select
              value={queryParams.timeRange}
              onValueChange={(value) => handleParamChange('timeRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
            <Select
              value={queryParams.sortBy}
              onValueChange={(value) => handleParamChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort field" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sort Order</label>
            <Select
              value={queryParams.sortOrder}
              onValueChange={(value) => handleParamChange('sortOrder', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                {sortOrderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Display */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {profiles.map((profile, index) => (
              <Card 
                key={index} 
                className="bg-gray-900/50 border-gray-800 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-white">{profile.brand}</h3>
                    <p className="text-sm text-gray-400">Category: {profile.category}</p>
                    <p className="text-sm text-gray-400">{profile.contract_address}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {aiAnalysis[profile.contract_address] && (
                      <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        Score: {aiAnalysis[profile.contract_address].score}/100
                      </div>
                    )}
                    <Button
                      onClick={() => analyzeContract(profile)}
                      disabled={analyzingContract === profile.contract_address}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {analyzingContract === profile.contract_address ? 'Analyzing...' : 'Analyze Contract'}
                    </Button>
                    <Button
                      onClick={() => toggleSection(profile.contract_address)}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      {expandedSections[profile.contract_address] ? 'Show Less' : 'Show More'}
                    </Button>
                  </div>
                </div>

                {/* Basic Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Diamond Hands</p>
                    <p className="text-white text-lg">{formatNumber(profile.diamond_hands)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Token Score</p>
                    <p className="text-white text-lg">{formatNumber(profile.token_score)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Profitable Volume</p>
                    <p className="text-white text-lg">${formatNumber(profile.profitable_volume)}</p>
                  </div>
                </div>

                {/* Expanded Section */}
                {expandedSections[profile.contract_address] && (
                  <div className="space-y-6 mt-6 pt-6 border-t border-gray-800">
                    {/* Trading Metrics */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-4">Trading Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Profitable Trades</p>
                          <p className="text-white">{formatNumber(profile.profitable_trades)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Loss Making Trades</p>
                          <p className="text-white">{formatNumber(profile.loss_making_trades)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Loss Making Volume</p>
                          <p className="text-white">${formatNumber(profile.loss_making_volume)}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Section */}
                    {aiAnalysis[profile.contract_address] && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-gray-800">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis</h4>
                          <p className="text-gray-400">{aiAnalysis[profile.contract_address].analysis}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Trading Analysis</h4>
                            <div className="space-y-2">
                              <p className="text-gray-400">
                                <span className="font-medium">Volume Analysis:</span>{' '}
                                {aiAnalysis[profile.contract_address].tradingAnalysis.volumeAnalysis}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Profitability:</span>{' '}
                                {aiAnalysis[profile.contract_address].tradingAnalysis.profitability}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Market Activity:</span>{' '}
                                {aiAnalysis[profile.contract_address].tradingAnalysis.marketActivity}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Risk Assessment</h4>
                            <div className="mb-2">
                              <span className="inline-block px-2 py-1 rounded text-sm font-medium"
                                style={{
                                  backgroundColor: 
                                    aiAnalysis[profile.contract_address].riskLevel.level === 'Low' ? 'rgba(34, 197, 94, 0.2)' :
                                    aiAnalysis[profile.contract_address].riskLevel.level === 'Medium' ? 'rgba(234, 179, 8, 0.2)' :
                                    'rgba(239, 68, 68, 0.2)',
                                  color: 
                                    aiAnalysis[profile.contract_address].riskLevel.level === 'Low' ? '#22c55e' :
                                    aiAnalysis[profile.contract_address].riskLevel.level === 'Medium' ? '#eab308' :
                                    '#ef4444'
                                }}
                              >
                                {aiAnalysis[profile.contract_address].riskLevel.level} Risk
                              </span>
                            </div>
                            <p className="text-gray-400">{aiAnalysis[profile.contract_address].riskLevel.explanation}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h4>
                            <ul className="list-disc list-inside text-gray-400">
                              {aiAnalysis[profile.contract_address].recommendations.map((item, i) => (
                                <li key={i}>{String(item)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTContractProfile;
