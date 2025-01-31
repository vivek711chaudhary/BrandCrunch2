import axios from 'axios';

const generateBrandMetricsPrompt = (metrics) => {
  return `You are an expert NFT brand analyst. Analyze this NFT brand metrics data and provide insights:

Brand Overview:
- Brand Name: ${metrics.name}
- Total Collections: ${metrics.total_collections}
- Total Volume: $${metrics.total_volume}
- Market Cap: $${metrics.market_cap}
- Growth Rate: ${metrics.growth_rate}%

Trading Activity:
- Total Traders: ${metrics.total_traders}
- Active Traders: ${metrics.active_traders}
- Retention Rate: ${metrics.retention_rate}%
- Trading Volume (24h): $${metrics.volume_24h}

Revenue Metrics:
- Total Revenue: $${metrics.total_revenue}
- Primary Sales: $${metrics.primary_sales}
- Secondary Sales: $${metrics.secondary_sales}
- Royalty Revenue: $${metrics.royalty_revenue}

Provide a concise analysis covering:
1. Overall brand performance and market position
2. Trading activity and community engagement
3. Revenue generation and sustainability
4. Growth trends and potential
5. Key strengths and areas of concern

Keep the analysis professional, data-driven, and focused on key performance indicators and market trends. Make it brief but insightful.`;
};

export const analyzeBrandMetrics = async (metrics, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateBrandMetricsPrompt(metrics)
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
    console.error('Brand Metrics Analysis Error:', error);
    throw error;
  }
};
