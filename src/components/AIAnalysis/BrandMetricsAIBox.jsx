import BaseAIAnalysisBox from './BaseAIAnalysisBox';
import { analyzeBrandMetrics } from '../../services/aiAnalysis/brandMetricsAnalysis';

const BrandMetricsAIBox = ({ metrics }) => {
  const handleAnalyze = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please check your environment variables.');
    }
    return analyzeBrandMetrics(data, apiKey);
  };

  return (
    <div className="h-full">
      <div className="flex items-center mb-6">
        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <h2 className="text-xl font-semibold text-white">Brand Metrics Analysis</h2>
      </div>
      <BaseAIAnalysisBox
        metrics={metrics}
        onAnalyze={handleAnalyze}
        className="bg-transparent"
      />
    </div>
  );
};

export default BrandMetricsAIBox;
