import genAI from "../config/geminiConfig.js";

export const analyzePlant = async (imageBase64) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Detect plant disease from this image and recommend treatment in structured JSON format with fields {disease, recommendation}.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/png", 
        },
      },
    ]);

    const text = result.response.text();
    return JSON.parse(text); // Expect structured JSON
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze plant");
  }
};
