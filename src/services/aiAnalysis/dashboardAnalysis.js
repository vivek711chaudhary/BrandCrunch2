import axios from 'axios';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const generateDashboardPrompt = (data) => {
  return `You are an expert NFT market analyst. Analyze this NFT dashboard data and provide insights:

Overall Market Performance:
- Total Volume: ${formatCurrency(data.total_volume)}
- Total Revenue: ${formatCurrency(data.total_revenue)}
- Active Traders: ${formatNumber(data.active_traders)}
- Total Transactions: ${formatNumber(data.total_transactions)}

Top Performing Brands:
${data.top_brands.map(brand => `- ${brand.name}: ${formatCurrency(brand.volume)} volume`).join('\n')}

Recent Market Activity:
- 24h Volume: ${formatCurrency(data.volume_24h)}
- 24h Transactions: ${formatNumber(data.transactions_24h)}
- New Users: ${formatNumber(data.new_users_24h)}
- Active Collections: ${formatNumber(data.active_collections)}

Market Health Metrics:
- Average Transaction Value: ${formatCurrency(data.avg_transaction_value)}
- User Retention Rate: ${formatPercentage(data.retention_rate)}
- Market Growth Rate: ${formatPercentage(data.growth_rate)}

Provide a concise analysis covering:
1. Overall market performance and trends
2. Top performing brands and their impact
3. User activity and engagement metrics
4. Market health indicators
5. Key opportunities and potential risks

Keep the analysis professional, data-driven, and focused on actionable insights. Make it brief but comprehensive.`;
};

export const analyzeDashboard = async (dashboardData, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateDashboardPrompt(dashboardData)
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        }
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Dashboard Analysis Error:', error);
    throw error;
  }
};
