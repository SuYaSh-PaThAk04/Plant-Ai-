import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Upload,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

interface AnalysisResult {
  success: boolean;
  disease: string;
  confidence: number;
  description: string;
  treatment: string;
  severity: "high" | "moderate" | "low";
}

export default function DiseaseDetectionScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera permission is needed to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_BACKEND_URL ||
          "https://plant-ai-1sxv.onrender.com"
        }/api/ai/analyze`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (result.success && result.analysis) {
        const analysis = result.analysis;
        setAnalysisResult({
          success: true,
          disease: analysis.disease || "Unknown Disease",
          confidence: 0.9,
          description: analysis.description || "No description available",
          treatment: analysis.cure || "No treatment recommendations available",
          severity: analysis.severity || "moderate",
        });
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert(
        "Error",
        "Failed to analyze image. Please check your connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View
        style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600 }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Disease Detection
          </Text>
          <Text style={{ fontSize: 16, color: "#9ca3af" }}>
            Upload or capture an image to detect plant diseases using AI
          </Text>
        </MotiView>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {!selectedImage ? (
          /* Image Selection Interface */
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 600, delay: 200 }}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: width * 0.8,
                height: width * 0.8,
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "rgba(75, 85, 99, 0.5)",
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Shield size={64} color="#10b981" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Select Plant Image
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9ca3af",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                Choose an image from your gallery or take a new photo
              </Text>

              <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Upload size={20} color="#10b981" />
                  <Text
                    style={{
                      color: "#10b981",
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                  >
                    Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePhoto}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Camera size={20} color="#10b981" />
                  <Text
                    style={{
                      color: "#10b981",
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                  >
                    Camera
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </MotiView>
        ) : (
          /* Image Analysis Interface */
          <View style={{ flex: 1 }}>
            {/* Selected Image */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 600 }}
              style={{
                width: "100%",
                height: width * 0.8,
                borderRadius: 20,
                overflow: "hidden",
                marginBottom: 24,
                backgroundColor: "rgba(31, 41, 55, 0.8)",
              }}
            >
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </MotiView>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={resetAnalysis}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  backgroundColor: "rgba(75, 85, 99, 0.2)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(75, 85, 99, 0.5)",
                }}
              >
                <RotateCcw size={20} color="#9ca3af" />
                <Text
                  style={{ color: "#9ca3af", marginLeft: 8, fontWeight: "600" }}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={analyzeImage}
                disabled={isAnalyzing}
                style={{
                  flex: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                  backgroundColor: isAnalyzing
                    ? "rgba(75, 85, 99, 0.5)"
                    : "#10b981",
                  borderRadius: 12,
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isAnalyzing ? 0 : 0.3,
                  shadowRadius: 8,
                  elevation: isAnalyzing ? 0 : 8,
                }}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Shield size={20} color="#fff" />
                )}
                <Text
                  style={{ color: "#fff", marginLeft: 8, fontWeight: "600" }}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Disease"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Analysis Results */}
            {analysisResult && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 600 }}
                style={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderRadius: 20,
                  padding: 24,
                  borderWidth: 1,
                  borderColor:
                    analysisResult.severity === "high"
                      ? "rgba(239, 68, 68, 0.3)"
                      : analysisResult.severity === "moderate"
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(16, 185, 129, 0.3)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  {analysisResult.severity === "high" ? (
                    <AlertTriangle size={24} color="#ef4444" />
                  ) : analysisResult.severity === "moderate" ? (
                    <AlertTriangle size={24} color="#f59e0b" />
                  ) : (
                    <CheckCircle2 size={24} color="#10b981" />
                  )}
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#fff",
                      marginLeft: 12,
                    }}
                  >
                    {analysisResult.disease}
                  </Text>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{ fontSize: 14, color: "#9ca3af", marginBottom: 4 }}
                  >
                    Confidence Level
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 8,
                        backgroundColor: "rgba(75, 85, 99, 0.5)",
                        borderRadius: 4,
                      }}
                    >
                      <View
                        style={{
                          width: `${analysisResult.confidence * 100}%`,
                          height: "100%",
                          backgroundColor:
                            analysisResult.severity === "high"
                              ? "#ef4444"
                              : analysisResult.severity === "moderate"
                              ? "#f59e0b"
                              : "#10b981",
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      {Math.round(analysisResult.confidence * 100)}%
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: 8,
                    }}
                  >
                    Description
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#9ca3af", lineHeight: 20 }}
                  >
                    {analysisResult.description}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: 8,
                    }}
                  >
                    Recommended Treatment
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#9ca3af", lineHeight: 20 }}
                  >
                    {analysisResult.treatment}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Download size={20} color="#10b981" />
                  <Text
                    style={{
                      color: "#10b981",
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                  >
                    Download Report
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
