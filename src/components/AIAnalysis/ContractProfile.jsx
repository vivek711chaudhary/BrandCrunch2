import React from 'react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const ContractProfileAIBox = ({ data }) => {
  // Simulated AI analysis
  const generateAnalysis = (data) => {
    const analysis = {
      marketTrend: data.profit_volume > data.loss_volume ? 'positive' : 'negative',
      tradeEfficiency: ((data.profitable_trades / (data.profitable_trades + data.loss_making_trades)) * 100) || 0,
      riskLevel: data.loss_volume > data.total_volume * 0.5 ? 'high' : 'moderate',
      recommendation: data.token_score > 70 ? 'strong-buy' : data.token_score > 50 ? 'hold' : 'sell'
    };

    return {
      summary: `Based on the analysis of ${data.name || 'this contract'}'s performance metrics:`,
      points: [
        `Market Trend: The contract shows a ${analysis.marketTrend} trend with ${data.profitable_trades} profitable trades against ${data.loss_making_trades} loss-making trades.`,
        `Trade Efficiency: ${analysis.tradeEfficiency.toFixed(1)}% success rate in trading activities, indicating ${analysis.tradeEfficiency > 50 ? 'effective' : 'challenging'} market positioning.`,
        `Risk Assessment: ${analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} risk profile based on volume metrics and trading patterns.`,
        `Token Score: Current score of ${data.token_score} suggests a ${analysis.recommendation.replace('-', ' ')} position.`
      ],
      recommendation: `Recommended Action: ${analysis.recommendation.toUpperCase()} - ${
        analysis.recommendation === 'strong-buy' 
          ? 'Consider increasing position based on strong metrics'
          : analysis.recommendation === 'hold'
          ? 'Maintain current position while monitoring performance'
          : 'Consider reducing exposure due to weak performance indicators'
      }`
    };
  };

  const analysis = generateAnalysis(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <SparklesIcon className="w-5 h-5 text-purple-400 mt-1" />
          <div>
            <p className="text-white font-medium">{analysis.summary}</p>
            <ul className="mt-2 space-y-2">
              {analysis.points.map((point, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-purple-400 font-medium">{analysis.recommendation}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ContractProfileAIBox;
