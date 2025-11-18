"use client";
import React, { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatEther,
  formatUnits,
  parseUnits,
} from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import {
  Wallet,
  Send,
  Copy,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const tokenAbi = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

export default function FarmerWallet({ rpcProviderUrl, tokenAddress }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [nativeBalance, setNativeBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/wallet";
  const ADDRESS =
    process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0xYourWalletAddress";

  // Check if MetaMask is installed
  useEffect(() => {
    setHasMetaMask(typeof window.ethereum !== "undefined");
  }, []);

  // Connect MetaMask with API integration
  async function connectWallet() {
     setLoading(true);
    if (typeof window.ethereum === "undefined") {
      setStatus("MetaMask not found. Please install MetaMask.");
      alert("Please install MetaMask extension to continue.");
      return;
    }

    try {
      setStatus("Connecting to MetaMask...");
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setStatus("No accounts found ❌");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Optional: Notify backend
      try {
        await fetch(`${API_BASE}/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });
      } catch (err) {
        console.warn("Backend connection failed:", err);
      }

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setStatus("Connected successfully ");

      // Listen for account or network changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setStatus("Disconnected");
        } else {
          setAccount(accounts[0]);
          setStatus("Account changed. Refreshing balances...");
          fetchBalances();
        }
      });

      window.ethereum.on("chainChanged", () => window.location.reload());
    } catch (err) {
      console.error("Connection error:", err);
      if (err.code === 4001) {
        setStatus("Connection rejected by user ❌");
      } else {
        setStatus("Connection failed ❌");
      }
    }
  }

  // Fetch balances from backend API
  async function fetchBalances() {
    if (!account) return;
    setIsRefreshing(true);

    try {
      const res = await fetch(`${API_BASE}/balance/${account}`);
      if (!res.ok) throw new Error("Failed to fetch balances");
      const data = await res.json();

      if (data.balances) {
        setNativeBalance(data.balances.native || "0");
        setTokenBalance(data.balances.token || "0");
      } else {
        setNativeBalance(data.nativeBalance || "0");
        setTokenBalance(data.tokenBalance || "0");
      }

      setStatus("Balances updated ");
    } catch (err) {
      console.error("Error fetching balances:", err);
      setStatus("Failed to fetch balances ");

      // Fallback to direct blockchain query
      if (provider && account) {
        try {
          const native = await provider.getBalance(account);
          setNativeBalance(formatEther(native));

          const token = new Contract(tokenAddress, tokenAbi, provider);
          const raw = await token.balanceOf(account);
          setTokenBalance(formatUnits(raw, 18));
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  // Send tokens through backend or fallback direct
  async function sendToken(to, amount) {
    if (!signer) return setStatus("Please connect your wallet first");
    if (!to || !amount) return setStatus("Please fill in all fields");

    try {
      setStatus("Preparing transaction...");
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: account,
          to,
          amount,
          tokenAddress,
          rpcProviderUrl,
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();

      if (data.success) {
        setStatus(`✅ Transaction confirmed! Hash: ${data.txHash.slice(0, 10)}...`);
        setTimeout(() => fetchBalances(), 2000);
      } else {
        setStatus(`Transaction failed: ${data.error || "Unknown error"} ❌`);
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setStatus("Transaction failed ❌");

      // Direct transaction fallback
      try {
        setStatus("Retrying with direct transaction...");
        const token = new Contract(tokenAddress, tokenAbi, signer);
        const tx = await token.transfer(to, parseUnits(amount, 18));
        setStatus(`Transaction sent: ${tx.hash.slice(0, 10)}...`);
        await tx.wait();
        setStatus(`✅ Transaction confirmed!`);
        fetchBalances();
      } catch (fallbackErr) {
        console.error("Fallback transaction failed:", fallbackErr);
        setStatus("Transaction failed ❌");
      }
    }
  }

  useEffect(() => {
    if (account) fetchBalances();
  }, [account]);

  function copyAddress() {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {!account ? (
        // Connect Wallet State
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-12 text-center">
          <div className="inline-flex p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl mb-6">
            <Wallet className="w-16 h-16 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your MetaMask wallet to view your balances and manage your
            FARM tokens
          </p>
          <button
            onClick={connectWallet}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 inline-flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Connect MetaMask
          </button>
        </div>
      ) : (
        // Connected State
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100">Your Wallet</p>
                    <p className="text-xs text-emerald-200">Connected</p>
                  </div>
                </div>
                <button
                  onClick={fetchBalances}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <p className="text-xs text-emerald-100 mb-2">Wallet Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm flex-1 truncate">{account}</p>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-xs text-emerald-100 mb-1">
                    Native Balance
                  </p>
                  <p className="text-2xl font-bold">
                    {parseFloat(nativeBalance).toFixed(4)} ETH
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-xs text-emerald-100 mb-1">FARM Balance</p>
                  <p className="text-2xl font-bold">
                    {parseFloat(tokenBalance).toFixed(2)} FARM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Receive Tokens</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl mb-4 inline-block">
                <QRCodeCanvas value={account} size={180} />
              </div>

              <p className="text-gray-400 text-sm">
                Scan this QR code to receive tokens at your wallet address
              </p>
            </div>

            {/* Send Tokens Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Send Tokens</h3>
              </div>

              <SendTokenForm onSend={sendToken} tokenBalance={tokenBalance} />
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">
                  Recent Activity
                </h3>
              </div>
              <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1">
                View All
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {status ? (
              <div
                className={`p-4 rounded-xl border ${
                  status.includes("✅")
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : status.includes("❌")
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                } flex items-center gap-3`}
              >
                {status.includes("✅") ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : status.includes("❌") ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Activity className="w-5 h-5 flex-shrink-0 animate-pulse" />
                )}
                <p className="text-sm font-medium">{status}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SendTokenForm({ onSend, tokenBalance }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (!to || !amount) return;
    setIsSending(true);
    await onSend(to, amount);
    setIsSending(false);
    setTo("");
    setAmount("");
  }

  function setMaxAmount() {
    setAmount(parseFloat(tokenBalance).toFixed(2));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-300 mb-2 text-sm font-medium">
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-300 text-sm font-medium">
            Amount (FARM)
          </label>
          <button
            onClick={setMaxAmount}
            className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors"
          >
            MAX
          </button>
        </div>
        <input
          type="number"
          placeholder="0.00"
          className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={isSending || !to || !amount}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
      >
        {isSending ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Tokens
          </>
        )}
      </button>
    </div>
  );
}
