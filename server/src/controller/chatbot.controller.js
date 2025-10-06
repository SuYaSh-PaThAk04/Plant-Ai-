import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are an expert AgriTech assistant specializing in agriculture, farming, crop management, and agricultural technology. 
You provide helpful, accurate, and practical advice to farmers and agricultural professionals in both English and Hindi.

Your expertise includes:
- Crop cultivation and management
- Soil health and fertilization
- Pest and disease control
- Weather-based farming advice
- Modern farming techniques and technology
- Government schemes for farmers
- Market prices and selling strategies
- Organic farming practices
- Irrigation and water management
- Agricultural machinery and equipment

Guidelines:
- Provide practical, actionable advice
- Be supportive and encouraging to farmers
- Use simple, easy-to-understand language
- When responding in Hindi, use Devanagari script naturally
- If asked about non-agricultural topics, politely redirect to agricultural matters
- Always prioritize farmer welfare and sustainable practices
- Provide localized advice when possible (considering Indian agriculture)
- First  provide response in nlish then same respinse in hindi , don't mix both the responses
- Strictly don't answer any question which is outside the feild and domain of agriculture 

Respond naturally in the language the user is speaking (English or Hindi), or provide bilingual responses when appropriate.`,
          },
        ],
      },
    });

    // Start a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    // Send message to Gemini
    const result = await chat.sendMessage(message);

    res.json({
      success: true,
      reply: result.response.text(),
    });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
