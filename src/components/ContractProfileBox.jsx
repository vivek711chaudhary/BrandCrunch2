import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const ContractProfileBox = ({ profile, isExpanded, onToggle }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden hover:bg-gray-800/70 transition-colors">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {profile.brand?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{profile.brand || 'Unknown Brand'}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                {profile.category || 'Unknown'}
              </span>
              <span className="text-sm text-gray-400">
                {profile.blockchain || 'ethereum'}
              </span>
            </div>
          </div>
        </div>
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-700/50"
        >
          <div className="p-6 space-y-8">
            {/* Trading Performance */}
            <div>
              <h3 className="text-lg font-medium text-primary mb-6">Trading Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-white">
                    {profile.profitable_trades > 0 
                      ? ((profile.profitable_trades / (parseInt(profile.profitable_trades) + parseInt(profile.loss_making_trades))) * 100).toFixed(2)
                      : '0.00'}%
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 mb-2">Loss Volume</p>
                  <p className="text-3xl font-bold text-red-500">
                    {profile.loss_making_volume?.toLocaleString() || '0.00'}
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 mb-2">Profit Volume</p>
                  <p className="text-3xl font-bold text-green-500">
                    {profile.profitable_volume?.toLocaleString() || '0.00'}
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-gray-400 mb-2">Total Volume</p>
                  <p className="text-3xl font-bold text-blue-500">
                    {((profile.profitable_volume || 0) + (profile.loss_making_volume || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Trade Statistics */}
            <div>
              <h3 className="text-lg font-medium text-primary mb-6">Trade Statistics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-red-400 text-sm mb-2">Loss Making Trades</p>
                  <p className="text-2xl font-bold text-white">{profile.loss_making_trades || 0}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-green-400 text-sm mb-2">Profitable Trades</p>
                  <p className="text-2xl font-bold text-white">{profile.profitable_trades || 0}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-blue-400 text-sm mb-2">Token Score</p>
                  <p className="text-2xl font-bold text-white">{profile.token_score || 0}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-primary text-sm mb-2">Diamond Hands</p>
                  <p className="text-2xl font-bold text-white">{profile.diamond_hands || 0}</p>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div>
              <h3 className="text-lg font-medium text-primary mb-6">Contract Details</h3>
              <div className="space-y-4 bg-gray-900/50 p-6 rounded-lg">
                <div>
                  <p className="text-gray-400 mb-1">Blockchain</p>
                  <p className="text-white text-lg">{profile.blockchain || 'ethereum'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Chain ID</p>
                  <p className="text-white text-lg">{profile.chain_id || '1'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Contract Address</p>
                  <p className="text-white text-lg break-all font-mono">{profile.contract_address}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContractProfileBox;
