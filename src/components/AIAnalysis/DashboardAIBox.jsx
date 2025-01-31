import BaseAIAnalysisBox from './BaseAIAnalysisBox';
import { analyzeDashboard } from '../../services/aiAnalysis/dashboardAnalysis';

const DashboardAIBox = ({ data }) => {
  const handleAnalyze = async (metrics) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please check your environment variables.');
    }
    return analyzeDashboard(metrics, apiKey);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-white">Market Intelligence</h2>
      </div>
      <div className="flex-grow">
        <BaseAIAnalysisBox
          metrics={data}
          onAnalyze={handleAnalyze}
          className="bg-transparent h-full"
        />
      </div>
    </div>
  );
};

export default DashboardAIBox;
