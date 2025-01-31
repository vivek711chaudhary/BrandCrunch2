import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { BrandMetricsAIBox } from './AIAnalysis';
import { Card, CardHeader, CardContent } from './ui/card';

const BrandMetricsDetailBox = ({ metrics, isExpanded, onToggle }) => {
  // Format currency
  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format large numbers
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Parse marketplace volume
  const parseMarketplaceVolume = (volumeArray) => {
    if (!volumeArray || volumeArray.length === 0) return {};
    const volumes = {};
    volumeArray.forEach(volume => {
      const [marketplace, value] = volume.replace(/'/g, '').split(':');
      volumes[marketplace] = parseFloat(value);
    });
    return volumes;
  };

  const marketplaceVolumes = parseMarketplaceVolume(metrics.marketplace_volume);

  return (
    <Card className="overflow-hidden">
      {/* Header - Always visible */}
      <CardHeader
        onClick={onToggle}
        className="cursor-pointer hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-grow">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white">{metrics.brand}</h3>
              <span className="px-3 py-0.5 bg-primary/20 text-primary rounded-full text-sm">
                {metrics.blockchain}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <span className="text-gray-400 text-sm block">Growth Rate</span>
                <div className={`text-lg font-semibold ${metrics.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.growth_rate.toFixed(2)}%
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <span className="text-gray-400 text-sm block">Holders</span>
                <div className="text-lg font-semibold text-white">
                  {formatNumber(metrics.holders)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <span className="text-gray-400 text-sm block">Retained Traders</span>
                <div className="text-lg font-semibold text-white">
                  {formatNumber(metrics.retained_traders)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <span className="text-gray-400 text-sm block">Total Revenue</span>
                <div className="text-lg font-semibold text-white">
                  {formatUSD(metrics.total_revenue)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <span className="text-gray-400 text-sm block">Market Cap</span>
                <div className="text-lg font-semibold text-white">
                  {formatUSD(metrics.mcap)}
                </div>
              </div>
            </div>
          </div>
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        </div>
      </CardHeader>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="border-t border-gray-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                {/* Marketplace Volume */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Marketplace Volume</h4>
                  <div className="space-y-2">
                    {Object.entries(marketplaceVolumes).map(([marketplace, volume]) => (
                      <div key={marketplace} className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                        <span className="text-gray-300">{marketplace}</span>
                        <span className="text-white font-medium">{formatUSD(volume)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Additional Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                      <span className="text-gray-300">Total Volume</span>
                      <span className="text-white font-medium">{formatUSD(metrics.total_volume)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                      <span className="text-gray-300">Transactions</span>
                      <span className="text-white font-medium">{formatNumber(metrics.transactions)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800/30 p-3 rounded-lg">
                      <span className="text-gray-300">Average Price</span>
                      <span className="text-white font-medium">{formatUSD(metrics.avg_price)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Box */}
              <div className="mt-6">
                <BrandMetricsAIBox metrics={metrics} />
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default BrandMetricsDetailBox;
