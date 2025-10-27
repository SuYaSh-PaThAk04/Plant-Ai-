// controllers/walletController.js
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const rpc = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(rpc);
// For optional signing (backend transactions)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

export const getWalletBalance = async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    // Native balance (ETH)
    const ethBalance = await provider.getBalance(address);
    const ethFormatted = ethers.formatEther(ethBalance);

    let tokenFormatted = "0.0";
    let tokenSymbol = "";

    try {
      // Check if token address is valid contract
      const code = await provider.getCode(tokenAddress);
      if (code === "0x") {
        console.warn("⚠️ No contract found at token address");
      } else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          tokenAbi,
          provider
        );
        const tokenBalance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        tokenSymbol = await tokenContract.symbol();
        tokenFormatted = ethers.formatUnits(tokenBalance, decimals);
      }
    } catch (err) {
      console.warn("Token fetch failed:", err.shortMessage || err.message);
    }

    res.json({
      address,
      network: await provider.getNetwork(),
      balances: {
        native: `${ethFormatted} ETH`,
        token: `${tokenFormatted} ${tokenSymbol || "TOKEN"}`,
      },
    });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
};

export const sendTokens = async (req, res) => {
  try {
    const { to, amount } = req.body;
    if (!ethers.isAddress(to))
      return res.status(400).json({ error: "Invalid address" });

    const token = new ethers.Contract(
      process.env.TOKEN_ADDRESS,
      tokenAbi,
      signer
    );
    const decimals = await token.decimals();
    const tx = await token.transfer(
      to,
      ethers.parseUnits(amount.toString(), decimals)
    );
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
