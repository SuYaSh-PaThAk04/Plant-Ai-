import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testModel() {
  try {
    // Choose a known valid model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Simple test prompt
    const result = await model.generateContent("Say hello, world!");
    console.log("✅ API connected successfully!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testModel();
