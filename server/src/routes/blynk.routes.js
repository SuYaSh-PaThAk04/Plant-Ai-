import express from "express";
import {
  getSoilMoisture,
  controlPump,
  switchMode,
} from "../controller/blynk.controller.js";

const router = express.Router();

router.get("/soil", getSoilMoisture); // GET Soil moisture %
router.post("/pump", controlPump); // Turn pump ON/OFF
router.post("/mode", switchMode); // Switch Auto / Manual mode

export default router;
