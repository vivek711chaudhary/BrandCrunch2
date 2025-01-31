import React from 'react';

const BrandFilters = ({ 
  blockchain, 
  timeRange, 
  limit, 
  sortBy,
  sortOrder,
  onParamChange 
}) => {
  const limitOptions = [5, 10, 20, 30, 50, 80, 100];

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Blockchain</label>
          <select 
            value={blockchain}
            onChange={(e) => onParamChange('blockchain', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          >
            <option value="ethereum">Ethereum</option>
            <option value="binance">Binance</option>
            <option value="polygon">Polygon</option>
            <option value="solana">Solana</option>
            <option value="avalanche">Avalanche</option>
            <option value="linea">Linea</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Time Range</label>
          <select 
            value={timeRange}
            onChange={(e) => onParamChange('timeRange', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          >
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Limit</label>
          <select 
            value={limit}
            onChange={(e) => onParamChange('limit', Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          >
            {limitOptions.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => onParamChange('sortBy', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          >
            <option value="total_volume">Total Volume</option>
            <option value="total_revenue">Total Revenue</option>
            <option value="holders">Holders</option>
            <option value="traders">Traders</option>
            <option value="growth_rate">Growth Rate</option>
            <option value="retained_traders">Retained Traders</option>
            <option value="mcap">Market Cap</option>
            <option value="interactions">Interactions</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sort Order</label>
          <select 
            value={sortOrder}
            onChange={(e) => onParamChange('sortOrder', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BrandFilters;
