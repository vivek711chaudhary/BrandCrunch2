import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  TrophyIcon,
  FireIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import BrandTable from './components/BrandTable';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import NFTBrandMetricsDetail from './pages/NFTBrandMetricsDetail';
import NFTBrandCategory from './pages/NFTBrandCategory';
import NFTBrandContractProfile from './pages/NFTBrandContractProfile';
import NFTBrandMetadata2 from './pages/NFTBrandMetadata2';
import { DashboardAIBox } from './components/AIAnalysis';
import { Loader } from './components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import store from './store/store';
import RefreshButton from './components/RefreshButton';
import BrandDetailView from './pages/BrandDetailView';
import BrandsOverview from './pages/BrandsOverview';
import Analysis from './pages/Analysis';
import Test from './pages/Test';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = store.subscribe((state) => {
      if (state.brandMetrics) {
        setMetrics(state.brandMetrics);
        
        // Calculate dashboard data from metrics
        const totalMarketCap = state.brandMetrics.reduce((sum, item) => {
          return sum + (item.market_cap || 0);
        }, 0);
        
        const totalVolume = state.brandMetrics.reduce((sum, item) => {
          return sum + (item.volume_24h || 0);
        }, 0);
        
        const activeTraders = state.brandMetrics.reduce((sum, item) => {
          return sum + (item.traders || 0);
        }, 0);
        
        const avgGrowthRate = state.brandMetrics.reduce((sum, item) => {
          return sum + (item.growth_rate || 0);
        }, 0) / (state.brandMetrics.length || 1);

        // Get top brands by market cap
        const topBrands = [...state.brandMetrics]
          .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
          .slice(0, 10);

        const dashboardUpdate = {
          total_market_cap: totalMarketCap,
          total_volume: totalVolume,
          active_traders: activeTraders,
          avg_growth_rate: avgGrowthRate,
          top_brands: topBrands
        };
        
        setDashboardData(dashboardUpdate);

        // Update chart data
        const chartUpdate = {
          labels: topBrands.slice(0, 5).map(brand => brand.name),
          datasets: [
            {
              label: 'Market Cap',
              data: topBrands.slice(0, 5).map(brand => brand.market_cap),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              yAxisID: 'marketCap',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Trading Volume',
              data: topBrands.slice(0, 5).map(brand => brand.volume_24h),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'volume',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Growth Rate',
              data: topBrands.slice(0, 5).map(brand => brand.growth_rate),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.2)',
              yAxisID: 'growth',
              tension: 0.4,
              fill: true
            }
          ]
        };
        
        setChartData(chartUpdate);
      }

      if (state.brandProfile) {
        setProfiles(state.brandProfile);
      }

      if (state.brandMetadata) {
        setMetadata(state.brandMetadata);
      }

      setLoading(state.isLoading);
      setError(state.error);
    });

    // Initial data load
    store.refreshData();

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p className="text-2xl font-bold mb-2">Error</p>
              <CardDescription>{error}</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<BrandsOverview />} />
            <Route path="/dashboard" element={<Analysis />} />
            <Route path="/metadata" element={<NFTBrandMetadata2 />} />
            <Route path="/metrics" element={<NFTBrandMetricsDetail />} />
            <Route path="/metrics-detail" element={<NFTBrandMetricsDetail />} />
            <Route path="/profile" element={<BrandDetailView />} />
            <Route path="/contract-metrics" element={<NFTBrandMetricsDetail />} />
            <Route path="/contract-profile" element={<NFTBrandContractProfile />} />
            <Route path="/brand-categories" element={<NFTBrandCategory />} />
            <Route path="/brands-overview" element={<BrandsOverview />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
