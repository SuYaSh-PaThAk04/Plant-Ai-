"use client";
import { useEffect, useState } from "react";
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
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [radarData, setRadarData] = useState([]);

const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const [soilRes, tempRes, humRes] = await Promise.all([
      fetch(
        "https://blynk.cloud/external/api/get?token=KlC8k2vkOEqNdN1Cdnw55rWxl4WTSaI6&V1"
      ),
      fetch(
        "https://blynk.cloud/external/api/get?token=KlC8k2vkOEqNdN1Cdnw55rWxl4WTSaI6&V3"
      ),
      fetch(
        "https://blynk.cloud/external/api/get?token=KlC8k2vkOEqNdN1Cdnw55rWxl4WTSaI6&V4"
      ),
    ]);

    const soil = parseFloat(await soilRes.text());
    const temp = parseFloat(await tempRes.text());
    const humidity = parseFloat(await humRes.text());

    const reading = {
      soil,
      temp,
      humidity,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Append latest reading to the chart history
    setTimeSeriesData((prev) => [...prev.slice(-19), reading]);

    // Update stats
    setStatsData({
      soil: {
        avg: soil.toFixed(1),
        min: soil.toFixed(1),
        max: soil.toFixed(1),
      },
      temp: {
        avg: temp.toFixed(1),
        min: temp.toFixed(1),
        max: temp.toFixed(1),
      },
      humidity: {
        avg: humidity.toFixed(1),
        min: humidity.toFixed(1),
        max: humidity.toFixed(1),
      },
    });

    // Pie chart
    setPieData([
      { name: "Soil Moisture", value: soil, color: "#10b981" },
      { name: "Temperature", value: temp * 10, color: "#f97316" },
      { name: "Humidity", value: humidity, color: "#3b82f6" },
    ]);

    // Radar chart
    setRadarData([
      { metric: "Soil", current: soil, optimal: 100 },
      { metric: "Temp", current: temp * 20, optimal: 25 * 20 },
      { metric: "Humidity", current: humidity, optimal: 70 },
    ]);
  } catch (err) {
    console.error("Blynk fetch error:", err);
    setError("Unable to fetch data from Blynk");
  } finally {
    setLoading(false);
  }
};

  const generateDummyData = () => {
    console.log("Generating dummy data...");
    const now = Date.now();
    const dummyReadings = {};

    // Generate 30 dummy readings with realistic values
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now - (29 - i) * 60000).toISOString(); // 1 min intervals
      dummyReadings[timestamp] = {
        soil_moisture: 400 + Math.random() * 200 + Math.sin(i / 5) * 50,
        temperature: 22 + Math.random() * 8 + Math.sin(i / 3) * 3,
        humidity: 55 + Math.random() * 25 + Math.cos(i / 4) * 10,
      };
    }

    return dummyReadings;
  };

  const processData = (json) => {
    try {
      // Try to find sensor readings in various possible structures
      let readings = null;
      let useDummyData = false;

      // Check multiple possible paths
      if (json?.sensor_readings?.ESP8266_DEVICE_ID_1) {
        readings = json.sensor_readings.ESP8266_DEVICE_ID_1;
      } else if (json?.sensor_readings) {
        // If sensor_readings exists but not the device ID, take first device
        const firstDevice = Object.keys(json.sensor_readings)[0];
        readings = json.sensor_readings[firstDevice];
      } else if (json?.ESP8266_DEVICE_ID_1) {
        readings = json.ESP8266_DEVICE_ID_1;
      } else if (json && typeof json === "object") {
        // Try to find first object that looks like readings
        const firstKey = Object.keys(json)[0];
        if (firstKey && typeof json[firstKey] === "object") {
          readings = json[firstKey];
        }
      }

      // If no valid readings found or empty, use dummy data
      if (
        !readings ||
        typeof readings !== "object" ||
        Object.keys(readings).length === 0
      ) {
        console.warn("No valid sensor readings found, using dummy data");
        readings = generateDummyData();
        useDummyData = true;
      }

      const entries = Object.entries(readings);

      // Check if all values are zero
      const allZero = entries.every(([, v]) => {
        const soil = parseFloat(
          v.soil_moisture || v.soilMoisture || v.moisture || 0
        );
        const temp = parseFloat(v.temperature || v.temp || 0);
        const humid = parseFloat(v.humidity || v.humid || 0);
        return soil === 0 && temp === 0 && humid === 0;
      });

      if (allZero) {
        console.warn("All sensor values are zero, using dummy data");
        readings = generateDummyData();
        useDummyData = true;
      }

      console.log(
        `Processing ${entries.length} entries${
          useDummyData ? " (dummy data)" : ""
        }`
      );

      // Time series data - take last 20 readings
      const timeSeries = Object.entries(readings)
        .slice(-20)
        .map(([timestamp, values]) => {
          // Handle different possible field names
          const soilMoisture =
            values.soil_moisture || values.soilMoisture || values.moisture || 0;
          const temperature = values.temperature || values.temp || 0;
          const humidity = values.humidity || values.humid || 0;

          return {
            time: new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            soil: parseFloat(soilMoisture),
            temp: parseFloat(temperature),
            humidity: parseFloat(humidity),
          };
        });
      setTimeSeriesData(timeSeries);

      // Calculate statistics
      const allEntries = Object.entries(readings);
      const soilValues = allEntries.map(([, v]) =>
        parseFloat(v.soil_moisture || v.soilMoisture || v.moisture || 0)
      );
      const tempValues = allEntries.map(([, v]) =>
        parseFloat(v.temperature || v.temp || 0)
      );
      const humidityValues = allEntries.map(([, v]) =>
        parseFloat(v.humidity || v.humid || 0)
      );

      const stats = {
        soil: {
          avg: (
            soilValues.reduce((a, b) => a + b, 0) / soilValues.length
          ).toFixed(1),
          min: Math.min(...soilValues).toFixed(1),
          max: Math.max(...soilValues).toFixed(1),
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

      // Pie chart data
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
      const latestEntry =
        Object.entries(readings)[Object.entries(readings).length - 1];
      const latestValues = latestEntry[1];
      const latestSoil = parseFloat(
        latestValues.soil_moisture ||
          latestValues.soilMoisture ||
          latestValues.moisture ||
          0
      );
      const latestTemp = parseFloat(
        latestValues.temperature || latestValues.temp || 0
      );
      const latestHumidity = parseFloat(
        latestValues.humidity || latestValues.humid || 0
      );

      setRadarData([
        { metric: "Soil", current: latestSoil, optimal: 100 },
        { metric: "Temp", current: latestTemp * 20, optimal: 25 * 20 },
        { metric: "Humidity", current: latestHumidity, optimal: 70 },
      ]);
    } catch (err) {
      console.error("Error processing data:", err);
      setError("Error processing sensor data");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
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
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-6 backdrop-blur-xl border border-green-500/30">
            <BarChart3 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text">
              Advanced Analytics
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Deep insights into your irrigation system performance and
            environmental patterns
          </p>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full mb-4 animate-spin" />
            <p className="text-green-400 font-semibold text-lg">
              Loading Analytics...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-400 mb-2 text-center">
                Error Loading Data
              </h3>
              <p className="text-gray-400 text-center mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
                  <div
                    key={i}
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
                      <div className={`p-3 bg-${stat.color}-500/20 rounded-xl`}>
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
                  </div>
                ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area Chart */}
              <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20">
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
              </div>

              {/* Bar Chart */}
              <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Comparative View
                    </h3>
                    <p className="text-sm text-gray-400">Recent measurements</p>
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
                    <Bar dataKey="temp" fill="#f97316" radius={[8, 8, 0, 0]} />
                    <Bar
                      dataKey="humidity"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Second Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20">
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
              </div>

              {/* Radar Chart */}
              <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-green-500/20 lg:col-span-2">
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
              </div>
            </div>

            {/* Multi-Line Chart */}
            <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-green-500/20">
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
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
