"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Pill,
  FileText,
} from "lucide-react";
import Image from "next/image";

export default function DiseaseDetectPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysis(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload or capture an image first!");
      return;
    }

    setLoadingAI(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(
        "https://plant-ai-1sxv.onrender.com/api/ai/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) setAnalysis(data.analysis);
        else alert("AI analysis failed. Try again.");
      } catch {
        console.error("Non-JSON response:", text);
        alert("Unexpected server response.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI service.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-6 backdrop-blur-xl border border-green-500/30"
          >
            <Sparkles className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text">
              AI Disease Detection
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload or capture an image of your crop to get instant AI-powered
            disease analysis and treatment recommendations
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-green-500/20 overflow-hidden"
        >
          {/* Upload Section */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {!imagePreview ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Upload Buttons Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Button */}
                    <label className="relative cursor-pointer group">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                        accept="image/*"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 shadow-lg shadow-green-500/30 border border-green-400/20 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex flex-col items-center text-center space-y-4">
                          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              Upload Image
                            </h3>
                            <p className="text-green-100/80 text-sm">
                              Choose from gallery
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </label>

                    {/* Camera Button */}
                    <label className="relative cursor-pointer group">
                      <input
                        type="file"
                        ref={cameraInputRef}
                        onChange={handleImageSelect}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                      />
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-8 shadow-lg shadow-emerald-500/30 border border-emerald-400/20 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex flex-col items-center text-center space-y-4">
                          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              Take Photo
                            </h3>
                            <p className="text-emerald-100/80 text-sm">
                              Use device camera
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </label>
                  </div>

                  {/* Info Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: "🎯", text: "Accurate Detection" },
                      { icon: "⚡", text: "Fast Analysis" },
                      { icon: "💡", text: "Smart Solutions" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-green-500/10 backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-gray-300 text-sm font-medium">
                            {item.text}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  {/* Image Preview */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                    <div className="relative overflow-hidden rounded-2xl">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-96 object-cover"
                        width={500}
                        height={500}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          setAnalysis(null);
                        }}
                        className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-full backdrop-blur-sm transition-colors"
                      >
                        <AlertCircle className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!loadingAI && !analysis && (
                    <div className="flex gap-4">
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Analyze with AI</span>
                      </motion.button>
                    </div>
                  )}

                  {/* Loading State */}
                  {loadingAI && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center space-y-6 py-8"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Sparkles className="w-8 h-8 text-green-400" />
                        </motion.div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-green-400 font-semibold text-lg">
                          AI Analysis in Progress
                        </p>
                        <p className="text-gray-400 text-sm">
                          Processing your image... (~8 seconds)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5 }}
                className="border-t border-green-500/20 bg-gradient-to-br from-gray-900/50 to-green-950/30 p-8 md:p-12"
              >
                <div className="space-y-8">
                  {/* Success Header */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center space-x-3 pb-6"
                  >
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                      Analysis Complete
                    </h2>
                  </motion.div>

                  {/* Disease Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-red-900/20 to-red-950/30 rounded-2xl p-6 border border-red-500/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-500/20 rounded-xl">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-2">
                          Disease Identified
                        </h3>
                        <p className="text-white text-2xl font-bold">
                          {analysis.disease}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-900/20 to-blue-950/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <FileText className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wide mb-2">
                          Description
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {analysis.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Treatment Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-900/20 to-emerald-950/30 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Pill className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-2">
                          Recommended Treatment
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {analysis.cure}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Crop Info */}
                  {analysis.cropInfo && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-emerald-900/20 to-green-950/30 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                          <Leaf className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-2">
                            Crop Information
                          </h3>
                          <p className="text-white text-xl font-semibold">
                            {analysis.cropInfo.type}
                          </p>
                        </div>
                      </div>
                      <div className="ml-16 space-y-3">
                        {analysis.cropInfo.properties.map((prop, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="mt-1">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-gray-300 leading-relaxed">
                              {prop}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* New Analysis Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                      setAnalysis(null);
                    }}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600/50 transition-all duration-300"
                  >
                    Analyze Another Image
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
