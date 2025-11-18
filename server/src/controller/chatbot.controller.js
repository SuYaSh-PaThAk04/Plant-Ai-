import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;

const ELEVEN_VOICE_HINDI = "AtX6p0vItOfWBULsG7XF";
const ELEVEN_VOICE_ENGLISH = "21m00Tcm4TlvDq8ikWAM";

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

    let audioBase64 = null;
    let audioError = null;

    // Select voice ID based on language
    const selectedVoice =
      language === "hi-IN" ? ELEVEN_VOICE_HINDI : ELEVEN_VOICE_ENGLISH;

    try {
      const ttsResponse = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          text: reply,
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
          },
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
      audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;
    } catch (err) {
      console.error("ElevenLabs TTS Error:", err.response?.data || err.message);
      audioError = "Voice generation failed. Showing text response only.";
      console.error(
        "ElevenLabs Error (Readable):",
        JSON.parse(err.response?.data?.toString() || "{}")
      );

    }

    // ----------------------
    // 3️⃣ Return response
    // ----------------------
    res.json({
      success: true,
      reply,
      lang: language,
      audio: audioBase64, // even if null
      audioError,
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
