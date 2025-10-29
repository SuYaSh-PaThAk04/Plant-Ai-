import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { MotiView } from "moti";
import {
  Menu,
  X,
  Sprout,
  Home,
  LayoutDashboard,
  Eye,
  Zap,
  WalletIcon,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  onNavigate,
  currentScreen,
}: SidebarProps) {
  const navLinks = [
    { name: "Home", screen: "index", icon: Home },
    { name: "Dashboard", screen: "dashboard", icon: LayoutDashboard },
    { name: "Farm View", screen: "farm-view", icon: Eye },
    { name: "Disease Detection", screen: "disease-detection", icon: Zap },
    { name: "Wallet", screen: "wallet", icon: WalletIcon },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Dark Backdrop */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "timing", duration: 300 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 40,
        }}
        onTouchEnd={onClose}
      />

      {/* Sidebar Panel */}
      <MotiView
        from={{ left: -width * 0.8 }}
        animate={{ left: 0 }}
        exit={{ left: -width * 0.8 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: width * 0.8,
          backgroundColor: "rgba(31, 41, 55, 0.95)",
          borderRightWidth: 1,
          borderRightColor: "rgba(16, 185, 129, 0.2)",
          zIndex: 50,
          paddingTop: 60,
          paddingHorizontal: 24,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                padding: 8,
                backgroundColor: "#10b981",
                borderRadius: 12,
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Sprout size={24} fill="#fff" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                AgriSense
              </Text>
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                Smart Agriculture
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 8,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(16, 185, 129, 0.3)",
            }}
          >
            <X size={20} fill="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Navigation Links */}
        <View style={{ gap: 8 }}>
          {navLinks.map((link, index) => (
            <TouchableOpacity
              key={link.name}
              onPress={() => {
                onNavigate(link.screen);
                onClose();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                padding: 16,
                borderRadius: 12,
                backgroundColor:
                  currentScreen === link.screen
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(75, 85, 99, 0.2)",
                borderWidth: 1,
                borderColor:
                  currentScreen === link.screen
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(75, 85, 99, 0.3)",
              }}
            >
              <View
                style={{
                  padding: 8,
                  backgroundColor:
                    currentScreen === link.screen
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(75, 85, 99, 0.3)",
                  borderRadius: 8,
                }}
              >
                <link.icon
                  size={20}
                  fill={currentScreen === link.screen ? "#10b981" : "#9ca3af"}
                />
              </View>
              <Text
                style={{
                  color: currentScreen === link.screen ? "#10b981" : "#d1d5db",
                  fontSize: 16,
                  fontWeight: currentScreen === link.screen ? "600" : "500",
                }}
              >
                {link.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={{
            marginTop: 40,
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: "#10b981",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Decorative element */}
        <View
          style={{
            marginTop: 40,
            padding: 16,
            backgroundColor: "rgba(16, 185, 129, 0.05)",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(16, 185, 129, 0.1)",
          }}
        >
          <Text style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
            Revolutionizing agriculture with smart technology
          </Text>
        </View>
      </MotiView>
    </>
  );
}
