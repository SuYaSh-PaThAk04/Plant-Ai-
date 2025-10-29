import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { MotiView } from "moti";
import { Menu, Sprout } from "lucide-react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress: () => void;
}

export default function Header({ title, subtitle, onMenuPress }: HeaderProps) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <MotiView
        from={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(31, 41, 55, 0.95)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(16, 185, 129, 0.2)",
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* Logo */}
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
              <Sprout size={20} fill="#fff" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                AgriSense
              </Text>
              {subtitle && (
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* Menu Button */}
          <TouchableOpacity
            onPress={onMenuPress}
            style={{
              padding: 8,
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "rgba(16, 185, 129, 0.3)",
            }}
          >
            <Menu size={20} fill="#10b981" />
          </TouchableOpacity>
        </View>
      </MotiView>
    </>
  );
}
