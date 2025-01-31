import React, { useState, useEffect } from 'react';
import ChartControls from '../components/ChartControls';
import BrandMetricsChart from '../components/BrandMetricsChart';
import { MetricSelector } from '../components/MetricSelector';
import BrandList from '../components/BrandList';
import MarketplaceVolumeChart from '../components/MarketplaceVolumeChart';
import { getBrandMetrics } from '../services/api';

const CACHE_KEY = 'brandcrunch_cache';

const BrandAnalysis = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(['mint_tokens']);
  const [params, setParams] = useState(() => {
    const cachedParams = localStorage.getItem(`${CACHE_KEY}_params`);
    return cachedParams ? JSON.parse(cachedParams) : {
      blockchain: 'ethereum',
      timeRange: '24h',
      offset: 0,
      limit: 10,
      sortBy: 'mint_tokens',
      sortOrder: 'desc',
      chartType: 'bar'
    };
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem(`${CACHE_KEY}_params`, JSON.stringify(params));
  }, [params]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getBrandMetrics({
      blockchain: params.blockchain,
      time_range: params.timeRange,
      offset: params.offset,
      limit: params.limit,
      sort_by: params.sortBy,
      sort_order: params.sortOrder
    })
      .then((response) => {
        const validatedData = validateData(response.data);
        if (validatedData.length === 0 && response.data.length > 0) {
          throw new Error('Data format is invalid or contains no valid entries');
        }
        setData(validatedData);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  const validateData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => 
      item && 
      typeof item === 'object' && 
      item.brand && 
      Object.keys(item).length > 0
    );
  };

  const handleParamChange = (param, value) => {
    setParams(prev => ({
      ...prev,
      [param]: value,
      offset: param === 'limit' ? prev.offset : 0
    }));
  };

  const handleMetricToggle = (metricId) => {
    setSelectedMetrics(prev => {
      const newMetrics = prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId];
      localStorage.setItem(`${CACHE_KEY}_metrics`, JSON.stringify(newMetrics));
      return newMetrics;
    });
  };

  useEffect(() => {
    const cachedMetrics = localStorage.getItem(`${CACHE_KEY}_metrics`);
    if (cachedMetrics) {
      setSelectedMetrics(JSON.parse(cachedMetrics));
    }
  }, []);

  const getErrorMessage = (error) => {
    if (!error) return '';
    if (error.message?.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    if (error.message?.includes('Invalid response format')) {
      return 'The server returned data in an unexpected format. Please try again later.';
    }
    if (error.message?.includes('Data format is invalid')) {
      return 'The data received contains no valid entries for the selected parameters.';
    }
    return error.message || 'An unknown error occurred';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">NFT Brand Metrics Analysis</h1>
        
        <ChartControls 
          blockchain={params.blockchain}
          timeRange={params.timeRange}
          limit={params.limit}
          sortBy={params.sortBy}
          sortOrder={params.sortOrder}
          chartType={params.chartType}
          onParamChange={handleParamChange}
        />

        <MetricSelector
          selectedMetrics={selectedMetrics}
          onMetricToggle={handleMetricToggle}
        />

        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm opacity-90">{getErrorMessage(error)}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <BrandMetricsChart 
                  data={data} 
                  chartType={params.chartType}
                  selectedMetrics={selectedMetrics}
                  onBrandSelect={setSelectedBrand}
                />
              </div>

              {data.some(item => Array.isArray(item.marketplace_volume) && item.marketplace_volume.length > 0) && (
                <div>
                  <MarketplaceVolumeChart 
                    data={data}
                    chartType={params.chartType}
                    selectedBrand={selectedBrand}
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Detailed Brand Information</h2>
              <BrandList 
                data={data}
                selectedMetrics={selectedMetrics}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandAnalysis;
