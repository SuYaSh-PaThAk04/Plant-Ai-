import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

const ENGLISH_VOICE_ID = "pqHfZKP75CvOlQylNhV4";
const HINDI_VOICE_ID = "AtX6p0vItOfWBULsG7XF";

export const chatWithGemini = async (req, res) => {
  try {
    const { message, language } = req.body; // 👈 receive selected language from frontend

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: {
        role: "system",
        parts: [
          {
            text:
              language === "hi-IN"
                ? `आप एक कृषि विशेषज्ञ सहायक हैं जो किसानों को फसल प्रबंधन, मिट्टी की सेहत, कीट नियंत्रण, आधुनिक खेती तकनीक, सरकारी योजनाओं और बाजार सलाह से संबंधित मार्गदर्शन देते हैं।  
सिर्फ हिंदी (देवनागरी लिपि) में जवाब दें।  अंग्रेजी का प्रयोग न करें।`
                : `You are an AgriTech expert assistant helping farmers with crop management, soil health, pest control, modern farming techniques, government schemes, and market strategies.  
Respond only in English. Do not use Hindi.`,
          },
        ],
      },
    });

    const chat = model.startChat({
      history: [{ role: "user", parts: [{ text: message }] }],
    });

    // 🌾 Get AI response
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // 🎙️ Select ElevenLabs voice based on chosen language
    const voiceId = language === "hi-IN" ? HINDI_VOICE_ID : ENGLISH_VOICE_ID;

    // 🧠 Generate audio with ElevenLabs
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: reply,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.4, similarity_boost: 0.8 },
      },
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = Buffer.from(ttsResponse.data, "binary");

    res.json({
      success: true,
      reply,
      lang: language,
      audio: `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`,
    });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
