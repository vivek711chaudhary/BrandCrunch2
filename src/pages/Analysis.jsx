import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  TrophyIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Chart from '../components/Chart';
import { motion } from 'framer-motion';
import { Loader } from '../components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { fetchNFTBrandMetadata } from '../api/nftMetadata';
import { fetchNFTBrandContractProfile } from '../api/nftBrandContractProfile';
import { cacheManager } from '../utils/cache';

const CACHE_KEYS = {
  DASHBOARD_DATA: 'analysis_dashboard_data',
  CHART_DATA: 'analysis_chart_data'
};

function Analysis() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });
  const [dashboardData, setDashboardData] = useState({
    total_volume: 0,
    profitable_volume: 0,
    loss_volume: 0,
    total_trades: 0,
    profitable_trades: 0,
    loss_trades: 0,
    brands: []
  });
  const [chartData, setChartData] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get data from cache first
      const cachedDashboard = cacheManager.get(CACHE_KEYS.DASHBOARD_DATA, forceRefresh);
      const cachedChart = cacheManager.get(CACHE_KEYS.CHART_DATA, forceRefresh);

      if (cachedDashboard && cachedChart) {
        console.log('Using cached data');
        setDashboardData(cachedDashboard);
        setChartData(cachedChart);
        setLoading(false);
        return;
      }

      console.log('Fetching fresh data');
      // Fetch data from both APIs
      const [metadataResponse, profileResponse] = await Promise.all([
        fetchNFTBrandMetadata(),
        fetchNFTBrandContractProfile()
      ]);

      if (!metadataResponse?.data || !profileResponse?.data) {
        throw new Error('Invalid API response');
      }

      // Process the data
      const processedData = processMetricsData(metadataResponse.data, profileResponse.data);
      const chartDataProcessed = processChartData(profileResponse.data);

      // Cache the processed data
      cacheManager.set(CACHE_KEYS.DASHBOARD_DATA, processedData);
      cacheManager.set(CACHE_KEYS.CHART_DATA, chartDataProcessed);

      setDashboardData(processedData);
      setChartData(chartDataProcessed);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    await fetchData(true);
  };

  const processMetricsData = (metadata, profiles) => {
    try {
      let totalProfitableVolume = 0;
      let totalLossVolume = 0;
      let totalProfitableTrades = 0;
      let totalLossTrades = 0;
      let brands = [];

      // Process profile data for trading metrics
      profiles.forEach(profile => {
        totalProfitableVolume += parseFloat(profile.profitable_volume || 0);
        totalLossVolume += Math.abs(parseFloat(profile.loss_making_volume || 0));
        totalProfitableTrades += parseInt(profile.profitable_trades || 0);
        totalLossTrades += parseInt(profile.loss_making_trades || 0);

        // Add to brands array with combined data
        const metadataMatch = metadata.find(m => m.brand === profile.brand);
        if (metadataMatch) {
          brands.push({
            name: profile.brand,
            category: profile.category,
            profitableVolume: parseFloat(profile.profitable_volume || 0),
            lossVolume: Math.abs(parseFloat(profile.loss_making_volume || 0)),
            profitableTrades: parseInt(profile.profitable_trades || 0),
            lossTrades: parseInt(profile.loss_making_trades || 0),
            contract: profile.contract_address,
            description: metadataMatch.description
          });
        }
      });

      // Sort brands based on current sort configuration
      const sortedBrands = sortBrands(brands, sortConfig);

      return {
        total_volume: totalProfitableVolume + totalLossVolume,
        profitable_volume: totalProfitableVolume,
        loss_volume: totalLossVolume,
        total_trades: totalProfitableTrades + totalLossTrades,
        profitable_trades: totalProfitableTrades,
        loss_trades: totalLossTrades,
        brands: sortedBrands.slice(0, 5) // Top 5 brands
      };
    } catch (error) {
      console.error('Error processing metrics data:', error);
      return {
        total_volume: 0,
        profitable_volume: 0,
        loss_volume: 0,
        total_trades: 0,
        profitable_trades: 0,
        loss_trades: 0,
        brands: []
      };
    }
  };

  const sortBrands = (brands, config) => {
    const sortedBrands = [...brands];
    
    switch (config.key) {
      case 'profitable':
        sortedBrands.sort((a, b) => {
          const diff = b.profitableVolume - a.profitableVolume;
          return config.direction === 'asc' ? -diff : diff;
        });
        break;
      case 'loss':
        sortedBrands.sort((a, b) => {
          const diff = b.lossVolume - a.lossVolume;
          return config.direction === 'asc' ? -diff : diff;
        });
        break;
      default: // total
        sortedBrands.sort((a, b) => {
          const diff = (b.profitableVolume + b.lossVolume) - (a.profitableVolume + a.lossVolume);
          return config.direction === 'asc' ? -diff : diff;
        });
    }
    return sortedBrands;
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const processChartData = (profiles) => {
    try {
      const top5Brands = [...profiles]
        .sort((a, b) => 
          (parseFloat(b.profitable_volume) + Math.abs(parseFloat(b.loss_making_volume))) - 
          (parseFloat(a.profitable_volume) + Math.abs(parseFloat(a.loss_making_volume)))
        )
        .slice(0, 5);

      return {
        labels: top5Brands.map(brand => brand.brand),
        datasets: [
          {
            label: 'Profitable Volume',
            data: top5Brands.map(brand => parseFloat(brand.profitable_volume || 0)),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'Stack 0',
          },
          {
            label: 'Loss Volume',
            data: top5Brands.map(brand => Math.abs(parseFloat(brand.loss_making_volume || 0))),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'Stack 1',
          }
        ]
      };
    } catch (error) {
      console.error('Error processing chart data:', error);
      return null;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      Error: {error}
    </div>
  );

  const metrics = [
    {
      title: 'Total Trading Volume',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(dashboardData.total_volume),
      icon: CurrencyDollarIcon,
      description: 'Total volume of all NFT trades',
      color: 'bg-blue-500'
    },
    {
      title: 'Profitable Volume',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(dashboardData.profitable_volume),
      icon: ArrowTrendingUpIcon,
      description: 'Volume from profitable trades',
      color: 'bg-green-500'
    },
    {
      title: 'Loss Volume',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(dashboardData.loss_volume),
      icon: BanknotesIcon,
      description: 'Volume from loss-making trades',
      color: 'bg-red-500'
    },
    {
      title: 'Total Trades',
      value: dashboardData.total_trades.toLocaleString(),
      icon: UsersIcon,
      description: 'Total number of trades',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analysis Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 hover:shadow-lg transition-shadow duration-300 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.color} bg-opacity-20`}>
                    <metric.icon className={`w-6 h-6 text-white`} />
                  </div>
                  <CardDescription className="text-slate-300">{metric.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold mb-1 text-white">{metric.value}</CardTitle>
                <p className="text-sm text-slate-400">{metric.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      {chartData && (
        <Card className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Trading Volume by Brand</CardTitle>
            <CardDescription className="text-slate-300">Top 5 brands by trading volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Chart data={chartData} />
          </CardContent>
        </Card>
      )}

      {/* Top Brands Table */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <CardHeader>
          <CardTitle className="text-white">Top Performing Brands</CardTitle>
          <CardDescription className="text-slate-300">Detailed metrics for top 5 NFT brands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Brand</th>
                  <th className="text-left py-3 px-4 text-slate-300">Category</th>
                  <th className="text-right py-3 px-4 cursor-pointer text-slate-300" onClick={() => handleSort('profitable')}>
                    <div className="flex items-center justify-end gap-1">
                      Profitable Volume
                      {sortConfig.key === 'profitable' && (
                        sortConfig.direction === 'desc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 cursor-pointer text-slate-300" onClick={() => handleSort('loss')}>
                    <div className="flex items-center justify-end gap-1">
                      Loss Volume
                      {sortConfig.key === 'loss' && (
                        sortConfig.direction === 'desc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 text-slate-300">Trades</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.brands.map((brand, index) => (
                  <motion.tr
                    key={brand.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{brand.name}</div>
                      <div className="text-sm text-slate-400 truncate max-w-xs" title={brand.description}>
                        {brand.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-slate-600 text-slate-200">
                        {brand.category}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-emerald-400">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(brand.profitableVolume)}
                    </td>
                    <td className="text-right py-3 px-4 text-rose-400">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(brand.lossVolume)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-200">
                      {(brand.profitableTrades + brand.lossTrades).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Analysis;
