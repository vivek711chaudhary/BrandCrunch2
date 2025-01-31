import BaseAIAnalysisBox from './BaseAIAnalysisBox';
import { analyzeContractMetrics } from '../../services/aiAnalysis/contractMetricsAnalysis';

const ContractMetricsAIBox = ({ metrics }) => {
  const handleAnalyze = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please check your environment variables.');
    }
    return analyzeContractMetrics(data, apiKey);
  };

  return (
    <div className="h-full">
      <div className="flex items-center mb-6">
        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-white">Contract Metrics Analysis</h2>
      </div>
      <BaseAIAnalysisBox
        metrics={metrics}
        onAnalyze={handleAnalyze}
        className="bg-transparent"
      />
    </div>
  );
};

export default ContractMetricsAIBox;
