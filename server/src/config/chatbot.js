import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables if using .env
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for AgriTech context
const SYSTEM_PROMPT = `You are an expert AgriTech assistant specializing in agriculture, farming, crop management, and agricultural technology. You provide helpful, accurate, and practical advice to farmers and agricultural professionals in both English and Hindi.

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

Respond naturally in the language the user is speaking (English or Hindi), or provide bilingual responses when appropriate.`;

app.post("/", async (req, res) => {
  try {
    const { message, language, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history
    let conversationHistory = (history || [])
      .slice(-6) // Keep last 6 messages for context
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // If the first message is not from the user, prepend a dummy user message
    if (
      conversationHistory.length === 0 ||
      conversationHistory[0].role !== "user"
    ) {
      conversationHistory.unshift({
        role: "user",
        parts: [{ text: "Hello! Let's talk about farming." }],
      });
    }

    // Create chat with system instructions
    const chat = model.startChat({
      history: conversationHistory,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();

    res.json({
      response: responseText,
      success: true,
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "Failed to process request",
      details: error.message,
    });
  }
});

export default app;
