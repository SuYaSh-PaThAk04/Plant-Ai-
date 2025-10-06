import express from "express";
import { analyzeSoil } from "../controller/soil.controller.js";

const router = express.Router();
router.post("/analyze", analyzeSoil);

export default router;
