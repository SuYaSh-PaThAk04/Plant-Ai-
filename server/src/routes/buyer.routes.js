import express from "express";
import {
  getAllBuyers,
  getBuyerById,
  createBuyer,
  updateBuyer,
  deleteBuyer,
  getBuyerStats,
} from "../controller/buyerController.js";

const router = express.Router();

router.get("/", getAllBuyers);
router.get("/stats", getBuyerStats);
router.get("/:id", getBuyerById);
router.post("/", createBuyer);
router.put("/:id", updateBuyer);
router.delete("/:id", deleteBuyer);

export default router;
