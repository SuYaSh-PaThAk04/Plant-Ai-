"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Droplets,
  Thermometer,
  Wind,
  Download,
  Power,
  Activity,
  Clock,
  AlertCircle,
  WifiOff,
  Zap,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const BLYNK_TOKEN = "KlC8k2vkOEqNdN1Cdnw55rWxl4WTSaI6";
  const BLYNK_API = "https://blynk.cloud/external/api";

  const [mode, setMode] = useState("AUTO");
  const [manualCommand, setManualCommand] = useState("OFF");
  const [sensorData, setSensorData] = useState({
    soil_moisture: 0,
    temperature: 0,
    humidity: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [lastWatered, setLastWatered] = useState(null);
  const [duration, setDuration] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [pumpStatus, setPumpStatus] = useState("OFF");

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if soil moisture is below threshold (400)
    if (sensorData.soil_moisture > 0 && sensorData.soil_moisture < 400) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [sensorData.soil_moisture]);

  const fetchSensorData = async () => {
    try {
      // Fetch all sensor data from Blynk virtual pins
      // V1 = Soil Moisture, V3 = Temperature, V4 = Humidity
      const [moistureRes, tempRes, humidityRes] = await Promise.all([
        fetch(`${BLYNK_API}/get?token=${BLYNK_TOKEN}&V1`),
        fetch(`${BLYNK_API}/get?token=${BLYNK_TOKEN}&V3`),
        fetch(`${BLYNK_API}/get?token=${BLYNK_TOKEN}&V4`),
      ]);

      if (!moistureRes.ok || !tempRes.ok || !humidityRes.ok) {
        throw new Error("Failed to fetch sensor data from Blynk");
      }

      const moisture = parseFloat(await moistureRes.text()) || 0;
      const temperature = parseFloat(await tempRes.text()) || 0;
      const humidity = parseFloat(await humidityRes.text()) || 0;

      const data = {
        soil_moisture: moisture,
        temperature: temperature,
        humidity: humidity,
      };

      setSensorData(data);
      setConnectionError(false);
      setIsLoading(false);

      // Add to chart data
      const newDataPoint = {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        soil: data.soil_moisture || 0,
        temp: data.temperature || 0,
        humidity: data.humidity || 0,
      };

      setChartData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-10); // Keep last 10 data points
      });
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setConnectionError(true);
      setIsLoading(false);
    }
  };

  const handleModeChange = async (newMode) => {
    try {
      // V2: 1 = AUTO, 0 = MANUAL
      const modeValue = newMode === "AUTO" ? 1 : 0;

      const res = await fetch(
        `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V2=${modeValue}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setMode(newMode);
      console.log(`Mode changed to: ${newMode}`);
    } catch (err) {
      console.error("Error changing mode:", err);
      alert("Failed to change mode. Please check your connection to Blynk.");
    }
  };

  const handlePumpToggle = async (command) => {
    try {
      // V0: 1 = ON, 0 = OFF
      const pumpValue = command === "ON" ? 1 : 0;

      const res = await fetch(
        `${BLYNK_API}/update?token=${BLYNK_TOKEN}&V0=${pumpValue}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setManualCommand(command);
      setPumpStatus(command);

      if (command === "ON") {
        setLastWatered(new Date().toISOString());
        setDuration(120);
      }

      console.log(`Pump command: ${command}`);
    } catch (err) {
      console.error("Error toggling pump:", err);
      alert("Failed to control pump. Please check your connection to Blynk.");
    }
  };

  const downloadCSV = () => {
    if (chartData.length === 0) {
      alert("No data available to export");
      return;
    }

    const csvRows = [
      ["Time", "Soil Moisture", "Temperature (°C)", "Humidity (%)"],
      ...chartData.map((d) => [d.time, d.soil, d.temp, d.humidity]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `sensor_data_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getSoilStatus = (moisture) => {
    if (moisture < 300) return { label: "Critical", color: "text-red-400" };
    if (moisture < 400) return { label: "Low", color: "text-orange-400" };
    if (moisture < 600) return { label: "Good", color: "text-green-400" };
    return { label: "Optimal", color: "text-blue-400" };
  };

  const getTempStatus = (temp) => {
    if (temp < 15) return { label: "Cold", color: "text-blue-400" };
    if (temp < 25) return { label: "Ideal", color: "text-green-400" };
    if (temp < 35) return { label: "Warm", color: "text-orange-400" };
    return { label: "Hot", color: "text-red-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative z-10">
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
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl mb-6 backdrop-blur-xl border border-green-500/30 shadow-lg shadow-green-500/20"
          >
            <Droplets className="w-12 h-12 text-green-400" />
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text">
              Smart Irrigation
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Real-time IoT monitoring and intelligent water management powered by
            Blynk Cloud
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">
                Live Connected
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Connection Error Banner */}
        <AnimatePresence>
          {connectionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-orange-900/20 to-red-950/30 border border-orange-500/30 rounded-2xl px-6 py-5 mb-8 flex items-center gap-4 backdrop-blur-sm shadow-lg"
            >
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <WifiOff className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-orange-400 text-lg">
                  Connection Lost
                </p>
                <p className="text-sm text-gray-300">
                  Unable to connect to Blynk Cloud API. Retrying
                  automatically...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soil Moisture Alert Banner */}
        <AnimatePresence>
          {showAlert && !connectionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-red-900/30 to-red-950/40 border border-red-500/30 rounded-2xl px-6 py-5 mb-8 flex items-center gap-4 backdrop-blur-sm shadow-lg"
            >
              <div className="bg-red-500/20 p-3 rounded-xl animate-pulse">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-400 text-lg">
                  ⚠️ Low Soil Moisture Alert
                </p>
                <p className="text-sm text-gray-300">
                  Current level:{" "}
                  <span className="font-bold">{sensorData.soil_moisture}</span>{" "}
                  (Below optimal threshold of 400). Immediate irrigation
                  recommended.
                </p>
              </div>
              {mode === "MANUAL" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePumpToggle("ON")}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  Water Now
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500/30 border-t-green-500"></div>
            <p className="text-gray-400 mt-6 text-lg">
              Connecting to Blynk Cloud...
            </p>
          </motion.div>
        )}

        {/* Main Content Card */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Soil Moisture",
                  value: sensorData.soil_moisture,
                  unit: "",
                  icon: Droplets,
                  color: "from-green-500 to-emerald-600",
                  bgColor: "from-green-900/30 to-emerald-950/40",
                  borderColor: "border-green-500/30",
                  status: getSoilStatus(sensorData.soil_moisture),
                  trend:
                    chartData.length > 1
                      ? sensorData.soil_moisture >
                        chartData[chartData.length - 2]?.soil
                        ? "up"
                        : "down"
                      : "stable",
                },
                {
                  title: "Temperature",
                  value: sensorData.temperature,
                  unit: "°C",
                  icon: Thermometer,
                  color: "from-orange-500 to-red-600",
                  bgColor: "from-orange-900/30 to-red-950/40",
                  borderColor: "border-orange-500/30",
                  status: getTempStatus(sensorData.temperature),
                  trend:
                    chartData.length > 1
                      ? sensorData.temperature >
                        chartData[chartData.length - 2]?.temp
                        ? "up"
                        : "down"
                      : "stable",
                },
                {
                  title: "Humidity",
                  value: sensorData.humidity,
                  unit: "%",
                  icon: Wind,
                  color: "from-blue-500 to-cyan-600",
                  bgColor: "from-blue-900/30 to-cyan-950/40",
                  borderColor: "border-blue-500/30",
                  status: { label: "Normal", color: "text-blue-400" },
                  trend:
                    chartData.length > 1
                      ? sensorData.humidity >
                        chartData[chartData.length - 2]?.humidity
                        ? "up"
                        : "down"
                      : "stable",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-6 border ${item.borderColor} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${item.color} bg-opacity-20 rounded-xl shadow-lg`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp
                        className={`w-4 h-4 ${
                          item.trend === "up"
                            ? "text-green-400 rotate-0"
                            : item.trend === "down"
                            ? "text-red-400 rotate-180"
                            : "text-gray-400 rotate-90"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${item.status.color}`}
                      >
                        {item.status.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white text-5xl font-black mb-1">
                    {item.value.toFixed(1)}
                    <span className="text-2xl ml-2 text-gray-400 font-semibold">
                      {item.unit}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Control and Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Mode Control */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm shadow-xl"
              >
                <h3 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Power className="w-5 h-5" />
                  Control Mode
                </h3>
                <div className="flex gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeChange("AUTO")}
                    disabled={connectionError}
                    className={`flex-1 px-4 py-4 rounded-xl font-bold text-sm transition-all ${
                      mode === "AUTO"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
                    } ${
                      connectionError ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      AUTO
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeChange("MANUAL")}
                    disabled={connectionError}
                    className={`flex-1 px-4 py-4 rounded-xl font-bold text-sm transition-all ${
                      mode === "MANUAL"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
                    } ${
                      connectionError ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4" />
                      MANUAL
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {mode === "MANUAL" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePumpToggle("ON")}
                        disabled={connectionError || pumpStatus === "ON"}
                        className={`w-full px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          pumpStatus === "ON"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40"
                            : "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 hover:from-red-400 hover:to-pink-500"
                        } ${
                          connectionError ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Power className="w-5 h-5" />
                        {pumpStatus === "ON" ? "Pump Running" : "Turn Pump ON"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePumpToggle("OFF")}
                        disabled={connectionError || pumpStatus === "OFF"}
                        className={`w-full px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          pumpStatus === "OFF"
                            ? "bg-gray-700/70 text-gray-400"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70"
                        } ${
                          connectionError ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        Turn Pump OFF
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-900/30 to-blue-950/40 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm shadow-xl"
              >
                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">
                      Mode
                    </span>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-lg ${
                        mode === "AUTO"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {mode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">
                      Pump
                    </span>
                    <span
                      className={`text-sm font-bold flex items-center gap-2 ${
                        pumpStatus === "ON" ? "text-green-400" : "text-gray-400"
                      }`}
                    >
                      {pumpStatus === "ON" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {pumpStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">
                      Connection
                    </span>
                    <span
                      className={`text-sm font-bold flex items-center gap-2 ${
                        connectionError ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          connectionError
                            ? "bg-red-400"
                            : "bg-green-400 animate-pulse"
                        }`}
                      ></div>
                      {connectionError ? "Offline" : "Online"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Irrigation History */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/40 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-sm shadow-xl"
              >
                <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Last Irrigation
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2 font-medium">
                      Time
                    </p>
                    <p className="text-white text-lg font-bold">
                      {lastWatered
                        ? new Date(lastWatered).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Not yet watered"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2 font-medium">
                      Duration
                    </p>
                    <p className="text-white text-lg font-bold">
                      {duration ? `${duration} seconds` : "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-2xl p-8 border border-green-500/20 backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    Live Sensor Trends
                  </h2>
                  <p className="text-sm text-gray-400">
                    Real-time monitoring • Last 10 readings
                  </p>
                </div>
                <motion.button
                  onClick={downloadCSV}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={chartData.length === 0}
                  className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-500/40 transition-all flex items-center gap-2 ${
                    chartData.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </motion.button>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={450}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorSoil"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTemp"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorHumidity"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.98)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
                        padding: "12px 16px",
                      }}
                      labelStyle={{
                        color: "#d1d5db",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                      itemStyle={{
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontWeight: "600",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="soil"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorSoil)"
                      name="Soil Moisture"
                      dot={{
                        fill: "#10b981",
                        r: 5,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 7, strokeWidth: 3 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#f97316"
                      strokeWidth={3}
                      fill="url(#colorTemp)"
                      name="Temperature (°C)"
                      dot={{
                        fill: "#f97316",
                        r: 5,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 7, strokeWidth: 3 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorHumidity)"
                      name="Humidity (%)"
                      dot={{
                        fill: "#3b82f6",
                        r: 5,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 7, strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[450px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Activity className="w-16 h-16 mx-auto mb-4 text-green-400" />
                    </motion.div>
                    <p className="text-lg font-semibold">
                      Collecting sensor data...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      First reading will appear shortly
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-gray-900/50 border border-gray-700/50 rounded-full px-6 py-3 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm font-medium">
                  Powered by{" "}
                  <span className="text-green-400 font-bold">
                    Blynk IoT Platform
                  </span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Auto-refresh:{" "}
                  <span className="text-white font-semibold">5s</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
