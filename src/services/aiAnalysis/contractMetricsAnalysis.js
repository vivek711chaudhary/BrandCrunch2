import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeContractMetrics = async (metric, apiKey) => {
  try {
    console.log('Analyzing contract metrics with API key:', apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following NFT contract metrics and provide detailed insights:
      
      Contract Details:
      - Collection: ${metric.collection}
      - Brand: ${metric.brand}
      - Contract Address: ${metric.contract_address}
      - Blockchain: ${metric.blockchain}
      
      Performance Metrics:
      - Total Volume: $${metric.total_volume}
      - Market Cap: $${metric.mcap}
      - Mint Revenue: $${metric.mint_revenue}
      - Primary Sale Revenue: $${metric.primary_sale_revenue}
      - Secondary Sale Revenue: $${metric.secondary_sale_revenue}
      - Royalty Revenue: $${metric.royalty_revenue}
      
      Trading Activity:
      - Total Traders: ${metric.traders}
      - Retained Traders: ${metric.retained_traders}
      - Interactions: ${metric.interactions}
      - Growth Rate: ${metric.growth_rate}
      
      Please provide a comprehensive analysis covering:
      1. Overall performance and market position
      2. Trading patterns and investor behavior
      3. Revenue streams and profitability
      4. Growth indicators and market trends
      5. Risk assessment and recommendations

      Return the analysis in this exact JSON structure:
      {
        "analysis": "Brief overall analysis of the contract's performance",
        "performanceMetrics": {
          "volumeAnalysis": "Analysis of trading volumes and trends",
          "revenueBreakdown": "Assessment of revenue streams",
          "growthIndicators": "Analysis of growth metrics"
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

    console.log('Sending prompt to Gemini API');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini API');
    
    try {
      // Clean the response text by removing markdown code block syntax
      const cleanedText = text.replace(/```json\n|\n```/g, '');
      const analysisData = JSON.parse(cleanedText);
      console.log('Successfully parsed AI response:', analysisData);
      
      // Ensure all required fields are present with defaults if missing
      return {
        analysis: analysisData.analysis || "Analysis currently unavailable",
        performanceMetrics: {
          volumeAnalysis: analysisData.performanceMetrics?.volumeAnalysis || "Volume analysis unavailable",
          revenueBreakdown: analysisData.performanceMetrics?.revenueBreakdown || "Revenue breakdown unavailable",
          growthIndicators: analysisData.performanceMetrics?.growthIndicators || "Growth indicators unavailable"
        },
        riskLevel: {
          level: analysisData.riskLevel?.level || "Medium",
          explanation: analysisData.riskLevel?.explanation || "Risk assessment currently unavailable"
        },
        recommendations: analysisData.recommendations || ["No recommendations available at this time"],
        score: analysisData.score || "50"
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', text);
      
      // Return a structured fallback response
      return {
        analysis: "Analysis temporarily unavailable",
        performanceMetrics: {
          volumeAnalysis: "Volume analysis unavailable",
          revenueBreakdown: "Revenue breakdown unavailable",
          growthIndicators: "Growth indicators unavailable"
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
        score: "50"
      };
    }
  } catch (error) {
    console.error('Error in contract metrics analysis:', error);
    throw error;
  }
};
