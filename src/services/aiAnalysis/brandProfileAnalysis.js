import axios from 'axios';

const generateBrandProfilePrompt = (profile) => {
  return `Analyze this NFT brand's profile data and provide insights:

Brand Data:
${JSON.stringify(profile, null, 2)}

Provide your response in the following format (do not include any markdown formatting or code blocks, just the raw JSON):
{
  "score": (number between 0-100),
  "analysis": (brief analysis of brand performance),
  "tradingAnalysis": {
    "profitability": (analysis of profitable vs loss-making trades),
    "volumeMetrics": (analysis of trading volumes),
    "holderBehavior": (analysis of diamond hands metric)
  },
  "recommendations": [(list of actionable recommendations)],
  "riskAssessment": (assessment of risk factors and potential)
}`;
};

const cleanJsonResponse = (text) => {
  return text.replace(/```json\n?|\n?```/g, '').trim();
};

export const analyzeBrandProfile = async (profile, apiKey) => {
  try {
    const requestData = {
      contents: [{
        parts: [{
          text: generateBrandProfilePrompt(profile)
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
    console.log('Raw Text:', rawText);
    const cleanedText = cleanJsonResponse(rawText);
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing brand profile analysis:', parseError);
      return {
        score: 70,
        analysis: "Unable to generate detailed analysis.",
        tradingAnalysis: {
          profitability: "Analysis unavailable",
          volumeMetrics: "Analysis unavailable",
          holderBehavior: "Analysis unavailable"
        },
        recommendations: [],
        riskAssessment: "Risk assessment unavailable"
      };
    }
  } catch (error) {
    console.error('Brand Profile Analysis Error:', error);
    return {
      score: 0,
      analysis: "Analysis failed.",
      tradingAnalysis: {
        profitability: "Analysis unavailable",
        volumeMetrics: "Analysis unavailable",
        holderBehavior: "Analysis unavailable"
      },
      recommendations: [],
      riskAssessment: "Risk assessment unavailable"
    };
  }
};
