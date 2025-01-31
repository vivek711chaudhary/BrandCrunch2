import axios from 'axios';

const generateBrandOverviewPrompt = (brandData) => {
  const metrics = brandData.data?.metrics || {};
  const metadata = brandData.data?.metadata || {};
  
  return `You are an expert NFT brand analyst. Analyze this NFT brand and provide a casual but insightful analysis. Also rate the brand from 0-100 based on its overall performance.

Brand Information:
- Brand Name: ${brandData.brand}
- Category: ${metadata.category || 'Unknown'}
- Description: ${metadata.description || 'Not Available'}

Performance Metrics:
- Total Volume: ${metrics.total_volume ? `$${metrics.total_volume}` : 'Not Available'}
- Total Revenue: ${metrics.total_revenue ? `$${metrics.total_revenue}` : 'Not Available'}
- Growth Rate: ${metrics.growth_rate ? `${metrics.growth_rate}%` : 'Not Available'}
- Market Cap: ${metrics.mcap ? `$${metrics.mcap}` : 'Not Available'}

Community Metrics:
- Total Holders: ${metrics.holders || 'Not Available'}
- Total Traders: ${metrics.traders || 'Not Available'}
- Retained Traders: ${metrics.retained_traders || 'Not Available'}
- Total Interactions: ${metrics.interactions || 'Not Available'}

Provide a brief, casual analysis covering:
1. Overall brand performance and potential
2. Community engagement and growth
3. A performance score (0-100) with a brief explanation

Keep the analysis conversational and easy to understand. Focus on the most important trends and insights.`;
};

export const analyzeBrandOverview = async (brandData, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateBrandOverviewPrompt(brandData)
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
      throw new Error('Invalid response from AI service');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    throw new Error('Failed to generate brand analysis');
  }
};
