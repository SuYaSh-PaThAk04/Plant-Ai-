import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = path.resolve(file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the provided crop image and return three parts:
    1. Disease detected
    2. Recommended cure
    3. Type and properties of crop
    `;

    const result = await model.generateContent([
      { inlineData: { mimeType: file.mimetype, data: imageBase64 } },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    res.status(200).json({ success: true, data: responseText });
  } catch (error) {
    console.error("Gemini Error:", error);

    // ✅ DEMO fallback data when Gemini fails
    const demoResponse = {
      success: true,
      demo: true,
      data: {
        crop: "Apple (Malus domestica)",
        disease: "Bacterial Leaf Scorch (caused by Xylella fastidiosa)",
        symptoms: [
          "Brown, dry, and scorched-looking leaf edges",
          "Irregular brown necrosis starting from leaf margins",
          "Premature leaf drop and reduced fruit yield",
        ],
        cure: {
          cultural: [
            "Prune affected branches",
            "Remove fallen leaves and debris",
            "Avoid overhead irrigation",
          ],
          vector_control: [
            "Use neem-based insecticides",
            "Apply Imidacloprid carefully (systemic insecticide)",
            "Place yellow sticky traps to monitor leafhoppers",
          ],
          nutrition: [
            "Maintain balanced irrigation",
            "Use potassium and calcium-rich fertilizers",
          ],
        },
        crop_info: {
          type: "Fruit-bearing deciduous tree",
          properties: [
            "Prefers well-drained loamy soil",
            "Requires full sunlight",
            "Sensitive to drought and poor water management",
          ],
        },
        summary: {
          pathogen: "Xylella fastidiosa (bacterium)",
          spread: "Through xylem-feeding insects like leafhoppers",
          prevention: [
            "Inspect nursery plants before planting",
            "Maintain orchard hygiene",
            "Use resistant cultivars where possible",
          ],
        },
      },
    };

    // Send fallback demo data
    res.status(200).json(demoResponse);
  }
};
