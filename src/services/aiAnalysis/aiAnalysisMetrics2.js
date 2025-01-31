import axios from 'axios';

const generateSingleBrandPrompt = (metric) => {
  return `Analyze this NFT brand's metrics and provide insights:

Brand Data:
${JSON.stringify(metric, null, 2)}

Provide your response in the following format (do not include any markdown formatting or code blocks, just the raw JSON):
{
  "score": (number between 0-100),
  "analysis": (brief analysis of performance),
  "strengths": [(list of key strengths)],
  "weaknesses": [(list of areas for improvement)],
  "recommendations": [(list of actionable recommendations)]
}

Focus on:
1. Overall brand performance
2. User engagement (holders/traders ratio)
3. Revenue and volume metrics
4. Growth indicators
5. Market position

Keep the analysis concise and actionable.`;
};

const generateOverallAnalysisPrompt = (metrics) => {
  return `Analyze these NFT brand metrics and provide market insights:

Data:
${JSON.stringify(metrics, null, 2)}

Provide your response in the following format (do not include any markdown formatting or code blocks, just the raw JSON):
{
  "score": (number between 0-100),
  "analysis": (market overview),
  "keyMetrics": {
    "topPerformers": [(list of top performing brands)],
    "underperformers": [(list of underperforming brands)],
    "marketTrends": [(list of key market trends)],
    "recommendations": [(list of actionable recommendations)]
  }
}`;
};

const generateMetricsPrompt = (metrics) => {
  return `You are an expert NFT market analyst. Analyze this NFT brand metrics data and provide a comprehensive analysis with a performance score.

Data to analyze:
${JSON.stringify(metrics, null, 2)}

Provide your response in the following format (do not include any markdown formatting or code blocks, just the raw JSON):
{
  "score": (number between 0-100),
  "analysis": (detailed text analysis),
  "keyMetrics": {
    "topPerformers": [(list of top performing brands)],
    "underperformers": [(list of underperforming brands)],
    "marketTrends": [(list of key market trends)],
    "recommendations": [(list of actionable recommendations)]
  }
}

Focus your analysis on:
1. Overall market health and trends
2. Top performing brands and their success factors
3. Areas of concern or improvement
4. Volume and revenue patterns
5. User engagement metrics (holders/traders ratio)
6. Growth indicators
7. Market share distribution

Score calculation should consider:
- Trading volume and revenue (40%)
- User engagement and retention (30%)
- Growth metrics (20%)
- Market dominance (10%)

Keep the analysis professional, data-driven, and actionable.`;
};

const cleanJsonResponse = (text) => {
  return text.replace(/```json\n?|\n?```/g, '').trim();
};

export const analyzeSingleBrand = async (metric, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateSingleBrandPrompt(metric)
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

    const rawText = response.data.candidates[0].content.parts[0].text;
    const cleanedText = cleanJsonResponse(rawText);
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing brand analysis:', parseError);
      return {
        score: 70,
        analysis: "Unable to generate detailed analysis.",
        strengths: [],
        weaknesses: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error('Brand Analysis Error:', error);
    return {
      score: 0,
      analysis: "Analysis failed.",
      strengths: [],
      weaknesses: [],
      recommendations: []
    };
  }
};

export const analyzeMetrics = async (metrics, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateOverallAnalysisPrompt(metrics)
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

    const rawText = response.data.candidates[0].content.parts[0].text;
    const cleanedText = cleanJsonResponse(rawText);
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing market analysis:', parseError);
      return {
        score: 70,
        analysis: rawText,
        keyMetrics: {
          topPerformers: [],
          underperformers: [],
          marketTrends: [],
          recommendations: []
        }
      };
    }
  } catch (error) {
    console.error('Market Analysis Error:', error);
    return {
      score: 0,
      analysis: "Unable to generate analysis at this time.",
      keyMetrics: {
        topPerformers: [],
        underperformers: [],
        marketTrends: [],
        recommendations: []
      }
    };
  }
};
