import { analyzePlant } from "../services/geminiService.js";
import Analysis from "../models/analysis.model.js";

export const analyzePlantController = async (req, res) => {
  try {
    const { userId, image } = req.body;

    if (!image || !userId) {
      return res.status(400).json({ error: "userId and image are required" });
    }

    const result = await analyzePlant(image);

    const newAnalysis = new Analysis({
      userId,
      image,
      disease: result.disease,
      recommendation: result.recommendation,
    });

    await newAnalysis.save();

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Analysis.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
