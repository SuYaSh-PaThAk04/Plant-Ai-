import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import {
  TrendingUp,
  Droplets,
  Shield,
  Zap,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Activity,
  RefreshCw,
  Thermometer,
  Wind,
  Power,
  Clock,
} from "lucide-react-native";
import { API_CONFIG } from "@/config/api";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [sensorData, setSensorData] = useState({
    soil_moisture: 450,
    temperature: 24.5,
    humidity: 65,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mode, setMode] = useState("AUTO");
  const [manualCommand, setManualCommand] = useState("OFF");
  const [lastWatered, setLastWatered] = useState<Date | null>(null);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.FIREBASE.SENSOR_READINGS}/sensor_readings.json`
      );
      const data = await response.json();

      if (data) {
        const deviceKey = Object.keys(data)[0];
        const timestamps = Object.keys(data[deviceKey]);
        const latestTimestamp = timestamps[timestamps.length - 1];
        const latestReading = data[deviceKey][latestTimestamp];

        setSensorData({
          soil_moisture: latestReading.soil_moisture || 450,
          temperature: latestReading.temperature || 24.5,
          humidity: latestReading.humidity || 65,
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);
  const quickActions = [
    {
      icon: Shield,
      title: "Disease Detection",
      desc: "Scan plant diseases",
      color: "#10b981",
      action: "disease-detection",
    },
    {
      icon: Droplets,
      title: "Irrigation Control",
      desc: "Manage water systems",
      color: "#3b82f6",
      action: "irrigation",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      desc: "View farm data",
      color: "#8b5cf6",
      action: "analytics",
    },
    {
      icon: Calendar,
      title: "Schedule",
      desc: "Farm activities",
      color: "#f59e0b",
      action: "schedule",
    },
  ];

  const recentActivities = [
    {
      icon: CheckCircle2,
      title: "Tomato Disease Detected",
      desc: "Early blight identified in section A",
      time: "2 hours ago",
      status: "success",
    },
    {
      icon: AlertCircle,
      title: "Irrigation Alert",
      desc: "Water level low in tank 3",
      time: "4 hours ago",
      status: "warning",
    },
    {
      icon: CheckCircle2,
      title: "Soil Analysis Complete",
      desc: "pH levels optimal for current crops",
      time: "1 day ago",
      status: "success",
    },
  ];

  const farmStats = [
    { label: "Total Crops", value: "24", unit: "plants" },
    { label: "Water Usage", value: "1,250", unit: "L" },
    { label: "Yield This Month", value: "85", unit: "kg" },
    { label: "Health Score", value: "92", unit: "%" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
      >
        {/* Header */}
        <View
          style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
        >
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#10b981",
                  marginBottom: 8,
                }}
              >
                Live Monitoring
              </Text>
              <Text style={{ fontSize: 16, color: "#9ca3af" }}>
                Real-time sensor data and intelligent irrigation control
              </Text>
            </View>
            <TouchableOpacity
              onPress={fetchSensorData}
              disabled={loading}
              style={{
                padding: 12,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.3)",
              }}
            >
              <RefreshCw
                size={20}
                color="#10b981"
                style={{ transform: [{ rotate: loading ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* Sensor Cards */}
        {loading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={{ color: "#9ca3af", marginTop: 16 }}>
              Loading sensor data...
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 200 }}
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
                {[
                  {
                    title: "Soil Moisture",
                    value: sensorData.soil_moisture,
                    unit: "",
                    icon: Droplets,
                    color: "#10b981",
                    bgColor: "rgba(16, 185, 129, 0.1)",
                  },
                  {
                    title: "Temperature",
                    value: sensorData.temperature,
                    unit: "°C",
                    icon: Thermometer,
                    color: "#f97316",
                    bgColor: "rgba(249, 115, 22, 0.1)",
                  },
                  {
                    title: "Humidity",
                    value: sensorData.humidity,
                    unit: "%",
                    icon: Wind,
                    color: "#3b82f6",
                    bgColor: "rgba(59, 130, 246, 0.1)",
                  },
                ].map((item, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "rgba(31, 41, 55, 0.8)",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 1,
                      borderColor: item.bgColor,
                      width: (width - 80) / 2,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <View
                        style={{
                          padding: 12,
                          backgroundColor: item.bgColor,
                          borderRadius: 12,
                          marginRight: 12,
                        }}
                      >
                        <item.icon size={24} color={item.color} />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          fontWeight: "600",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {item.value.toFixed(1)}
                      <Text style={{ fontSize: 16, color: "#9ca3af" }}>
                        {item.unit}
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
              {lastUpdate && (
                <Text
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Text>
              )}
            </MotiView>
          </View>
        )}

        {/* Control Section */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 400 }}
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(75, 85, 99, 0.5)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Power size={20} color="#10b981" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                  marginLeft: 12,
                }}
              >
                Control Mode
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setMode("AUTO")}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor:
                    mode === "AUTO" ? "#10b981" : "rgba(75, 85, 99, 0.3)",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>AUTO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("MANUAL")}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor:
                    mode === "MANUAL" ? "#3b82f6" : "rgba(75, 85, 99, 0.3)",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>MANUAL</Text>
              </TouchableOpacity>
            </View>
            {mode === "MANUAL" && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setManualCommand("ON")}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 12,
                    backgroundColor:
                      manualCommand === "ON"
                        ? "#ef4444"
                        : "rgba(75, 85, 99, 0.3)",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Power size={16} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Pump ON
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setManualCommand("OFF")}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 12,
                    backgroundColor:
                      manualCommand === "OFF"
                        ? "#10b981"
                        : "rgba(75, 85, 99, 0.3)",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Power size={16} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Pump OFF
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </MotiView>
        </View>

        {/* Irrigation Status */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 500 }}
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(59, 130, 246, 0.3)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Clock size={20} color="#3b82f6" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#fff",
                  marginLeft: 12,
                }}
              >
                Irrigation Status
              </Text>
            </View>
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}
                >
                  Last Watered
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  {lastWatered
                    ? lastWatered.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </Text>
              </View>
            </View>
          </MotiView>
        </View>

        {/* Farm Stats */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 200 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Farm Statistics
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {farmStats.map((stat, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    width: (width - 80) / 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#10b981",
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}
                  >
                    {stat.unit}
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#fff", fontWeight: "500" }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </MotiView>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 400 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Quick Actions
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    width: (width - 80) / 2,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: action.color,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 12,
                      shadowColor: action.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    <action.icon size={24} color="#fff" />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: 4,
                      textAlign: "center",
                    }}
                  >
                    {action.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      textAlign: "center",
                    }}
                  >
                    {action.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>
        </View>

        {/* Recent Activities */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 600 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Recent Activities
            </Text>
            <View style={{ gap: 12 }}>
              {recentActivities.map((activity, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor:
                        activity.status === "success"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <activity.icon
                      size={20}
                      color={
                        activity.status === "success" ? "#10b981" : "#f59e0b"
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {activity.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#9ca3af",
                        marginBottom: 4,
                      }}
                    >
                      {activity.desc}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </View>

        {/* Weather Widget */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 800 }}
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(75, 85, 99, 0.5)",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Weather Forecast
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#10b981",
                    marginBottom: 4,
                  }}
                >
                  24°C
                </Text>
                <Text style={{ fontSize: 16, color: "#9ca3af" }}>
                  Partly Cloudy
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 14, color: "#9ca3af", marginBottom: 4 }}
                >
                  Humidity
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  65%
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 14, color: "#9ca3af", marginBottom: 4 }}
                >
                  Rain Chance
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  20%
                </Text>
              </View>
            </View>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
