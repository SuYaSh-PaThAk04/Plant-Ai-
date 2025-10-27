"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  Sprout,
  Droplets,
  ThermometerSun,
  Wind,
  TrendingUp,
  Activity,
} from "lucide-react";

const Plot = ({ x, z, color, isSelected, onClick }) => {
  return (
    <mesh
      position={[x, 0.05, z]}
      castShadow
      receiveShadow
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[0.9, isSelected ? 0.2 : 0.1, 0.9]} />
      <meshStandardMaterial
        color={isSelected ? "#76ff03" : color}
        metalness={0.3}
        roughness={0.7}
        emissive={isSelected ? "#2e7d32" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
};

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-emerald-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      {trend && (
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default function FarmGrid() {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const gridSize = 10;
  const plots = [];

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const plotId = `${x}-${z}`;
      const health = Math.random();
      const color =
        health > 0.7 ? "#1b5e20" : health > 0.4 ? "#2e7d32" : "#558b2f";

      plots.push(
        <Plot
          key={plotId}
          x={x - gridSize / 2 + 0.5}
          z={z - gridSize / 2 + 0.5}
          color={color}
          isSelected={selectedPlot === plotId}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPlot(plotId);
          }}
        />
      );
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 flex overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-emerald-500/20 p-6 flex flex-col gap-6 z-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              AgriTech Pro
            </h1>
            <p className="text-xs text-gray-400">Smart Farm Management</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Sprout}
            label="Active Plots"
            value="100"
            trend="+5%"
          />
          <StatCard
            icon={Activity}
            label="Health Avg"
            value="87%"
            trend="+3%"
          />
          <StatCard icon={Droplets} label="Moisture" value="65%" />
          <StatCard icon={ThermometerSun} label="Temperature" value="24°C" />
        </div>

        {/* Plot Info */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            {selectedPlot ? `Plot ${selectedPlot}` : "Select a Plot"}
          </h3>

          {selectedPlot ? (
            <div className="space-y-3">
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
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-sm text-gray-400">Soil Health</span>
                <span className="text-sm font-medium text-emerald-400">
                  Excellent
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">Last Watered</span>
                <span className="text-sm font-medium text-white">
                  2 hours ago
                </span>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50">
                Manage Plot
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Click on any plot in the 3D view to see details
            </p>
          )}
        </div>

        {/* Environmental Alerts */}
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              Weather Alert
            </span>
          </div>
          <p className="text-xs text-gray-300">
            High winds expected tomorrow. Secure equipment.
          </p>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col p-6 z-10">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-emerald-500/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Farm Overview</h2>
              <p className="text-sm text-gray-400">
                Real-time 3D visualization of your plots
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all duration-300 border border-emerald-500/30 text-sm font-medium">
                Grid View
              </button>
              <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg transition-all duration-300 text-sm font-medium">
                List View
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
          <Canvas shadows onClick={() => setSelectedPlot(null)}>
            <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 15, 10]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
            />
            <pointLight
              position={[-10, 10, -10]}
              intensity={0.5}
              color="#10b981"
            />
            <pointLight
              position={[10, 5, 10]}
              intensity={0.3}
              color="#34d399"
            />

            <OrbitControls
              enableZoom={true}
              maxPolarAngle={Math.PI / 2.2}
              minDistance={8}
              maxDistance={25}
            />

            {/* Ground */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.01, 0]}
              receiveShadow
            >
              <planeGeometry args={[25, 25]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>

            {/* Border */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[11, 0.05, 11]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            {plots}
          </Canvas>
        </div>
      </div>
    </div>
  );
}