import express from "express";
import multer from "multer";
import { analyzeImage } from "../controller/aiController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("image"), analyzeImage);

export default router;
