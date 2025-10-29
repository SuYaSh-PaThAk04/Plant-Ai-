"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Zap,
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  Download,
  RefreshCw,
  Leaf,
  Bell,
  Menu,
} from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://smartirrigationsystem-8dba4-default-rtdb.asia-southeast1.firebasedatabase.app/.json"
      );
      const json = await response.json();
      setData(json);
      processData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (json) => {
    if (!json?.sensor_readings?.ESP8266_DEVICE_ID_1) return;

    const readings = json.sensor_readings.ESP8266_DEVICE_ID_1;
    const entries = Object.entries(readings);

    // Time series data
    const timeSeries = entries.slice(-20).map(([timestamp, values]) => ({
      time: new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      soil: values.soil_moisture,
      temp: values.temperature,
      humidity: values.humidity,
    }));
    setTimeSeriesData(timeSeries);

    // Calculate statistics
    const soilValues = entries.map(([, v]) => v.soil_moisture);
    const tempValues = entries.map(([, v]) => v.temperature);
    const humidityValues = entries.map(([, v]) => v.humidity);

    const stats = {
      soil: {
        avg: (
          soilValues.reduce((a, b) => a + b, 0) / soilValues.length
        ).toFixed(1),
        min: Math.min(...soilValues),
        max: Math.max(...soilValues),
      },
      temp: {
        avg: (
          tempValues.reduce((a, b) => a + b, 0) / tempValues.length
        ).toFixed(1),
        min: Math.min(...tempValues).toFixed(1),
        max: Math.max(...tempValues).toFixed(1),
      },
      humidity: {
        avg: (
          humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length
        ).toFixed(1),
        min: Math.min(...humidityValues).toFixed(1),
        max: Math.max(...humidityValues).toFixed(1),
      },
    };
    setStatsData(stats);

    // Pie chart data (sensor distribution)
    setPieData([
      {
        name: "Soil Moisture",
        value: parseFloat(stats.soil.avg),
        color: "#10b981",
      },
      {
        name: "Temperature",
        value: parseFloat(stats.temp.avg) * 10,
        color: "#f97316",
      },
      {
        name: "Humidity",
        value: parseFloat(stats.humidity.avg),
        color: "#3b82f6",
      },
    ]);

    // Radar chart data
    const latest = entries[entries.length - 1][1];
    setRadarData([
      { metric: "Soil", current: latest.soil_moisture, optimal: 500 },
      { metric: "Temp", current: latest.temperature * 20, optimal: 25 * 20 },
      { metric: "Humidity", current: latest.humidity, optimal: 70 },
    ]);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#10b981", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.08, 0.03, 0.08],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/20 to-green-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-6 backdrop-blur-xl border border-green-500/30"
          >
            <BarChart3 className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text">
              Advanced Analytics
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Deep insights into your irrigation system performance and
            environmental patterns
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full mb-4"
              />
              <p className="text-green-400 font-semibold text-lg">
                Loading Analytics...
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData &&
                  [
                    {
                      title: "Soil Moisture",
                      icon: Droplets,
                      avg: statsData.soil.avg,
                      min: statsData.soil.min,
                      max: statsData.soil.max,
                      color: "green",
                      bgColor: "from-green-900/20 to-emerald-950/30",
                    },
                    {
                      title: "Temperature",
                      icon: Thermometer,
                      avg: statsData.temp.avg,
                      min: statsData.temp.min,
                      max: statsData.temp.max,
                      unit: "°C",
                      color: "orange",
                      bgColor: "from-orange-900/20 to-red-950/30",
                    },
                    {
                      title: "Humidity",
                      icon: Wind,
                      avg: statsData.humidity.avg,
                      min: statsData.humidity.min,
                      max: statsData.humidity.max,
                      unit: "%",
                      color: "blue",
                      bgColor: "from-blue-900/20 to-cyan-950/30",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-${stat.color}-500/20 backdrop-blur-sm`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm uppercase tracking-wide font-bold mb-2">
                            {stat.title}
                          </p>
                          <h3 className="text-4xl font-black text-white">
                            {stat.avg}
                            <span className="text-xl ml-1 text-gray-400">
                              {stat.unit}
                            </span>
                          </h3>
                        </div>
                        <div
                          className={`p-3 bg-${stat.color}-500/20 rounded-xl`}
                        >
                          <stat.icon className="w-6 h-6 text-gray-300" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Min</p>
                          <p className="text-gray-300 font-semibold">
                            {stat.min}
                            {stat.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Max</p>
                          <p className="text-gray-300 font-semibold">
                            {stat.max}
                            {stat.unit}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Main Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Trend Analysis
                      </h3>
                      <p className="text-sm text-gray-400">
                        Sensor readings over time
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeSeriesData}>
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
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="soil"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorSoil)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Comparative View
                      </h3>
                      <p className="text-sm text-gray-400">
                        Recent measurements
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeSeriesData.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid rgba(249, 115, 22, 0.2)",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="temp"
                        fill="#f97316"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="humidity"
                        fill="#3b82f6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Second Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Distribution
                      </h3>
                      <p className="text-sm text-gray-400">Average values</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Radar Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20 lg:col-span-2"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Performance Radar
                      </h3>
                      <p className="text-sm text-gray-400">
                        Current vs Optimal levels
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#9ca3af" />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Optimal"
                        dataKey="optimal"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(17, 24, 39, 0.95)",
                          border: "1px solid rgba(59, 130, 246, 0.2)",
                          borderRadius: "12px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Multi-Line Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Complete Timeline
                      </h3>
                      <p className="text-sm text-gray-400">
                        All sensor metrics in one view
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </motion.button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        borderRadius: "12px",
                      }}
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
                      name="Temperature"
                      dot={{ fill: "#f97316", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Humidity"
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
