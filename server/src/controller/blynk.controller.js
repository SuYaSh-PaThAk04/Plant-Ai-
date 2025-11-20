import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE = process.env.BLYNK_BASE_URL; // https://blynk.cloud/external/api
const TOKEN = process.env.BLYNK_TOKEN;

// Helper to talk to Blynk API
const blynkCall = async (endpoint) => {
  const url = `${BASE}/${endpoint}?token=${TOKEN}`;
  const res = await axios.get(url);
  return res.data;
};

// ---------------------- CONTROLLERS ----------------------

export const getSoilMoisture = async (req, res) => {
  try {
    const moisture = await blynkCall("get?V1");
    res.json({
      success: true,
      moisture: Number(moisture[0]), // convert string → number
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to read soil moisture",
    });
  }
};

export const controlPump = async (req, res) => {
  const { state } = req.body; // 1 = ON, 0 = OFF

  if (![0, 1].includes(state)) {
    return res
      .status(400)
      .json({ success: false, message: "state must be 0 or 1" });
  }

  try {
    await blynkCall(`update?V0=${state}`);
    res.json({
      success: true,
      pump: state,
      message: state === 1 ? "Pump turned ON" : "Pump turned OFF",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to control pump",
    });
  }
};

export const switchMode = async (req, res) => {
  const { mode } = req.body; // 1 = Auto, 0 = Manual

  if (![0, 1].includes(mode)) {
    return res
      .status(400)
      .json({ success: false, message: "mode must be 0 or 1" });
  }

  try {
    await blynkCall(`update?V2=${mode}`);
    res.json({
      success: true,
      mode,
      message: mode === 1 ? "Auto mode enabled" : "Manual mode enabled",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to switch mode",
    });
  }
};
