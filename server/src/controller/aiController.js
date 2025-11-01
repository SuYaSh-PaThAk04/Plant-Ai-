import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1",
});

export const analyzeImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Read and encode the image
    const imagePath = path.resolve(file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });

    // 🌱 Structured AI instruction
    const prompt = `
    You are an agricultural expert.
    Analyze the provided crop image and return a **JSON response** with:
    {
      "disease": "name of the disease or 'Healthy'",
      "description": "short detailed explanation of symptoms and cause",
      "cure": "recommended treatment and preventive actions",
      "cropInfo": {
        "type": "type of crop (e.g., fruit, cereal, legume)",
        "properties": ["list of 3-5 key properties about this crop"]
      }
    }
    Respond **only** in JSON format without any extra text.
    If the uploaded image does NOT appear to contain a plant (for example, if it shows a person, animal, car, object, or background scenery), do NOT attempt to classify a disease. 
Instead, respond exactly with:
"Please upload a valid plant image."
    `;

    // 🧠 Generate AI response
    const result = await model.generateContent([
      { inlineData: { mimeType: file.mimetype, data: imageBase64 } },
      { text: prompt },
    ]);

    const responseText = result.response.text();

    // 🧾 Parse JSON safely
    // Extract the raw text Gemini returned
    const rawText = result.response.text();

    // 🧠 Clean and parse the JSON safely
    let parsed;
    try {
      // Remove ```json or ``` if Gemini wrapped it in code block
      const cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.warn("⚠️ Could not parse JSON, returning raw text instead.");
      parsed = { rawText }; // fallback
    }

    res.status(200).json({
      success: true,
      analysis: parsed,
    });
  } catch (error) {
    console.error("Error in analyzeImage:", error);

    let errorMessage = "Failed to analyze image.";
    if (error.message.includes("API key not valid"))
      errorMessage = "Invalid Gemini API key. Please update your .env key.";
    else if (error.message.includes("404"))
      errorMessage = "Model not found. Try 'gemini-1.5-flash'.";

    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: error.message,
    });
  }
};
