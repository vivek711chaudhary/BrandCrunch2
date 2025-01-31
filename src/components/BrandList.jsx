import React, { useState } from 'react';

const BrandList = ({ data, selectedMetrics }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const pageSizeOptions = [5, 10, 20, 30, 50, 80, 100];
  const [expandedBrand, setExpandedBrand] = useState(null);

  const formatValue = (value, metricId) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Handle numeric values with ETH
    if (['total_volume', 'mint_revenue', 'primary_sale_revenue', 'secondary_sale_revenue', 'mcap', 'royalty_revenue', 'total_revenue'].includes(metricId)) {
      const num = parseFloat(value);
      if (isNaN(num)) return 'N/A';
      if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M ETH`;
      if (num >= 1000) return `${(num / 1000).toFixed(2)}K ETH`;
      return `${num.toFixed(2)} ETH`;
    }

    // Handle growth rate as percentage
    if (metricId === 'growth_rate') {
      const num = parseFloat(value);
      return isNaN(num) ? 'N/A' : `${(num * 100).toFixed(2)}%`;
    }

    // Handle numeric values without ETH
    if (typeof value === 'number' || !isNaN(parseFloat(value))) {
      const num = parseFloat(value);
      if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
      return num.toLocaleString();
    }

    // Handle array or object values
    if (typeof value === 'object') {
      return 'Complex Data';
    }

    return value.toString();
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const toggleBrandExpansion = (brand) => {
    setExpandedBrand(expandedBrand === brand ? null : brand);
  };

  // Define additional information fields with their display properties
  const additionalFields = [
    { 
      id: 'No_of_contracts', 
      label: 'Number of Contracts',
      format: (value) => formatValue(value, 'number')
    },
    { 
      id: 'assets_all', 
      label: 'Total Assets',
      format: (value) => formatValue(value, 'number')
    },
    { 
      id: 'blockchain', 
      label: 'Blockchain',
      format: (value) => value?.toString()?.toUpperCase() || 'N/A'
    },
    { 
      id: 'chain_id', 
      label: 'Chain ID',
      format: (value) => value || 'N/A'
    },
    { 
      id: 'contracts', 
      label: 'Contract Addresses',
      format: (value) => {
        if (!value) return 'N/A';
        if (Array.isArray(value)) {
          return value.length > 0 ? 
            value.slice(0, 3).join(', ') + (value.length > 3 ? ` (+${value.length - 3} more)` : '') :
            'None';
        }
        return value.toString();
      }
    },
    { 
      id: 'holders', 
      label: 'Holders',
      format: (value) => formatValue(value, 'number')
    },
    { 
      id: 'interactions', 
      label: 'Interactions',
      format: (value) => formatValue(value, 'number')
    },
    { 
      id: 'retained_traders', 
      label: 'Retained Traders',
      format: (value) => formatValue(value, 'number')
    },
    { 
      id: 'traders', 
      label: 'Total Traders',
      format: (value) => formatValue(value, 'number')
    }
  ];

  const getAdditionalInfo = (item) => (
    <div className="bg-gray-750 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {additionalFields.map(field => (
          <div key={field.id} className="bg-gray-800 p-3 rounded-lg space-y-1">
            <div className="text-sm text-gray-400">{field.label}</div>
            <div className="font-medium truncate" title={field.format(item[field.id])}>
              {field.format(item[field.id])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-900 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-1"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400">entries</span>
        </div>
        <div className="text-sm text-gray-400">
          Total: {data.length} brands
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th scope="col" className="w-8 px-6 py-3"></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Brand
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Collection
              </th>
              {selectedMetrics.map(metric => (
                <th key={metric} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {currentData.map((item, index) => (
              <React.Fragment key={index}>
                <tr 
                  className={`
                    ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                    hover:bg-gray-700 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleBrandExpansion(item.brand)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={expandedBrand === item.brand ? "Collapse details" : "Expand details"}
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${expandedBrand === item.brand ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {item.brand || 'Unknown Brand'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.collection || 'N/A'}
                  </td>
                  {selectedMetrics.map(metric => (
                    <td key={metric} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatValue(item[metric], metric)}
                    </td>
                  ))}
                </tr>
                {expandedBrand === item.brand && (
                  <tr>
                    <td colSpan={selectedMetrics.length + 3} className="px-6 py-4">
                      {getAdditionalInfo(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-700">
        <div className="flex items-center">
          <span className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`
              px-3 py-1 rounded-md text-sm font-medium
              ${currentPage === 1 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-1 rounded-md text-sm font-medium
              ${currentPage === totalPages 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandList;
