import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ContractMetricsAIBox from './AIAnalysis/ContractMetricsAIBox';

const ContractMetricsBox = ({ metrics, isExpanded, onToggle }) => {
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
    <motion.div
      layout
      className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Always visible */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-grow">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white">{metrics.collection}</h3>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {metrics.blockchain}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <span className="text-gray-400 text-sm">Growth Rate</span>
                <div className={`text-lg font-semibold ${metrics.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.growth_rate.toFixed(2)}%
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Total Revenue</span>
                <div className="text-lg font-semibold text-white">
                  {formatUSD(metrics.total_revenue)}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Market Cap</span>
                <div className="text-lg font-semibold text-white">
                  {formatUSD(metrics.mcap)}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Holders</span>
                <div className="text-lg font-semibold text-white">
                  {formatNumber(metrics.holders)}
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
              <ChevronUpIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-400" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 border-t border-gray-700 pt-4">
              {/* Main Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Metrics */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Revenue Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint Revenue</span>
                      <span className="text-white font-medium">{formatUSD(metrics.mint_revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Primary Sales</span>
                      <span className="text-white font-medium">{formatUSD(metrics.primary_sale_revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Secondary Sales</span>
                      <span className="text-white font-medium">{formatUSD(metrics.secondary_sale_revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Royalty Revenue</span>
                      <span className="text-white font-medium">{formatUSD(metrics.royalty_revenue)}</span>
                    </div>
                  </div>
                </div>

                {/* Trading Metrics */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Trading Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Volume</span>
                      <span className="text-white font-medium">{formatUSD(metrics.total_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Traders</span>
                      <span className="text-white font-medium">{formatNumber(metrics.traders)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Retained Traders</span>
                      <span className="text-white font-medium">{formatNumber(metrics.retained_traders)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interactions</span>
                      <span className="text-white font-medium">{formatNumber(metrics.interactions)}</span>
                    </div>
                  </div>
                </div>

                {/* Collection Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Collection Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Assets</span>
                      <span className="text-white font-medium">{formatNumber(metrics.assets_all)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contracts</span>
                      <span className="text-white font-medium">{formatNumber(metrics.No_of_contracts)}</span>
                    </div>
                    {Object.entries(marketplaceVolumes).map(([marketplace, volume]) => (
                      <div key={marketplace} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{marketplace} Volume</span>
                        <span className="text-white font-medium">{formatUSD(volume)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Analysis Section - Full Width */}
              <div className="mt-6">
                <ContractMetricsAIBox metrics={metrics} />
              </div>

              {/* Contract Address */}
              <div className="mt-6 p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Contract Address:</span>
                  <span className="text-white font-mono text-sm truncate ml-4">{metrics.contract_address}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContractMetricsBox;
