import axios from 'axios';

const generateAnalysisPrompt = (metrics) => {
  return `You are an expert NFT market analyst. Analyze this NFT contract metrics data and provide insights:

Collection: ${metrics.collection}
Blockchain: ${metrics.blockchain}
Growth Rate: ${metrics.growth_rate}%
Total Revenue: $${metrics.total_revenue}
Market Cap: $${metrics.mcap}
Holders: ${metrics.holders}

Trading Activity:
- Total Volume: $${metrics.total_volume}
- Total Traders: ${metrics.traders}
- Retained Traders: ${metrics.retained_traders}
- Interactions: ${metrics.interactions}

Revenue Breakdown:
- Mint Revenue: $${metrics.mint_revenue}
- Primary Sales: $${metrics.primary_sale_revenue}
- Secondary Sales: $${metrics.secondary_sale_revenue}
- Royalty Revenue: $${metrics.royalty_revenue}

Provide a concise analysis covering:
1. Overall performance assessment
2. Key strengths and concerns
3. Trader engagement and retention
4. Revenue stream analysis
5. Growth potential indicators

Keep the analysis professional, data-driven, and focused on key performance indicators and market trends. Make it brief but insightful.`;
};

export const analyzeContractMetrics = async (metrics, apiKey) => {
  try {
    console.log('Metrics data:', metrics);
    console.log('API Key available:', !!apiKey);

    if (!apiKey) {
      throw new Error('Gemini API key is missing');
    }

    const requestData = {
      contents: [{
        parts: [{
          text: generateAnalysisPrompt(metrics)
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    console.log('Making request to Gemini API...');
    
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

    console.log('Gemini API Response:', response.data);

    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Invalid response from Gemini API');
    }

    const result = response.data.candidates[0].content.parts[0].text;
    if (!result) {
      throw new Error('No analysis generated');
    }

    return result;
  } catch (error) {
    console.error('AI Analysis Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    let errorMessage = 'Failed to generate AI analysis';
    
    if (error.response?.data?.error?.message) {
      errorMessage = `AI Analysis Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `AI Analysis Error: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};
