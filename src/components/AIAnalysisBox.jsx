import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { analyzeContractMetrics } from '../services/aiAnalysis';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const AIAnalysisBox = ({ metrics }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
      }

      if (!metrics) {
        throw new Error('No metrics data provided for analysis.');
      }

      const result = await analyzeContractMetrics(metrics, apiKey);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis Error:', err);
      setError(err.message || 'Failed to generate analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [metrics]);

  const getInsightType = (text) => {
    const lowerText = text.toLowerCase();
    // Positive indicators
    if (
      lowerText.includes('strong') ||
      lowerText.includes('growth') ||
      lowerText.includes('positive') ||
      lowerText.includes('success') ||
      lowerText.includes('impressive') ||
      lowerText.includes('good') ||
      lowerText.includes('high') ||
      lowerText.includes('substantial')
    ) {
      return 'positive';
    }
    // Negative indicators
    if (
      lowerText.includes('concern') ||
      lowerText.includes('risk') ||
      lowerText.includes('low') ||
      lowerText.includes('weak') ||
      lowerText.includes('limited') ||
      lowerText.includes('decline') ||
      lowerText.includes('poor') ||
      lowerText.includes('lack')
    ) {
      return 'negative';
    }
    // Default to neutral
    return 'neutral';
  };

  const formatAnalysis = (text) => {
    // Split the analysis into sections based on double asterisks
    const sections = text.split('**').filter(Boolean);
    return sections.map((section, index) => {
      if (index % 2 === 0) {
        // This is a heading
        return (
          <div key={index} className="mb-4">
            <h4 className="text-primary font-medium mb-2">{section.trim()}</h4>
          </div>
        );
      } else {
        // This is content
        const insightType = getInsightType(section);
        const insightStyles = {
          positive: {
            containerClass: 'bg-green-500/10 border-green-500/20',
            textClass: 'text-green-300',
            icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
          },
          negative: {
            containerClass: 'bg-red-500/10 border-red-500/20',
            textClass: 'text-red-300',
            icon: <ExclamationCircleIcon className="w-5 h-5 text-red-400" />,
          },
          neutral: {
            containerClass: 'bg-gray-700/10 border-gray-600/20',
            textClass: 'text-gray-300',
            icon: <InformationCircleIcon className="w-5 h-5 text-gray-400" />,
          },
        };

        const { containerClass, textClass, icon } = insightStyles[insightType];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`mb-4 p-3 rounded-lg border ${containerClass} backdrop-blur-sm`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {icon}
              </div>
              <div className={`${textClass} text-sm leading-relaxed`}>
                {section.trim()}
              </div>
            </div>
          </motion.div>
        );
      }
    });
  };

  return (
    <motion.div
      className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-primary/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">AI Analysis</h3>
          </div>
          {error && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary hover:text-primary/80 p-2 rounded-lg transition-colors"
              onClick={fetchAnalysis}
              title="Retry analysis"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <motion.div
              className="h-4 bg-gray-700/50 rounded"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-4 bg-gray-700/50 rounded w-3/4"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-4 bg-gray-700/50 rounded w-5/6"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : error ? (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-start space-x-3 text-red-400">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Error generating analysis</p>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatAnalysis(analysis)}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIAnalysisBox;
