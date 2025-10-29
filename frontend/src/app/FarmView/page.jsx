"use client";
import { useState, useEffect, useRef } from "react";
import {
  Sprout,
  Droplets,
  ThermometerSun,
  Wind,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import * as THREE from "three";

export default function FarmMonitor() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const plotRef = useRef(null);
  const waterPlaneRef = useRef(null);

  const [currentTemp, setCurrentTemp] = useState(25);
  const [currentMoisture, setCurrentMoisture] = useState(450);
  const [currentHumidity, setCurrentHumidity] = useState(60);
  const [deviceId, setDeviceId] = useState("ESP8266_DEVICE_ID_1");

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://smartirrigationsystem-8dba4-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_readings.json"
      );
      const data = await response.json();

      if (data) {
        setSensorData(data);
        setConnected(true);
        setLastUpdate(new Date());

        const deviceKey = Object.keys(data)[0];
        setDeviceId(deviceKey);
        const timestamps = Object.keys(data[deviceKey]);
        const latestTimestamp = timestamps[timestamps.length - 1];
        const latestReading = data[deviceKey][latestTimestamp];

        setCurrentTemp(latestReading.temperature);
        setCurrentMoisture(latestReading.soil_moisture);
        setCurrentHumidity(latestReading.humidity);
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
    const interval = setInterval(fetchSensorData, 600000);
    return () => clearInterval(interval);
  }, []);

  const getPlotColor = (temp, moisture) => {
    if (moisture > 500) {
      return 0x60a5fa; // Blue (watery)
    } else if (temp > 30) {
      return 0xef4444; // Red (hot)
    } else if (temp > 26) {
      return 0xf59e0b; // Orange (warm)
    } else {
      return 0x10b981; // Green (optimal)
    }
  };

  const getConditionText = () => {
    if (currentMoisture > 500) return "HIGH MOISTURE";
    if (currentTemp > 30) return "HOT CONDITIONS";
    if (currentTemp > 26) return "WARM CONDITIONS";
    return "OPTIMAL CONDITIONS";
  };

  const getConditionColor = () => {
    if (currentMoisture > 500) return "border-blue-400 text-blue-400";
    if (currentTemp > 30) return "border-red-500 text-red-500";
    if (currentTemp > 26) return "border-orange-500 text-orange-500";
    return "border-emerald-500 text-emerald-500";
  };

  const createPlot = () => {
    if (!sceneRef.current) return;

    // Remove old plot
    if (plotRef.current) {
      sceneRef.current.remove(plotRef.current);
    }
    if (waterPlaneRef.current) {
      sceneRef.current.remove(waterPlaneRef.current);
      waterPlaneRef.current = null;
    }

    const plotGeometry = new THREE.BoxGeometry(2, 0.3, 2);
    const color = getPlotColor(currentTemp, currentMoisture);

    const plotMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.4,
      emissive: color,
      emissiveIntensity: 0.3,
    });

    const plot = new THREE.Mesh(plotGeometry, plotMaterial);
    plot.position.set(0, 0, 0);
    plot.castShadow = true;
    plot.receiveShadow = true;
    plotRef.current = plot;
    sceneRef.current.add(plot);

    // Add water effect if moisture is high
    if (currentMoisture > 500) {
      const waterGeometry = new THREE.PlaneGeometry(1.9, 1.9);
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.4,
      });

      const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
      waterPlane.rotation.x = -Math.PI / 2;
      waterPlane.position.set(0, 0.16, 0);
      waterPlaneRef.current = waterPlane;
      sceneRef.current.add(waterPlane);
    }
  };

  useEffect(() => {
    if (sceneRef.current) {
      createPlot();
    }
  }, [currentTemp, currentMoisture, currentHumidity]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 5, 30);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 0.8, 30);
    pointLight1.position.set(-5, 5, -5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x34d399, 0.5, 30);
    pointLight2.position.set(5, 3, 5);
    scene.add(pointLight2);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x10b981, 0x1a1a1a);
    gridHelper.position.y = -0.49;
    scene.add(gridHelper);

    createPlot();

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - previousMousePosition.x) * 0.005;
        const deltaY = (e.clientY - previousMousePosition.y) * 0.005;

        const radius = Math.sqrt(
          camera.position.x ** 2 + camera.position.z ** 2
        );

        let angle = Math.atan2(camera.position.z, camera.position.x);
        angle -= deltaX;

        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);
        camera.position.y = Math.max(1, camera.position.y - deltaY);

        camera.lookAt(0, 0, 0);
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      const newRadius = Math.max(2, Math.min(8, radius + delta));
      const angle = Math.atan2(camera.position.z, camera.position.x);

      camera.position.x = newRadius * Math.cos(angle);
      camera.position.z = newRadius * Math.sin(angle);
      camera.lookAt(0, 0, 0);
    };

    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    canvasRef.current.addEventListener("mouseup", handleMouseUp);
    canvasRef.current.addEventListener("wheel", handleWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (plotRef.current) {
        plotRef.current.rotation.y += 0.005;
      }

      if (waterPlaneRef.current && waterPlaneRef.current.material) {
        waterPlaneRef.current.material.opacity =
          0.5 + Math.sin(Date.now() * 0.003) * 0.2;
        waterPlaneRef.current.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect =
        canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousedown", handleMouseDown);
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
        canvasRef.current.removeEventListener("mouseup", handleMouseUp);
        canvasRef.current.removeEventListener("wheel", handleWheel);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 flex overflow-hidden">
      {/* Animated background */}
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

      {/* Sidebar */}
      <div className="w-96 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-emerald-500/20 p-6 flex flex-col gap-6 z-10 overflow-y-auto">

        {/* Sensor Panel */}
        <div
          className={`backdrop-blur-xl rounded-2xl p-5 border transition-all duration-300 ${
            connected
              ? "bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/30"
              : "bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {connected ? (
                <Wifi className="w-5 h-5 text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span
                className={`text-base font-semibold ${
                  connected ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {connected ? "Sensor Online" : "Sensor Offline"}
              </span>
            </div>
            <button
              onClick={fetchSensorData}
              disabled={loading}
              className="p-2 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-all duration-300 disabled:opacity-50"
              title="Refresh sensor data"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-300 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {/* Data Cards */}
          <div className="space-y-4 mb-5">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-emerald-500/15 rounded-xl p-4 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                  <ThermometerSun className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Temperature
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {currentTemp.toFixed(1)}
                    <span className="text-lg text-gray-500 ml-1">°C</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((currentTemp / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-emerald-500/15 rounded-xl p-4 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Humidity
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {currentHumidity.toFixed(1)}
                    <span className="text-lg text-gray-500 ml-1">%</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentHumidity}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-emerald-500/15 rounded-xl p-4 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-lg flex items-center justify-center text-lg">
                  💦
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Soil Moisture
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {currentMoisture}
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((currentMoisture / 1000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center mb-4">
            Last updated:{" "}
            {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}
          </div>

          <button
            onClick={fetchSensorData}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching..." : "Fetch Now"}
          </button>
        </div>

        {/* Plot Info */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Plot Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Device ID</span>
              <span className="text-sm font-medium text-white">{deviceId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Crop Type</span>
              <span className="text-sm font-medium text-white">Wheat</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-sm text-gray-400">Growth Stage</span>
              <span className="text-sm font-medium text-emerald-400">
                Vegetative
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-400">Soil Health</span>
              <span className="text-sm font-medium text-emerald-400">
                Excellent
              </span>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              System Alert
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Monitor your sensors regularly for optimal crop health.
          </p>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-6 z-10">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-emerald-500/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-1">
            Live 3D Plot Visualization
          </h2>
          <p className="text-sm text-gray-400">
            Real-time sensor data visualization
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 relative">
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Condition Badge */}
          <div
            className={`absolute top-5 right-5 bg-gray-900/95 backdrop-blur-xl border-2 rounded-xl px-5 py-3 font-semibold text-base ${getConditionColor()}`}
          >
            {getConditionText()}
          </div>

          {/* Legend */}
          <div className="absolute bottom-5 left-5 bg-gray-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4">
            <div className="text-white font-semibold mb-3 text-sm">
              Field Conditions
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-blue-400 rounded"></div>
                <span className="text-gray-300">High Moisture (&gt;500)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-emerald-500 rounded"></div>
                <span className="text-gray-300">Optimal (≤26°C)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                <span className="text-gray-300">Warm (26-30°C)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span className="text-gray-300">Hot (&gt;30°C)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
