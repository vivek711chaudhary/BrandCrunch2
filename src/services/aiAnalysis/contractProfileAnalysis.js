import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeContractProfile = async (profile, apiKey) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following NFT contract profile and provide detailed insights:
      
      Brand: ${profile.brand}
      Contract Address: ${profile.contract_address}
      Blockchain: ${profile.blockchain}
      Category: ${profile.category}
      
      Performance Metrics:
      - Diamond Hands: ${profile.diamond_hands}
      - Profitable Trades: ${profile.profitable_trades}
      - Loss Making Trades: ${profile.loss_making_trades}
      - Profitable Volume: $${profile.profitable_volume}
      - Loss Making Volume: $${profile.loss_making_volume}
      - Token Score: ${profile.token_score}
      
      Please provide a comprehensive analysis covering:
      1. Overall performance and market position
      2. Trading patterns and investor behavior
      3. Risk assessment and potential concerns
      4. Future outlook and opportunities
      5. Specific recommendations for different stakeholders

      Return the analysis in this exact JSON structure:
      {
        "analysis": "Brief overall analysis of the contract's performance and position",
        "tradingAnalysis": {
          "volumeAnalysis": "Analysis of trading volumes and patterns",
          "profitability": "Assessment of profit/loss ratios and trading success",
          "marketActivity": "Analysis of market engagement and trading frequency"
        },
        "riskLevel": {
          "level": "Low/Medium/High",
          "explanation": "Detailed explanation of risk assessment"
        },
        "recommendations": [
          "Specific actionable recommendation 1",
          "Specific actionable recommendation 2",
          "Specific actionable recommendation 3"
        ],
        "score": "numerical_score_0_to_100"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // const analysisData = JSON.parse(text);
      // Clean the response text by removing markdown code block syntax
      const cleanedText = text.replace(/```json\n|\n```/g, '');
      const analysisData = JSON.parse(cleanedText);
      
      // Ensure all required fields are present with defaults if missing
      return {
        analysis: analysisData.analysis || "Analysis currently unavailable",
        tradingAnalysis: {
          volumeAnalysis: analysisData.tradingAnalysis?.volumeAnalysis || "Volume analysis unavailable",
          profitability: analysisData.tradingAnalysis?.profitability || "Profitability analysis unavailable",
          marketActivity: analysisData.tradingAnalysis?.marketActivity || "Market activity analysis unavailable"
        },
        riskLevel: {
          level: analysisData.riskLevel?.level || "Medium",
          explanation: analysisData.riskLevel?.explanation || "Risk assessment currently unavailable"
        },
        recommendations: analysisData.recommendations || ["No recommendations available at this time"],
        score: analysisData.score || 50
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return a structured fallback response
      return {
        analysis: "Analysis temporarily unavailable",
        tradingAnalysis: {
          volumeAnalysis: "Volume analysis unavailable",
          profitability: "Profitability analysis unavailable",
          marketActivity: "Market activity analysis unavailable"
        },
        riskLevel: {
          level: "Medium",
          explanation: "Unable to assess risk at this time"
        },
        recommendations: [
          "Please try analysis again",
          "Ensure all metrics are available",
          "Contact support if issue persists"
        ],
        score: 50
      };
    }
  } catch (error) {
    console.error('Error in contract profile analysis:', error);
    throw error;
  }
};
