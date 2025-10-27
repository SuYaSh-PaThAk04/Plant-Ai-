"use client";
import React from "react";
import FarmerWallet from "../component/Wallet";
import { Sprout, Wallet, TrendingUp, Shield } from "lucide-react";

export default function WalletPage() {
  // Configuration - Update these with your actual values
  const rpcProviderUrl =
    process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-mumbai.maticvigil.com";
  const tokenAddress =
    process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0x341649FCCCbcF455294806f2E58b695e3FA121AE";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 overflow-x-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Farmer Wallet
              </h1>
              <p className="text-gray-400 text-sm">
                Manage your digital assets securely
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-gray-400 text-sm">Security</span>
              </div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-gray-500 mt-1">
                Decentralized & Secure
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-white">Fast</p>
              <p className="text-xs text-gray-500 mt-1">Lightning Speed</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sprout className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">Network</span>
              </div>
              <p className="text-2xl font-bold text-white">Polygon</p>
              <p className="text-xs text-gray-500 mt-1">Mumbai Testnet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wallet Component */}
      <div className="relative z-10 px-6 pb-20">
        <FarmerWallet
          rpcProviderUrl={rpcProviderUrl}
          tokenAddress={tokenAddress}
        />
      </div>

      {/* Info Banner */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Secure & Decentralized
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your private keys never leave your device. All transactions
                  are secured by blockchain technology and verified by the
                  network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
