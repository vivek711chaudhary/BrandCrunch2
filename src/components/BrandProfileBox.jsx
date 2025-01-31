import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { BrandProfileAIBox } from './AIAnalysis';

const BrandProfileBox = ({ profile, isExpanded, onToggle }) => {
  // Format large numbers
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Format currency
  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2 flex-grow">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white">{profile.brand}</h3>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm capitalize">
                {profile.category}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Loss Trades:</span>
                <span className="text-red-400 font-semibold">{formatNumber(profile.loss_making_trades)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Profit Trades:</span>
                <span className="text-green-400 font-semibold">{formatNumber(profile.profitable_trades)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Token Score:</span>
                <span className="text-white font-semibold">{profile.token_score}</span>
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
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trading Performance */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Trading Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profitable Volume</span>
                      <span className="text-green-400 font-medium">{formatUSD(profile.profitable_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loss Volume</span>
                      <span className="text-red-400 font-medium">{formatUSD(profile.loss_making_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Diamond Hands</span>
                      <span className="text-white font-medium">{formatNumber(profile.diamond_hands)}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Blockchain Info</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white font-medium capitalize">{profile.blockchain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chain ID</span>
                      <span className="text-white font-medium">{profile.chain_id}</span>
                    </div>
                  </div>
                </div>

                {/* Trading Stats */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Trading Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Success Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${profile.profitable_trades > 0 ? 
                                (profile.profitable_trades / (profile.profitable_trades + profile.loss_making_trades) * 100) : 0}%` 
                            }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <span className="text-white font-medium">
                          {profile.profitable_trades > 0 ? 
                            ((profile.profitable_trades / (profile.profitable_trades + profile.loss_making_trades) * 100).toFixed(1) + '%') : 
                            '0%'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Trades</span>
                      <span className="text-white font-medium">
                        {formatNumber(Number(profile.profitable_trades) + Number(profile.loss_making_trades))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* AI Analysis Section */}
            <div className="mt-6 px-6 pb-6">
              <BrandProfileAIBox profile={profile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandProfileBox;
