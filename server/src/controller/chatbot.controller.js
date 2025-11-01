import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ElevenLabs Configuration
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const ENGLISH_VOICE_ID = "pqHfZKP75CvOlQylNhV4";
const HINDI_VOICE_ID = "1qEiC6qsybMkmnNdVMbK";

// System instructions for different languages
const SYSTEM_INSTRUCTIONS = {
  "hi-IN": `आप एक कृषि विशेषज्ञ सहायक हैं जो किसानों को फसल प्रबंधन, मिट्टी की सेहत, कीट नियंत्रण, आधुनिक खेती तकनीक, सरकारी योजनाओं और बाजार सलाह से संबंधित मार्गदर्शन देते हैं।
सिर्फ हिंदी (देवनागरी लिपि) में जवाब दें। अंग्रेजी का प्रयोग न करें।`,
  "en-US": `You are an AgriTech expert assistant helping farmers with crop management, soil health, pest control, modern farming techniques, government schemes, and market strategies.
Respond only in English. Do not use Hindi.`,
};

/**
 * Main chat controller for handling Gemini AI + ElevenLabs TTS
 */
export const chatWithGemini = async (req, res) => {
  try {
    const { message, language } = req.body;


    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string",
      });
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not set in environment variables");
      return res.status(500).json({
        success: false,
        error: "AI service configuration error. Please contact support.",
      });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn("ELEVENLABS_API_KEY is not set. Audio generation will be skipped.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTIONS[language],
    });

    let reply;
    try {
      const result = await model.generateContent(message);
      reply = result.response.text();

      if (!reply || reply.trim() === "") {
        throw new Error("Empty response from AI model");
      }
    } catch (geminiError) {
      console.error("Gemini AI Error:", geminiError);
      return res.status(500).json({
        success: false,
        error: "Failed to generate AI response. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? geminiError.message
            : undefined,
      });
    }

    let audioBase64 = null;
    let audioError = null;

    if (process.env.ELEVENLABS_API_KEY) {
      try {
      
        const voiceId = language === "hi-IN" ? HINDI_VOICE_ID : ENGLISH_VOICE_ID;

        const ttsResponse = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            text: reply,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.4,
              similarity_boost: 0.8,
            },
          },
          {
            headers: {
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
            timeout: 30000,
          }
        );

        const audioBuffer = Buffer.from(ttsResponse.data, "binary");
        audioBase64 = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
      } catch (ttsError) {
        console.error("ElevenLabs TTS Error:", {
          status: ttsError.response?.status,
          message: ttsError.message,
          data: ttsError.response?.data
            ? Buffer.from(ttsError.response.data).toString("utf8")
            : "No data",
        });

        if (ttsError.response?.status === 401)
          audioError = "Invalid or expired API key.";
        else if (ttsError.response?.status === 429)
          audioError = "Rate limit exceeded. Try again later.";
        else if (ttsError.response?.status === 403)
          audioError = "Insufficient quota. Check ElevenLabs subscription.";
        else if (ttsError.code === "ECONNABORTED")
          audioError = "Audio generation timed out.";
        else
          audioError = "Audio generation failed. Text response is still available.";

        if (process.env.NODE_ENV === "development") {
          audioError += ` (${ttsError.message})`;
        }
      }
    }

    // ✅ Always respond with Gemini text; audio only if available
    res.json({
      success: true,
      reply,
      lang: language,
      audio: audioBase64,
      audioError,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unexpected error in chat controller:", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Health check endpoint for the chatbot service
 */
export const healthCheck = async (req, res) => {
  try {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        gemini: process.env.GOOGLE_API_KEY ? "configured" : "missing",
        elevenlabs: process.env.ELEVENLABS_API_KEY ? "configured" : "missing",
      },
    };

    res.json(health);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

/**
 * Get available voices from ElevenLabs
 */
export const getVoices = async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "ElevenLabs API key not configured",
      });
    }

    const response = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    });

    res.json({
      success: true,
      voices: response.data.voices,
    });
  } catch (error) {
    console.error("Error fetching voices:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available voices",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
