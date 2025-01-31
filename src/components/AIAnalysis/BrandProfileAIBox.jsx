import BaseAIAnalysisBox from './BaseAIAnalysisBox';
import { analyzeBrandProfile } from '../../services/aiAnalysis/brandProfileAnalysis';

const BrandProfileAIBox = ({ profile }) => {
  const handleAnalyze = async (metrics) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please check your environment variables.');
    }
    return analyzeBrandProfile(metrics, apiKey);
  };

  return (
    <div className="h-full">
      <div className="flex items-center mb-6">
        <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5M8 8v8m8 4h2a2 2 0 002-2V6a2 2 0 00-2-2h-2M4 6v12a2 2 0 002 2h2m3-4v4m0 0v4m0-4h4m-4 0H8" />
        </svg>
        <h2 className="text-xl font-semibold text-white">Brand Analysis</h2>
      </div>
      <BaseAIAnalysisBox
        metrics={profile}
        onAnalyze={handleAnalyze}
        className="bg-transparent"
      />
    </div>
  );
};

export default BrandProfileAIBox;
