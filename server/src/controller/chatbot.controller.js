import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;

// Hindi TTS voice configuration (Cartesia)
const CARTESIA_MODEL_ID = "sonic-multilingual"; // Default multilingual voice model
const CARTESIA_VOICE_ID = "fd2ada67-c2d9-4afe-b474-6386b87d8fc3"; // Replace with actual Hindi voice ID from dashboard

const SYSTEM_INSTRUCTIONS = {
  "hi-IN": `आप एक कृषि विशेषज्ञ सहायक हैं जो किसानों को फसल प्रबंधन, मिट्टी की सेहत, कीट नियंत्रण, आधुनिक खेती तकनीक, सरकारी योजनाओं और बाजार सलाह से संबंधित मार्गदर्शन देते हैं।
सिर्फ हिंदी (देवनागरी लिपि) में जवाब दें। अंग्रेजी का प्रयोग न करें।`,
  "en-US": `You are an AgriTech expert assistant helping farmers with crop management, soil health, pest control, modern farming techniques, government schemes, and market strategies.
Respond only in English. Do not use Hindi.`,
};

export const chatWithGemini = async (req, res) => {
  try {
    const { message, language } = req.body;
    let audioBase64 = null;
    let audioError = null;

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

    // Generate Gemini response
    let reply;
    try {
      const result = await model.generateContent(message);
      reply = result.response.text();
      if (!reply?.trim()) throw new Error("Empty response from AI model");
    } catch (geminiError) {
      console.error("Gemini AI Error:", geminiError);
      return res.status(500).json({
        success: false,
        error: "Failed to generate AI response. Please try again.",
      });
    }


    // ✅ Generate Hindi TTS with Cartesia
if (language === "hi-IN") {
  try {
    const response = await axios.post(
      "https://api.cartesia.ai/tts",
      {
        model_id: "sonic-multilingual",
        transcript: reply,
        voice: {
          mode: "id",
          id: CARTESIA_VOICE_ID, // replace with your Hindi-capable voice ID
        },
        output_format: {
          container: "mp3", // easier playback in browser
          encoding: "mp3",
          sample_rate: 44100,
        },
        generation_config: {
          volume: 1,
          speed: 1,
          emotion: "neutral",
        },
        language: "hi",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`,
          "Cartesia-Version": "2024-06-01",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // now returns pure MP3 bytes
      }
    );

    // Directly convert MP3 buffer → Base64 for frontend playback
    const audioBuffer = Buffer.from(response.data, "binary");
    audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Cartesia TTS Error:", err.response?.data || err.message);
    throw new Error("Failed to generate Hindi voice (Cartesia API error)");
  }
}

function createWavHeader(
  dataLength,
  channels = 1,
  sampleRate = 44100,
  bitDepth = 16
) {
  const buffer = Buffer.alloc(44);
  const bytesPerSample = bitDepth / 8;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // 1 = PCM (integer)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}



    // ✅ Respond with text + optional audio
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
      error: "An unexpected error occurred.",
    });
  }
};
