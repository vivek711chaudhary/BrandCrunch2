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
import { analyzeBrandProfile } from '../services/aiAnalysis/brandProfileAnalysis';

const BrandProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingBrand, setAnalyzingBrand] = useState(null);
  
  const [queryParams, setQueryParams] = useState({
    blockchain: 'ethereum',
    time_range: '24h',
    offset: '0',
    limit: '10',
    sort_by: 'diamond_hands',
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
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    }
    return value.toFixed(2);
  };

  const getPropValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const sortProfiles = (data) => {
    return [...data].sort((a, b) => {
      let aValue = parseFloat(a[queryParams.sort_by]) || 0;
      let bValue = parseFloat(b[queryParams.sort_by]) || 0;
      const multiplier = queryParams.sort_order === 'desc' ? -1 : 1;
      return (aValue - bValue) * multiplier;
    });
  };

  const analyzeBrand = async (profile) => {
    setAnalyzingBrand(profile.brand);
    try {
      const analysis = await analyzeBrandProfile(profile, import.meta.env.VITE_GEMINI_API_KEY);
      setAiAnalysis(prev => ({
        ...prev,
        [profile.brand]: analysis
      }));
    } catch (error) {
      console.error(`Error analyzing profile for ${profile.brand}:`, error);
    } finally {
      setAnalyzingBrand(null);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method: 'GET',
        url: 'https://api.unleashnfts.com/api/v2/nft/brand/profile',
        params: queryParams,
        headers: {
          accept: 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY
        }
      };

      const response = await axios.request(options);
      const sortedData = sortProfiles(response.data.data);
      setProfiles(sortedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [queryParams]);

  const handleParamChange = (param, value) => {
    setQueryParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const renderTradingAnalysis = (tradingAnalysis) => {
    if (!tradingAnalysis) return null;
    
    return (
      <div className="space-y-2">
        <p className="text-gray-400">
          <span className="font-medium">Profitability:</span> {getPropValue(tradingAnalysis.profitability)}
        </p>
        <p className="text-gray-400">
          <span className="font-medium">Volume Metrics:</span> {getPropValue(tradingAnalysis.volumeMetrics)}
        </p>
        <p className="text-gray-400">
          <span className="font-medium">Holder Behavior:</span> {getPropValue(tradingAnalysis.holderBehavior)}
        </p>
      </div>
    );
  };

  const renderRiskAssessment = (riskAssessment) => {
    if (!riskAssessment) return null;
  
    // Handle case where riskAssessment is a string
    if (typeof riskAssessment === 'string') {
      return <p className="text-gray-400">{riskAssessment}</p>;
    }
  
    // Handle case where riskAssessment is an object with potential and risk properties
    return (
      <div className="space-y-3">
        {riskAssessment?.potential && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Potential:</h5>
            <p className="text-gray-400">{riskAssessment.potential}</p>
          </div>
        )}
        {riskAssessment?.risk && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Risk:</h5>
            <p className="text-gray-400">{riskAssessment.risk}</p>
          </div>
        )}
        {riskAssessment?.highRiskFactors && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Risk:</h5>
            <p className="text-gray-400">{riskAssessment.risk}</p>
          </div>
        )}
        {riskAssessment?.mediumRiskFactors && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Risk:</h5>
            <p className="text-gray-400">{riskAssessment.risk}</p>
          </div>
        )}
        {riskAssessment?.lowRiskFactors && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Risk:</h5>
            <p className="text-gray-400">{riskAssessment.risk}</p>
          </div>
        )}
        {riskAssessment?.factors && (
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-1">Risk:</h5>
            <p className="text-gray-400">{riskAssessment.risk}</p>
          </div>
        )}
      </div>
    );
  };

  
  return (
    <div className="container mx-auto p-6">
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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">{String(profile.brand)}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    {aiAnalysis[profile.brand] && (
                      <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        Score: {getPropValue(aiAnalysis[profile.brand].score)}/100
                      </div>
                    )}
                    <Button
                      onClick={() => analyzeBrand(profile)}
                      disabled={analyzingBrand === profile.brand}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {analyzingBrand === profile.brand ? 'Analyzing...' : 'Analyze Brand'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Diamond Hands</p>
                    <p className="text-white text-lg">{formatNumber(profile.diamond_hands)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Profitable Volume</p>
                    <p className="text-white text-lg">${formatNumber(profile.profitable_volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Loss Making Volume</p>
                    <p className="text-white text-lg">${formatNumber(profile.loss_making_volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Profitable Trades</p>
                    <p className="text-white text-lg">{formatNumber(profile.profitable_trades)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Loss Making Trades</p>
                    <p className="text-white text-lg">{formatNumber(profile.loss_making_trades)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Token Score</p>
                    <p className="text-white text-lg">{formatNumber(profile.token_score)}</p>
                  </div>
                </div>

                {aiAnalysis[profile.brand] && (
                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-800">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis</h4>
                      <p className="text-gray-400">{String(aiAnalysis[profile.brand].analysis)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Trading Analysis</h4>
                        {renderTradingAnalysis(aiAnalysis[profile.brand].tradingAnalysis)}
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside text-gray-400">
                          {Array.isArray(aiAnalysis[profile.brand].recommendations) 
                            ? aiAnalysis[profile.brand].recommendations.map((item, i) => (
                                <li key={i}>{String(item)}</li>
                              ))
                            : <li>{String(aiAnalysis[profile.brand].recommendations)}</li>
                          }
                        </ul>
                      </div>

                      {/* <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Risk Assessment</h4>
                        <p className="text-gray-400">{String(aiAnalysis[profile.brand].riskAssessment)}</p>
                      </div> */}

<div>
  <h4 className="text-sm font-semibold text-gray-300 mb-2">Risk Assessment</h4>
  {renderRiskAssessment(aiAnalysis[profile.brand].riskAssessment)}
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

export default BrandProfile;