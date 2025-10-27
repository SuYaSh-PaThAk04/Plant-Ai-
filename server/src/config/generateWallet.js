// scripts/generateWallet.js
import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

console.log("✅ New wallet generated:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log(
  "Mnemonic:",
  wallet.mnemonic?.phrase || "No mnemonic (not available in all versions)"
);
