import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const MarketplaceVolumeChart = ({ data, chartType = 'bar', selectedBrand }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentBrand, setCurrentBrand] = useState(selectedBrand || data[0]?.brand || '');

  useEffect(() => {
    if (selectedBrand && selectedBrand !== currentBrand) {
      setCurrentBrand(selectedBrand);
    }
  }, [selectedBrand, currentBrand]);

  const parseMarketplaceVolume = (volumeArray) => {
    if (!Array.isArray(volumeArray)) return [];
    
    return volumeArray.map(item => {
      const [marketplace, volume] = item.replace(/['"]/g, '').split(':');
      return {
        marketplace: marketplace || 'Unknown',
        volume: parseFloat(volume) || 0
      };
    }).filter(item => item.volume > 0)
      .sort((a, b) => b.volume - a.volume);
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || !data || data.length === 0) return;

    const selectedData = data.find(item => item.brand === currentBrand);
    if (!selectedData?.marketplace_volume) return;

    const marketplaceData = parseMarketplaceVolume(selectedData.marketplace_volume);
    const labels = marketplaceData.map(item => item.marketplace);
    const volumes = marketplaceData.map(item => item.volume);

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

    const borderColors = colors.map(color => color.replace('0.5)', '1)'));

    const baseConfig = {
      labels,
      datasets: [{
        label: 'Volume (ETH)',
        data: volumes,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1
      }]
    };

    const tooltipCallback = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M ETH`;
      if (value >= 1000) return `${(value / 1000).toFixed(2)}K ETH`;
      return `${value.toFixed(2)} ETH`;
    };

    const config = {
      type: chartType,
      data: baseConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: chartType === 'pie' ? {
            position: 'right',
            labels: { 
              color: '#fff',
              padding: 20,
              font: { size: 11 }
            }
          } : {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (chartType === 'pie') {
                  return `${context.label}: ${tooltipCallback(context.raw)}`;
                }
                return `Volume: ${tooltipCallback(context.raw)}`;
              }
            }
          },
          title: {
            display: true,
            text: `Marketplace Distribution - ${currentBrand}`,
            color: '#fff',
            font: { size: 16 }
          }
        },
        scales: chartType !== 'pie' ? {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
              color: '#fff',
              callback: tooltipCallback
            }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
              color: '#fff',
              maxRotation: 45,
              minRotation: 45
            }
          }
        } : undefined
      }
    };

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currentBrand, chartType, data]);

  const brandsWithMarketplaceVolume = data.filter(item => 
    Array.isArray(item.marketplace_volume) && 
    item.marketplace_volume.length > 0
  );

  if (brandsWithMarketplaceVolume.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Marketplace Volume Distribution</h3>
        <select
          value={currentBrand}
          onChange={(e) => setCurrentBrand(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-1"
        >
          {brandsWithMarketplaceVolume.map(item => (
            <option key={item.brand} value={item.brand}>
              {item.brand}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[400px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MarketplaceVolumeChart;
