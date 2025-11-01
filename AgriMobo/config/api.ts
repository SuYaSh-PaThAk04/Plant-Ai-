// API Configuration for AgriSense Mobile App
export const API_CONFIG = {
  // Backend base URLs
  BACKEND_URL:
    process.env.EXPO_PUBLIC_BACKEND_URL || "https://plant-ai-1sxv.onrender.com",
  LOCAL_BACKEND_URL:
    process.env.EXPO_PUBLIC_LOCAL_BACKEND_URL || "http://localhost:5000",

  // API Endpoints
  ENDPOINTS: {
    // AI Disease Detection
    AI_ANALYZE: "/api/ai/analyze",

    // Soil Analysis
    SOIL_ANALYZE: "/api/soil/analyze",

    // Chatbot
    CHAT: "/api/chat",

    // Wallet
    WALLET: {
      CONNECT: "/api/wallet/connect",
      BALANCE: "/api/wallet/balance",
      SEND: "/api/wallet/send",
    },
  },

  // Firebase Realtime Database (for sensor data)
  FIREBASE: {
    SENSOR_READINGS:
      "https://smartirrigationsystem-8dba4-default-rtdb.asia-southeast1.firebasedatabase.app",
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};

export const getLocalApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.LOCAL_BACKEND_URL}${endpoint}`;
};
