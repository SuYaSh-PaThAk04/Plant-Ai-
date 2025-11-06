import express from "express";
import { predictCropYield } from "../controller/yeild.controller.js";

const router = express.Router();
router.post("/predict-yield", predictCropYield);
export default router;
