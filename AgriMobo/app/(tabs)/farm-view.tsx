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
  MapPin,
  Droplets,
  Thermometer,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import { API_CONFIG } from "@/config/api";

const { width } = Dimensions.get("window");

export default function FarmViewScreen() {
  const [selectedField, setSelectedField] = useState("field-1");
  const [sensorData, setSensorData] = useState({
    temperature: 25,
    humidity: 60,
    soil_moisture: 450,
  });
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.FIREBASE.SENSOR_READINGS}/sensor_readings.json`
      );
      const data = await response.json();

      if (data) {
        setConnected(true);
        const deviceKey = Object.keys(data)[0];
        const timestamps = Object.keys(data[deviceKey]);
        const latestTimestamp = timestamps[timestamps.length - 1];
        const latestReading = data[deviceKey][latestTimestamp];

        setSensorData({
          temperature: latestReading.temperature || 25,
          humidity: latestReading.humidity || 60,
          soil_moisture: latestReading.soil_moisture || 450,
        });
        setLastUpdate(new Date());
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const fields = [
    {
      id: "field-1",
      name: "North Field",
      crop: "Tomatoes",
      area: "2.5 acres",
      status: "healthy",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: "field-2",
      name: "South Field",
      crop: "Wheat",
      area: "3.2 acres",
      status: "warning",
      coordinates: { lat: 40.712, lng: -74.005 },
    },
    {
      id: "field-3",
      name: "East Field",
      crop: "Corn",
      area: "4.1 acres",
      status: "healthy",
      coordinates: { lat: 40.713, lng: -74.004 },
    },
  ];

  const sensors = [
    {
      id: "temp-1",
      name: "Temperature",
      value: `${sensorData.temperature.toFixed(1)}°C`,
      status: sensorData.temperature > 30 ? "warning" : "normal",
      icon: Thermometer,
      color: "#ef4444",
    },
    {
      id: "humidity-1",
      name: "Humidity",
      value: `${sensorData.humidity.toFixed(1)}%`,
      status: "normal",
      icon: Droplets,
      color: "#3b82f6",
    },
    {
      id: "moisture-1",
      name: "Soil Moisture",
      value: `${sensorData.soil_moisture}`,
      status: sensorData.soil_moisture < 400 ? "warning" : "normal",
      icon: Droplets,
      color: "#10b981",
    },
  ];

  const irrigationData = [
    {
      zone: "Zone A",
      status: "active",
      waterLevel: 85,
      nextWatering: "2h 30m",
    },
    { zone: "Zone B", status: "idle", waterLevel: 45, nextWatering: "4h 15m" },
    {
      zone: "Zone C",
      status: "active",
      waterLevel: 92,
      nextWatering: "1h 45m",
    },
    {
      zone: "Zone D",
      status: "maintenance",
      waterLevel: 0,
      nextWatering: "N/A",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Low water level in Zone B",
      time: "15 minutes ago",
      icon: AlertCircle,
    },
    {
      id: 2,
      type: "info",
      message: "Irrigation cycle completed in Zone A",
      time: "1 hour ago",
      icon: CheckCircle2,
    },
    {
      id: 3,
      type: "warning",
      message: "Temperature spike detected",
      time: "2 hours ago",
      icon: AlertCircle,
    },
  ];

  const currentField = fields.find((field) => field.id === selectedField);

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
            Farm View
          </Text>
          <Text style={{ fontSize: 16, color: "#9ca3af" }}>
            Monitor your fields and irrigation systems in real-time
          </Text>
        </MotiView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
      >
        {/* Connection Status */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
            style={{
              backgroundColor: connected
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: connected
                ? "rgba(16, 185, 129, 0.3)"
                : "rgba(239, 68, 68, 0.3)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {connected ? (
                <Wifi size={20} color="#10b981" />
              ) : (
                <WifiOff size={20} color="#ef4444" />
              )}
              <Text
                style={{
                  color: connected ? "#10b981" : "#ef4444",
                  fontWeight: "600",
                }}
              >
                {connected ? "Sensor Online" : "Sensor Offline"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={fetchSensorData}
              disabled={loading}
              style={{
                padding: 8,
                backgroundColor: "rgba(75, 85, 99, 0.3)",
                borderRadius: 8,
              }}
            >
              <RefreshCw
                size={16}
                color="#9ca3af"
                style={{
                  transform: [{ rotate: loading ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>
          </MotiView>
          {loading && (
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          )}
          {lastUpdate && (
            <Text
              style={{
                color: "#6b7280",
                fontSize: 12,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Field Selection */}
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
              Select Field
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                {fields.map((field, index) => (
                  <TouchableOpacity
                    key={field.id}
                    onPress={() => setSelectedField(field.id)}
                    style={{
                      backgroundColor:
                        selectedField === field.id
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(31, 41, 55, 0.8)",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: 1,
                      borderColor:
                        selectedField === field.id
                          ? "rgba(16, 185, 129, 0.5)"
                          : "rgba(75, 85, 99, 0.5)",
                      minWidth: 120,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <MapPin size={16} color="#10b981" />
                      <Text
                        style={{
                          color: "#fff",
                          marginLeft: 4,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {field.name}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 11,
                        marginBottom: 2,
                      }}
                    >
                      {field.crop}
                    </Text>
                    <Text style={{ color: "#9ca3af", fontSize: 11 }}>
                      {field.area}
                    </Text>
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          field.status === "healthy" ? "#10b981" : "#f59e0b",
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </MotiView>
        </View>

        {/* Current Field Info */}
        {currentField && (
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
                >
                  {currentField.name}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: 8,
                    }}
                  >
                    <RefreshCw size={16} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: 8,
                    }}
                  >
                    <Settings size={16} color="#10b981" />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text
                    style={{ color: "#9ca3af", fontSize: 14, marginBottom: 4 }}
                  >
                    Crop Type
                  </Text>
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    {currentField.crop}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ color: "#9ca3af", fontSize: 14, marginBottom: 4 }}
                  >
                    Area
                  </Text>
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    {currentField.area}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ color: "#9ca3af", fontSize: 14, marginBottom: 4 }}
                  >
                    Status
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          currentField.status === "healthy"
                            ? "#10b981"
                            : "#f59e0b",
                      }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {currentField.status}
                    </Text>
                  </View>
                </View>
              </View>
            </MotiView>
          </View>
        )}

        {/* Sensor Data */}
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
              Sensor Data
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {sensors.map((sensor, index) => (
                <View
                  key={sensor.id}
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
                      backgroundColor: sensor.color,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 12,
                      shadowColor: sensor.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    <sensor.icon size={24} color="#fff" />
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    {sensor.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      textAlign: "center",
                    }}
                  >
                    {sensor.name}
                  </Text>
                </View>
              ))}
            </View>
          </MotiView>
        </View>

        {/* Irrigation Status */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 800 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Irrigation Status
            </Text>
            <View style={{ gap: 12 }}>
              {irrigationData.map((zone, index) => (
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
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {zone.zone}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginBottom: 8,
                      }}
                    >
                      Water Level: {zone.waterLevel}%
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
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:
                            zone.status === "active"
                              ? "#10b981"
                              : zone.status === "idle"
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          textTransform: "capitalize",
                        }}
                      >
                        {zone.status}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#9ca3af",
                        marginBottom: 4,
                      }}
                    >
                      Next Watering
                    </Text>
                    <Text
                      style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
                    >
                      {zone.nextWatering}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </View>

        {/* Alerts */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 1000 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Recent Alerts
            </Text>
            <View style={{ gap: 12 }}>
              {alerts.map((alert, index) => (
                <View
                  key={alert.id}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor:
                      alert.type === "warning"
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(16, 185, 129, 0.3)",
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
                        alert.type === "warning"
                          ? "rgba(239, 68, 68, 0.1)"
                          : "rgba(16, 185, 129, 0.1)",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <alert.icon
                      size={20}
                      color={alert.type === "warning" ? "#ef4444" : "#10b981"}
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
                      {alert.message}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      {alert.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
