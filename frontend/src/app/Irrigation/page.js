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
} from "recharts";
import {
  Droplets,
  Thermometer,
  Wind,
  Download,
  Power,
  Leaf,
  Menu,
  Bell,
  Activity,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const [mode, setMode] = useState("AUTO");
  const [manualCommand, setManualCommand] = useState("OFF");
  const [sensorData, setSensorData] = useState({
    soil_moisture: 450,
    temperature: 24.5,
    humidity: 65,
  });
  const [chartData, setChartData] = useState([
    { time: "09:00", soil: 420, temp: 22, humidity: 70 },
    { time: "10:00", soil: 410, temp: 23, humidity: 68 },
    { time: "11:00", soil: 390, temp: 24, humidity: 65 },
    { time: "12:00", soil: 450, temp: 24.5, humidity: 65 },
  ]);
  const [lastWatered, setLastWatered] = useState(new Date().toISOString());
  const [duration, setDuration] = useState(120);
  const [showAlert, setShowAlert] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (sensorData.soil_moisture < 400) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [sensorData.soil_moisture]);

  const handleModeChange = async (newMode) => {
    setMode(newMode);
  };

  const handlePumpToggle = async (command) => {
    setManualCommand(command);
  };

  const downloadCSV = () => {
    const csvRows = [
      ["Time", "Soil Moisture", "Temperature (°C)", "Humidity (%)"],
      ...chartData.map((d) => [d.time, d.soil, d.temp, d.humidity]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "sensor_data.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 relative overflow-hidden">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 relative z-10">
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
            <Activity className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text">
              Live Monitoring
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time sensor data and intelligent irrigation control for optimal
            crop health
          </p>
        </motion.div>

        {/* Alert Banner */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-red-900/20 to-red-950/30 border border-red-500/20 rounded-2xl px-6 py-4 mb-8 flex items-center gap-3 backdrop-blur-sm"
            >
              <div className="bg-red-500/20 p-2 rounded-lg">
                <Droplets className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-400">
                  Soil Moisture Alert
                </p>
                <p className="text-sm text-gray-300">
                  Soil moisture is below optimal level. Consider irrigating now.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-green-500/20 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Soil Moisture",
                  value: sensorData.soil_moisture,
                  unit: "",
                  icon: Droplets,
                  color: "from-green-500 to-emerald-600",
                  bgColor: "from-green-900/20 to-emerald-950/30",
                },
                {
                  title: "Temperature",
                  value: sensorData.temperature,
                  unit: "°C",
                  icon: Thermometer,
                  color: "from-orange-500 to-red-600",
                  bgColor: "from-orange-900/20 to-red-950/30",
                },
                {
                  title: "Humidity",
                  value: sensorData.humidity,
                  unit: "%",
                  icon: Wind,
                  color: "from-blue-500 to-cyan-600",
                  bgColor: "from-blue-900/20 to-cyan-950/30",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${item.color} bg-opacity-20 rounded-xl`}
                    >
                      <item.icon className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wide mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white text-3xl font-bold">
                        {item.value.toFixed(1)}
                        <span className="text-xl ml-1 text-gray-400">
                          {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Control Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Mode Control */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/10 backdrop-blur-sm"
              >
                <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  Control Mode
                </h3>
                <div className="flex gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeChange("AUTO")}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      mode === "AUTO"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    AUTO
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeChange("MANUAL")}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      mode === "MANUAL"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    MANUAL
                  </motion.button>
                </div>

                <AnimatePresence>
                  {mode === "MANUAL" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePumpToggle("ON")}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                          manualCommand === "ON"
                            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        Pump ON
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePumpToggle("OFF")}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                          manualCommand === "OFF"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        Pump OFF
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Irrigation Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-900/20 to-blue-950/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm"
              >
                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Irrigation Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Watered</p>
                    <p className="text-white text-xl font-bold">
                      {lastWatered
                        ? new Date(lastWatered).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Duration</p>
                    <p className="text-white text-xl font-bold">
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
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Live Sensor Trends
                  </h2>
                  <p className="text-sm text-gray-400">
                    Real-time monitoring of environmental conditions
                  </p>
                </div>
                <motion.button
                  onClick={downloadCSV}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ color: "#d1d5db" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="soil"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Soil Moisture"
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#f97316"
                    strokeWidth={3}
                    name="Temperature (°C)"
                    dot={{ fill: "#f97316", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Humidity (%)"
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
