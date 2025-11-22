import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const SYSTEM_INSTRUCTIONS = {
  "hi-IN": `आप एक कृषि विशेषज्ञ सहायक हैं जो किसानों को फसल प्रबंधन, मिट्टी की सेहत, कीट नियंत्रण, आधुनिक खेती तकनीक, सरकारी योजनाओं और बाजार सलाह से संबंधित मार्गदर्शन देते हैं।
सिर्फ हिंदी (देवनागरी लिपि) में जवाब दें। अंग्रेजी का प्रयोग न करें।`,

  "en-US": `You are an AgriTech expert assistant helping farmers with crop management, soil health, pest control, modern farming techniques, government schemes, and market strategies.
Respond only in English. Do not use Hindi.`,
};

export const chatWithGemini = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTIONS[language],
    });

    let reply;

    try {
      const result = await model.generateContent(message);
      reply = result.response.text();

      if (!reply?.trim()) {
        throw new Error("Empty AI response");
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to generate AI response. Try again.",
      });
    }

    // 🔥 Final clean response (No audio)
    res.json({
      success: true,
      reply,
      lang: language,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({
      success: false,
      error: "An unexpected server error occurred.",
    });
  }
};
