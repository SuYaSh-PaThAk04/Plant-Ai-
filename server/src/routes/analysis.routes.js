import express from "express";
import {
  analyzePlantController,
  getAnalysisHistory,
} from "../controller/analysis.controller.js";

const router = express.Router();

router.post("/analyze", analyzePlantController);
router.get("/history/:userId", getAnalysisHistory);

export default router;
