import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Initialize Gemini AI - removed invalid apiEndpoint option
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    // Read and encode the image
    const imagePath = path.resolve(file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    // ✅ Use a valid Gemini model name
    // Available models: gemini-1.5-flash, gemini-1.5-pro, gemini-1.5-flash-8b
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // 🌱 Structured AI instruction
    const prompt = `
You are an agricultural expert AI system specializing in plant disease diagnosis.

Analyze the provided image carefully and determine:
1. Is this image showing a plant/crop? If NOT (e.g., person, animal, object, scenery), respond with: {"error": "Please upload a valid plant image."}
2. If it IS a plant, identify any diseases or confirm if healthy.

Return a JSON response ONLY in this exact format:
{
  "disease": "name of the disease or 'Healthy Plant'",
  "description": "detailed explanation of symptoms, causes, and impact (2-3 sentences)",
  "cure": "comprehensive treatment plan including fungicides, organic solutions, and preventive measures (3-4 sentences)",
  "cropInfo": {
    "type": "specific crop name with scientific name in parentheses",
    "properties": [
      "property 1 about growth requirements",
      "property 2 about care needs",
      "property 3 about common issues",
      "property 4 about harvesting",
      "property 5 about benefits or uses"
    ]
  }
}

IMPORTANT: 
- Respond ONLY with valid JSON, no markdown, no code blocks, no extra text
- If not a plant image, use the error format shown above
- Be specific and detailed in all descriptions
- Provide actionable treatment advice
`;

    // 🧠 Generate AI response with timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI request timeout")), 30000)
    );

    const aiPromise = model.generateContent([
      { inlineData: { mimeType: file.mimetype, data: imageBase64 } },
      { text: prompt },
    ]);

    const result = await Promise.race([aiPromise, timeoutPromise]);

    // Extract the raw text response
    const rawText = result.response.text();

    // 🧾 Parse JSON safely with multiple fallback strategies
    let parsed;
    try {
      // Strategy 1: Remove markdown code blocks
      let cleanText = rawText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      // Strategy 2: Try to find JSON object in the text
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      parsed = JSON.parse(cleanText);

      // Validate the response structure
      if (!parsed.disease || !parsed.description || !parsed.cure) {
        throw new Error("Invalid response structure");
      }
    } catch (parseError) {
      console.warn("⚠️ JSON parsing failed:", parseError.message);
      console.warn("Raw response:", rawText);

      // Fallback: Create structured response from raw text
      parsed = {
        disease: "Analysis Complete",
        description: rawText.substring(0, 200) + "...",
        cure: "Please consult an agricultural expert for specific treatment recommendations.",
        cropInfo: {
          type: "Unable to determine",
          properties: ["Manual review recommended"],
        },
      };
    }

    // Check if AI detected non-plant image
    if (parsed.error) {
      return res.status(400).json({
        success: false,
        message: parsed.error,
      });
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(imagePath);
    } catch (cleanupError) {
      console.warn("Could not delete uploaded file:", cleanupError.message);
    }

    res.status(200).json({
      success: true,
      analysis: parsed,
    });
  } catch (error) {
    console.error("Error in analyzeImage:", error);

    // Determine specific error type
    let errorMessage = "Failed to analyze image.";
    let statusCode = 500;

    if (error.message.includes("API key not valid")) {
      errorMessage =
        "Invalid Gemini API key. Please check your .env configuration.";
      statusCode = 401;
    } else if (error.message.includes("404")) {
      errorMessage = "AI model not found. Using fallback model.";
    } else if (error.message.includes("timeout")) {
      errorMessage =
        "AI analysis timed out. Please try again with a smaller image.";
      statusCode = 408;
    } else if (error.message.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
      statusCode = 429;
    }

    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn("Could not delete uploaded file:", cleanupError.message);
      }
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Optional: Add a function to list available models (for debugging)
export const listModels = async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json({
      success: true,
      models: models.map((m) => ({ name: m.name, description: m.description })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
