import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const BrandMetadataBox = ({ metadata, isExpanded, onToggle }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-800/70">
      <div 
        className="p-5 cursor-pointer flex items-center justify-between focus:ring-2 focus:ring-primary focus:outline-none rounded-xl"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {metadata.brand?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{metadata.brand || 'Unknown Brand'}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary">
                {metadata.category || 'Unknown'}
              </span>
              <span className="text-sm text-gray-400">
                {metadata.blockchain || 'ethereum'}
              </span>
            </div>
          </div>
        </div>
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${
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
          className="border-t border-gray-700"
        >
          <div className="p-6 space-y-8">
            {/* Brand Information */}
            <div>
              <h3 className="text-lg font-medium text-primary mb-4">Brand Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {['brand', 'category', 'blockchain', 'chain_id'].map((key) => (
                  <div key={key} className="bg-gray-900 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-400 mb-2 capitalize">{key.replace('_', ' ')}</p>
                    <p className="text-white text-lg font-semibold">
                      {metadata[key] || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Information */}
            <div>
              <h3 className="text-lg font-medium text-primary mb-4">Contract Information</h3>
              <div className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-sm">
                {[
                  { label: 'Contract Address', value: metadata.contract_address },
                  { label: 'Token Standard', value: metadata.token_standard || 'Unknown' },
                  { label: 'Total Supply', value: metadata.total_supply?.toLocaleString() || 'Unknown' },
                ].map((info) => (
                  <div key={info.label}>
                    <p className="text-gray-400 mb-1">{info.label}</p>
                    <p className={`text-white text-lg ${info.label === 'Contract Address' ? 'font-mono break-words' : ''}`}>
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Metadata */}
            {metadata.additional_metadata && (
              <div>
                <h3 className="text-lg font-medium text-primary mb-4">Additional Metadata</h3>
                <div className="bg-gray-900 p-6 rounded-lg shadow-sm">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                    {JSON.stringify(metadata.additional_metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BrandMetadataBox;
