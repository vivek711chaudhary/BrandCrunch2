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
import { ChevronDown, ChevronUp } from "lucide-react";
import { analyzeMetrics, analyzeSingleBrand } from '../services/aiAnalysis/aiAnalysisMetrics2';

const NFTBrandMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [brandAnalyses, setBrandAnalyses] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analyzingBrand, setAnalyzingBrand] = useState(null);
  
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
    { value: 'total_volume', label: 'Total Volume' },
    { value: 'total_revenue', label: 'Total Revenue' },
    { value: 'holders', label: 'Holders' },
    { value: 'traders', label: 'Traders' }
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

  const analyzeBrand = async (metric) => {
    setAnalyzingBrand(metric.brand);
    try {
      const analysis = await analyzeSingleBrand(metric, import.meta.env.VITE_GEMINI_API_KEY);
      setBrandAnalyses(prev => ({
        ...prev,
        [metric.brand]: analysis
      }));
    } catch (error) {
      console.error(`Error analyzing brand ${metric.brand}:`, error);
    } finally {
      setAnalyzingBrand(null);
    }
  };

  const analyzeMarket = async () => {
    setAnalysisLoading(true);
    try {
      const analysis = await analyzeMetrics(metrics, import.meta.env.VITE_GEMINI_API_KEY);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing market:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method: 'GET',
        url: 'https://api.unleashnfts.com/api/v2/nft/brand/metrics',
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

  const toggleCardExpansion = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Query Parameters UI */}
      <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Query Parameters</h2>
          <Button
            onClick={analyzeMarket}
            disabled={analysisLoading || !metrics.length}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {analysisLoading ? 'Analyzing Market...' : 'Analyze Market'}
          </Button>
        </div>
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

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Market Overview</h2>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                Market Score: {aiAnalysis.score}/100
              </div>
            </div>
          </div>
          <p className="text-gray-300 mb-4">{aiAnalysis.analysis}</p>
          
          {aiAnalysis.keyMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Top Performers</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {aiAnalysis.keyMetrics.topPerformers.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Market Trends</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {aiAnalysis.keyMetrics.marketTrends.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {aiAnalysis.keyMetrics.underperformers.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside text-gray-400">
                  {aiAnalysis.keyMetrics.recommendations.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}

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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">{String(metric.brand)}</h3>
                    <button onClick={() => toggleCardExpansion(index)}>
                      {expandedCards[index] ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    {brandAnalyses[metric.brand] && (
                      <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        Score: {brandAnalyses[metric.brand].score}/100
                      </div>
                    )}
                    <Button
                      onClick={() => analyzeBrand(metric)}
                      disabled={analyzingBrand === metric.brand}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {analyzingBrand === metric.brand ? 'Analyzing...' : 'Analyze Brand'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Collection</p>
                    <p className="text-white text-sm">{String(metric.collection)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Volume</p>
                    <p className="text-white text-lg">${formatNumber(metric.total_volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-white text-lg">${formatNumber(metric.total_revenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Holders/Traders</p>
                    <p className="text-white text-lg">{formatNumber(metric.holders)}/{formatNumber(metric.traders)}</p>
                  </div>
                </div>

                {expandedCards[index] && brandAnalyses[metric.brand] && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Mint Tokens</p>
                        <p className="text-white text-lg">{formatNumber(metric.mint_tokens)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Average Price</p>
                        <p className="text-white text-lg">${formatNumber(metric.total_volume / metric.traders)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Holder Ratio</p>
                        <p className="text-white text-lg">{((metric.holders / metric.traders) * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Revenue per Trader</p>
                        <p className="text-white text-lg">${formatNumber(metric.total_revenue / metric.traders)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis</h4>
                        <p className="text-gray-400">{brandAnalyses[metric.brand].analysis}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Strengths</h4>
                          <ul className="list-disc list-inside text-gray-400">
                            {brandAnalyses[metric.brand].strengths.map((item, i) => (
                              <li key={i}>{String(item)}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Areas for Improvement</h4>
                          <ul className="list-disc list-inside text-gray-400">
                            {brandAnalyses[metric.brand].weaknesses.map((item, i) => (
                              <li key={i}>{String(item)}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h4>
                          <ul className="list-disc list-inside text-gray-400">
                            {brandAnalyses[metric.brand].recommendations.map((item, i) => (
                              <li key={i}>{String(item)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
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

export default NFTBrandMetrics;
