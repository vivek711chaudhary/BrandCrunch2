import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

const formatCurrency = (value) => {
  const absValue = Math.abs(value);
  if (absValue >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatValue = (value, type) => {
  if (type === 'marketCap') return formatCurrency(value);
  if (type === 'volume') return formatCurrency(value);
  if (type === 'growth') return `${value.toFixed(2)}%`;
  return value.toLocaleString();
};

const Chart = ({ data, title }) => {
  const [selectedCompanies, setSelectedCompanies] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (data?.datasets) {
      const initialSelected = data.datasets.reduce((acc, dataset) => {
        acc[dataset.label] = true;
        return acc;
      }, {});
      setSelectedCompanies(initialSelected);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.datasets) return;

    const filteredDatasets = data.datasets
      .filter(dataset => selectedCompanies[dataset.label])
      .map(dataset => ({
        ...dataset,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          const baseColor = dataset.borderColor.replace('rgb', 'rgba').replace(')', ', 0.2)');
          gradient.addColorStop(0, baseColor);
          gradient.addColorStop(1, 'rgba(17, 24, 39, 0)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hitRadius: 10, 
        pointBackgroundColor: dataset.borderColor,
        pointHoverBackgroundColor: 'white',
        pointBorderColor: dataset.borderColor,
        pointHoverBorderColor: dataset.borderColor,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
      }));

    setChartData({
      labels: data.labels,
      datasets: filteredDatasets
    });
  }, [data, selectedCompanies]);

  const toggleCompany = (companyName) => {
    setSelectedCompanies(prev => ({
      ...prev,
      [companyName]: !prev[companyName]
    }));
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const yAxisID = context.dataset.yAxisID;

            if (value === null || value === undefined) {
              return `${label}: N/A`;
            }

            if (yAxisID === 'marketCap') {
              return `${label}: ${formatCurrency(value)}`;
            } else if (yAxisID === 'volume') {
              return `${label}: ${formatCurrency(value)}`;
            } else if (yAxisID === 'growth') {
              return `${label}: ${value.toFixed(2)}%`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      marketCap: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: value => formatCurrency(value)
        },
        title: {
          display: true,
          text: 'Market Cap',
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      volume: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: value => formatCurrency(value)
        },
        title: {
          display: true,
          text: 'Volume',
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      growth: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: value => `${value.toFixed(1)}%`
        },
        title: {
          display: true,
          text: 'Growth Rate',
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (!data?.datasets) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-800/50 rounded-lg">
        <div className="text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (data.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-800/50 rounded-lg">
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full bg-gray-800/50 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex flex-wrap gap-3">
        {data.datasets.map((dataset) => (
          <button
            key={dataset.label}
            onClick={() => toggleCompany(dataset.label)}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCompanies[dataset.label]
                ? 'bg-opacity-100 shadow-md'
                : 'bg-opacity-50 opacity-50'
            }`}
            style={{
              backgroundColor: dataset.borderColor.replace('rgb', 'rgba').replace(')', ', 0.1)'),
              color: dataset.borderColor,
              border: `1px solid ${dataset.borderColor}`
            }}
          >
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: dataset.borderColor }}
            />
            {dataset.label}
          </button>
        ))}
      </div>

      <div className="h-[400px]">
        <Line 
          data={chartData} 
          options={options}
          redraw={true}
        />
      </div>
    </motion.div>
  );
};

export default Chart;
