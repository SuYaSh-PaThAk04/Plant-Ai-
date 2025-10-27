// routes/walletRoutes.js
import express from "express";
import {
  getWalletBalance,
  sendTokens,
} from "../controller/wallet.Controller.js";

const router = express.Router();

router.post("/connect", (req, res) => {
  const { address } = req.body;
  console.log("Wallet connected:", address);
  res.json({
    success: true,
    message: "Wallet connected successfully",
    address,
  });
});
router.get("/balance/:address", getWalletBalance);
router.post("/send", sendTokens);

export default router;
