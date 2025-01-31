import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BrandMetricsChart = ({ data, chartType = 'bar', selectedMetrics, onBrandSelect }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const formatValue = (value, metricId) => {
    if (!value) return 0;
    
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => {
        const [, amount] = item.replace(/['"]/g, '').split(':');
        return sum + (parseFloat(amount) || 0);
      }, 0);
    }

    if (typeof value === 'string' && value.includes(':')) {
      const [, amount] = value.split(':');
      return parseFloat(amount) || 0;
    }

    return parseFloat(value) || 0;
  };

  const formatTooltipValue = (value, metricId) => {
    if (value === 0) return 'N/A';

    if (['total_volume', 'mint_revenue', 'primary_sale_revenue', 'secondary_sale_revenue', 'mcap', 'marketplace_volume', 'royalty_revenue', 'total_revenue'].includes(metricId)) {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M ETH`;
      if (value >= 1000) return `${(value / 1000).toFixed(2)}K ETH`;
      return `${value.toFixed(2)} ETH`;
    }

    if (metricId === 'growth_rate') {
      return `${(value * 100).toFixed(2)}%`;
    }

    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toLocaleString();
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || !data || !selectedMetrics || selectedMetrics.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    const labels = data.map(item => item.brand);

    const colors = [
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(111, 205, 205, 0.5)',
      'rgba(220, 120, 120, 0.5)',
    ];

    const datasets = selectedMetrics.map((metric, index) => ({
      label: metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      data: data.map(item => formatValue(item[metric], metric)),
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.5)', '1)'),
      borderWidth: 1
    }));

    const config = {
      type: chartType,
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const metric = selectedMetrics[context.datasetIndex];
                return `${context.dataset.label}: ${formatTooltipValue(context.raw, metric)}`;
              }
            }
          }
        },
        scales: chartType !== 'pie' ? {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff',
              callback: (value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                return value;
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          }
        } : undefined,
        onClick: (event, elements) => {
          if (!elements || elements.length === 0) return;
          const index = elements[0].index;
          onBrandSelect?.(labels[index]);
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, chartType, selectedMetrics, onBrandSelect]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-900 p-4 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No data available for the selected parameters</p>
      </div>
    );
  }

  if (selectedMetrics.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-900 p-4 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Please select at least one metric to display</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div style={{ height: '400px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BrandMetricsChart;
