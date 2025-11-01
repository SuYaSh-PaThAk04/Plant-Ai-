import React, { useState } from "react";
import { View } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Home, LayoutDashboard, Eye, Zap, Wallet } from "lucide-react-native";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function TabLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("index");
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    if (screen === "index") {
      router.push("/(tabs)/" as any);
    } else {
      router.push(`/(tabs)/${screen}` as any);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="AgriSense"
        subtitle="Smart Agriculture"
        onMenuPress={() => setSidebarOpen(true)}
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgba(31, 41, 55, 0.95)",
            borderTopWidth: 1,
            borderTopColor: "rgba(16, 185, 129, 0.2)",
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#10b981",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={size} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="farm-view"
          options={{
            title: "Farm View",
            tabBarIcon: ({ color, size }) => <Eye size={size} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="disease-detection"
          options={{
            title: "Disease Detect",
            tabBarIcon: ({ color, size }) => <Zap size={size} fill={color} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, size }) => (
              <Wallet size={size} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
      />
    </View>
  );
}
