import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeContractMetrics } from '../services/aiAnalysis/contractMetricsAnalysis';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NFTContractMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingContract, setAnalyzingContract] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  
  const [queryParams, setQueryParams] = useState({
    blockchain: 'ethereum',
    time_range: '24h',
    offset: '0',
    limit: '10',
    sort_by: 'mint_tokens',
    sort_order: 'desc'
  });

  const blockchainOptions = ['ethereum', 'polygon', 'solana'];
  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ];
  const limitOptions = ['10', '20', '30', '50', '100'];
  const sortByOptions = [
    { value: 'mint_tokens', label: 'Mint Tokens' },
    { value: 'mint_revenue', label: 'Mint Revenue' },
    { value: 'primary_sale_revenue', label: 'Primary Sale Revenue' },
    { value: 'secondary_sale_revenue', label: 'Secondary Sale Revenue' },
    { value: 'total_volume', label: 'Total Volume' },
    { value: 'mcap', label: 'Market Cap' }
  ];
  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    
    const value = parseFloat(num);
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    }
    return value.toFixed(2);
  };

  const sortMetrics = (data) => {
    return [...data].sort((a, b) => {
      let aValue = parseFloat(a[queryParams.sort_by]) || 0;
      let bValue = parseFloat(b[queryParams.sort_by]) || 0;
      const multiplier = queryParams.sort_order === 'desc' ? -1 : 1;
      return (aValue - bValue) * multiplier;
    });
  };

  const analyzeContract = async (metric) => {
    setAnalyzingContract(metric.contract_address);
    try {
      console.log('Starting contract analysis for:', metric.contract_address);
      const analysis = await analyzeContractMetrics(metric, import.meta.env.VITE_GEMINI_API_KEY);
      console.log('Analysis completed:', analysis);
      
      setAiAnalysis(prev => {
        const newState = {
          ...prev,
          [metric.contract_address]: analysis
        };
        console.log('Updated AI analysis state:', newState);
        return newState;
      });
    } catch (error) {
      console.error(`Error analyzing contract ${metric.contract_address}:`, error);
      setError(`Failed to analyze contract: ${error.message}`);
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

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method: 'GET',
        url: 'https://api.unleashnfts.com/api/v2/nft/brand/contract_metrics',
        params: queryParams,
        headers: {
          accept: 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
        }
      };

      const response = await axios.request(options);
      const sortedData = sortMetrics(response.data.data);
      setMetrics(sortedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [queryParams]);

  const handleParamChange = (param, value) => {
    setQueryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const parseMarketplaceVolume = (volumeArray) => {
    if (!Array.isArray(volumeArray)) return [];
    return volumeArray.map(item => {
      const [marketplace, volume] = item.replace(/['"]/g, '').split(':');
      return { marketplace, volume: parseFloat(volume) };
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Query Parameters UI */}
      <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Query Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Blockchain</label>
            <Select
              value={queryParams.blockchain}
              onValueChange={(value) => handleParamChange('blockchain', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Time Range</label>
            <Select
              value={queryParams.time_range}
              onValueChange={(value) => handleParamChange('time_range', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Limit</label>
            <Select
              value={queryParams.limit}
              onValueChange={(value) => handleParamChange('limit', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Sort By</label>
            <Select
              value={queryParams.sort_by}
              onValueChange={(value) => handleParamChange('sort_by', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select sort by" />
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Sort Order</label>
            <Select
              value={queryParams.sort_order}
              onValueChange={(value) => handleParamChange('sort_order', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
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
            <p className="mt-2 text-gray-400">Loading metrics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric, index) => (
              <Card 
                key={index} 
                className="bg-gray-900/50 border-gray-800 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-white">{String(metric.collection)}</h3>
                    <p className="text-sm text-gray-400">Brand: {String(metric.brand)}</p>
                    <p className="text-sm text-gray-400">{String(metric.contract_address)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {aiAnalysis[metric.contract_address] && (
                      <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        Score: {aiAnalysis[metric.contract_address].score}/100
                      </div>
                    )}
                    <Button
                      onClick={() => analyzeContract(metric)}
                      disabled={analyzingContract === metric.contract_address}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {analyzingContract === metric.contract_address ? 'Analyzing...' : 'Analyze Contract'}
                    </Button>
                    <Button
                      onClick={() => toggleSection(metric.contract_address)}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      {expandedSections[metric.contract_address] ? 'Show Less' : 'Show More'}
                    </Button>
                  </div>
                </div>

                {/* Basic Metrics (Always Visible) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Volume</p>
                    <p className="text-white text-lg">${formatNumber(metric.total_volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Market Cap</p>
                    <p className="text-white text-lg">${formatNumber(metric.mcap)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Holders</p>
                    <p className="text-white text-lg">{formatNumber(metric.holders)}</p>
                  </div>
                </div>

                {/* Expanded Section */}
                {expandedSections[metric.contract_address] && (
                  <div className="space-y-6 mt-6 pt-6 border-t border-gray-800">
                    {/* Revenue Metrics */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-4">Revenue Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Mint Revenue</p>
                          <p className="text-white">${formatNumber(metric.mint_revenue)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Primary Sale Revenue</p>
                          <p className="text-white">${formatNumber(metric.primary_sale_revenue)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Secondary Sale Revenue</p>
                          <p className="text-white">${formatNumber(metric.secondary_sale_revenue)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Royalty Revenue</p>
                          <p className="text-white">${formatNumber(metric.royalty_revenue)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trading Activity */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-4">Trading Activity</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Total Traders</p>
                          <p className="text-white">{formatNumber(metric.traders)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Retained Traders</p>
                          <p className="text-white">{formatNumber(metric.retained_traders)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Interactions</p>
                          <p className="text-white">{formatNumber(metric.interactions)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">Growth Rate</p>
                          <p className="text-white">{metric.growth_rate ? `${formatNumber(metric.growth_rate * 100)}%` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Marketplace Volume */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-4">Marketplace Volume</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {parseMarketplaceVolume(metric.marketplace_volume).map((item, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium text-gray-400 mb-1">{item.marketplace}</p>
                            <p className="text-white">${formatNumber(item.volume)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Analysis Section */}
                    {aiAnalysis[metric.contract_address] && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-gray-800">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis</h4>
                          <p className="text-gray-400">{aiAnalysis[metric.contract_address].analysis}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Performance Metrics</h4>
                            <div className="space-y-2">
                              <p className="text-gray-400">
                                <span className="font-medium">Volume Analysis:</span>{' '}
                                {aiAnalysis[metric.contract_address].performanceMetrics.volumeAnalysis}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Revenue Breakdown:</span>{' '}
                                {aiAnalysis[metric.contract_address].performanceMetrics.revenueBreakdown}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Growth Indicators:</span>{' '}
                                {aiAnalysis[metric.contract_address].performanceMetrics.growthIndicators}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Risk Assessment</h4>
                            <div className="mb-2">
                              <span className="inline-block px-2 py-1 rounded text-sm font-medium"
                                style={{
                                  backgroundColor: 
                                    aiAnalysis[metric.contract_address].riskLevel.level === 'Low' ? 'rgba(34, 197, 94, 0.2)' :
                                    aiAnalysis[metric.contract_address].riskLevel.level === 'Medium' ? 'rgba(234, 179, 8, 0.2)' :
                                    'rgba(239, 68, 68, 0.2)',
                                  color: 
                                    aiAnalysis[metric.contract_address].riskLevel.level === 'Low' ? '#22c55e' :
                                    aiAnalysis[metric.contract_address].riskLevel.level === 'Medium' ? '#eab308' :
                                    '#ef4444'
                                }}
                              >
                                {aiAnalysis[metric.contract_address].riskLevel.level} Risk
                              </span>
                            </div>
                            <p className="text-gray-400">{aiAnalysis[metric.contract_address].riskLevel.explanation}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h4>
                            <ul className="list-disc list-inside text-gray-400">
                              {aiAnalysis[metric.contract_address].recommendations.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-400">Performance Score:</div>
                            <div className="ml-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                              {aiAnalysis[metric.contract_address].score}/100
                            </div>
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

export default NFTContractMetrics;
