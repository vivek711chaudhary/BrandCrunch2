import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ContractProfileAIBox } from './AIAnalysis';

const BrandContractProfileBox = ({ profile, isExpanded, onToggle }) => {
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

  // Calculate trade success rate
  const calculateSuccessRate = () => {
    const totalTrades = Number(profile.profitable_trades) + Number(profile.loss_making_trades);
    if (totalTrades === 0) return 0;
    return (Number(profile.profitable_trades) / totalTrades) * 100;
  };

  const successRate = calculateSuccessRate();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4 flex-grow">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-white">{profile.brand}</h3>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm capitalize">
                {profile.category}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <span className="text-gray-400 text-sm">Loss Making Trades</span>
                <div className="text-lg font-semibold text-red-400">
                  {formatNumber(profile.loss_making_trades)}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Profitable Trades</span>
                <div className="text-lg font-semibold text-green-400">
                  {formatNumber(profile.profitable_trades)}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Token Score</span>
                <div className="text-lg font-semibold text-white">
                  {profile.token_score}
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Diamond Hands</span>
                <div className="text-lg font-semibold text-white">
                  {formatNumber(profile.diamond_hands)}
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
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trading Performance */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Trading Performance</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-white font-medium">{successRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${successRate}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loss Volume</span>
                      <span className="text-red-400 font-medium">{formatUSD(profile.loss_making_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit Volume</span>
                      <span className="text-green-400 font-medium">{formatUSD(profile.profitable_volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Volume</span>
                      <span className="text-white font-medium">
                        {formatUSD(profile.profitable_volume + profile.loss_making_volume)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-primary">Contract Details</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Blockchain</span>
                      <span className="text-white font-medium capitalize">{profile.blockchain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chain ID</span>
                      <span className="text-white font-medium">{profile.chain_id}</span>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <span className="text-gray-400">Contract Address</span>
                        <span className="text-white font-mono text-sm break-all">
                          {profile.contract_address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* AI Analysis Section */}
            <div className="mt-6 px-6 pb-6">
              <ContractProfileAIBox profile={profile} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandContractProfileBox;
