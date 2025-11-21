import { GoogleGenerativeAI } from "@google-generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const SYSTEM_INSTRUCTIONS = {
  "hi-IN": `आप एक कृषि विशेषज्ञ सहायक हैं... सिर्फ हिंदी में जवाब दें।`,
  "en-US": `You are an AgriTech expert assistant. Respond only in English.`,
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

    // Respond WITHOUT audio (11Labs removed)
    res.json({
      success: true,
      reply,
      lang: language,
      audio: null,
      audioError: null,
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
