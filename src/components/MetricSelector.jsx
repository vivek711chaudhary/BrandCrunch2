import React from 'react';

const AVAILABLE_METRICS = [
  { id: 'mint_tokens', label: 'Mint Tokens', color: 'rgb(54, 162, 235)' },
  { id: 'mint_revenue', label: 'Mint Revenue', color: 'rgb(255, 99, 132)' },
  { id: 'primary_sale_revenue', label: 'Primary Sale Revenue', color: 'rgb(75, 192, 192)' },
  { id: 'secondary_sale_revenue', label: 'Secondary Sale Revenue', color: 'rgb(255, 206, 86)' },
  { id: 'total_volume', label: 'Total Volume', color: 'rgb(153, 102, 255)' },
  { id: 'total_revenue', label: 'Total Revenue', color: 'rgb(255, 159, 64)' },
  { id: 'royalty_revenue', label: 'Royalty Revenue', color: 'rgb(111, 205, 205)' },
  { id: 'marketplace_volume', label: 'Marketplace Volume', color: 'rgb(220, 120, 120)' },
  { id: 'interactions', label: 'Interactions', color: 'rgb(100, 200, 150)' },
  { id: 'holders', label: 'Holders', color: 'rgb(180, 180, 180)' },
  { id: 'traders', label: 'Traders', color: 'rgb(150, 150, 220)' },
  { id: 'retained_traders', label: 'Retained Traders', color: 'rgb(220, 150, 150)' },
  { id: 'growth_rate', label: 'Growth Rate', color: 'rgb(150, 220, 150)' },
  { id: 'mcap', label: 'Market Cap', color: 'rgb(200, 150, 200)' }
];

const MetricSelector = ({ selectedMetrics, onMetricToggle }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-800 rounded-lg">
      {AVAILABLE_METRICS.map(metric => (
        <button
          key={metric.id}
          onClick={() => onMetricToggle(metric.id)}
          className={`
            px-3 py-1 rounded-full text-sm font-medium
            transition-all duration-200 flex items-center gap-2
            ${selectedMetrics.includes(metric.id)
              ? 'bg-gray-700 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-' + metric.color
              : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'
            }
          `}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: metric.color }}
          />
          {metric.label}
        </button>
      ))}
    </div>
  );
};

export { MetricSelector, AVAILABLE_METRICS };
