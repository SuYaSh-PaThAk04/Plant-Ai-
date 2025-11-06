import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

export const predictCropYield = async (req, res) => {
  try {
    const {
      area_name, // city / region name
      crop,
      variety,
      soil_type,
      soil_ph,
      n_nutrient_kg_ha,
      p_nutrient_kg_ha,
      k_nutrient_kg_ha,
      planting_date,
      area_ha,
    } = req.body;

    // 🧾 Validate inputs
    if (!area_name || !crop || !planting_date || !area_ha || !soil_type) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: area_name, crop, planting_date, area_ha, soil_type",
      });
    }

    // 🌾 Prepare data payload
    const payload = {
      area_name,
      crop,
      variety,
      soil_type,
      soil_ph,
      n_nutrient_kg_ha,
      p_nutrient_kg_ha,
      k_nutrient_kg_ha,
      planting_date,
      area_ha,
    };

    // 🧠 Prepare structured AI prompt
    const prompt = `
You are an expert agronomist and AI assistant.
Given the following farm details in JSON:
${JSON.stringify(payload, null, 2)}

Please:
1️⃣ Predict the **expected crop yield** in tonnes per hectare.
2️⃣ Predict the **total absolute revenue** in INR based on average market prices in India.
3️⃣ List the **top 3–5 key factors** affecting this yield.
4️⃣ Give **clear, actionable recommendations** (like fertilizer adjustment, irrigation scheduling, soil improvement, pest management, etc.) to increase yield.

Respond strictly in **valid JSON** format only:
{
  "predicted_yield_t_ha": number,
  "predicted_revenue_inr": number,
  "factors": [ "factor1", "factor2", "factor3" ],
  "recommendations": [ "recommendation1", "recommendation2", "recommendation3" ]
}
    `;

    // 🔮 Get Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // you can also use gemini-1.5-flash
    });

    // 🚀 Generate AI response
    const result = await model.generateContent([{ text: prompt }]);

    // 📜 Extract raw text from response
    const rawText = result.response.text();

    // 🧩 Parse JSON safely
    let parsed;
    try {
      const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.warn(
        "⚠️ Could not parse Gemini JSON, returning raw text instead."
      );
      parsed = { raw_response: rawText };
    }

    // ✅ Send back result
    res.status(200).json({
      success: true,
      data: parsed,
      payload,
    });
  } catch (error) {
    console.error("Prediction Error:", error);
    let message = "Error predicting crop yield.";
    if (error.message.includes("API key not valid"))
      message = "Invalid Gemini API key. Please update your .env key.";
    else if (error.message.includes("404"))
      message = "Gemini model not found. Try 'gemini-1.5-flash'.";

    res.status(500).json({
      success: false,
      message,
      error: error.message,
    });
  }
};
