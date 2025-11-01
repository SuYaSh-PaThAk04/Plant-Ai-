import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import {
  Sprout,
  Droplets,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react-native";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const features = [
    {
      icon: Shield,
      title: "Disease Detection",
      desc: "AI-powered plant disease recognition via images for healthier crops and early intervention.",
      gradient: ["#10b981", "#059669"],
    },
    {
      icon: Droplets,
      title: "Smart Irrigation",
      desc: "IoT sensors optimize water usage and soil health in real time for maximum efficiency.",
      gradient: ["#3b82f6", "#0891b2"],
    },
    {
      icon: TrendingUp,
      title: "Crop Recommendations",
      desc: "AI suggests the best crops based on soil & climate conditions for optimal yield.",
      gradient: ["#8b5cf6", "#ec4899"],
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Farmers" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "50+", label: "Crop Types" },
    { number: "24/7", label: "Support" },
  ];

  const benefits = [
    "Increase crop yield by up to 40%",
    "Reduce water usage by 30%",
    "Early disease detection",
    "Real-time monitoring",
    "Expert recommendations",
    "Cost-effective solutions",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
      >
        {/* Hero Section */}
        <View
          style={{
            minHeight: height,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingTop: 20,
          }}
        >
          {/* Animated background effects */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 2000, loop: true }}
              style={{
                position: "absolute",
                top: 80,
                left: width * 0.25,
                width: 200,
                height: 200,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderRadius: 100,
                opacity: 0.3,
              }}
            />
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "timing",
                duration: 2000,
                delay: 1000,
                loop: true,
              }}
              style={{
                position: "absolute",
                bottom: 80,
                right: width * 0.25,
                width: 200,
                height: 200,
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderRadius: 100,
                opacity: 0.3,
              }}
            />
          </View>

          <View style={{ alignItems: "center", zIndex: 10 }}>
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800 }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.3)",
                borderRadius: 20,
                marginBottom: 24,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Zap size={16} fill="#10b981" />
                <Text
                  style={{ color: "#10b981", fontSize: 14, fontWeight: "600" }}
                >
                  Next-Gen Agriculture Technology
                </Text>
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800, delay: 200 }}
              style={{ alignItems: "center", marginBottom: 24 }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#10b981" }}>Smarter Farming,</Text>
                {"\n"}
                <Text style={{ color: "#fff" }}>Greener Future</Text>
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800, delay: 400 }}
              style={{ marginBottom: 48 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#9ca3af",
                  textAlign: "center",
                  lineHeight: 28,
                  maxWidth: width * 0.8,
                }}
              >
                AI-powered crop disease detection and IoT-based smart farming
                tools to maximize yield and sustainability.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800, delay: 600 }}
              style={{ flexDirection: "row", gap: 16, marginBottom: 80 }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  backgroundColor: "#10b981",
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  Get Started
                </Text>
                <ArrowRight size={20} fill="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  Watch Demo
                </Text>
              </TouchableOpacity>
            </MotiView>

            {/* Stats */}
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800, delay: 800 }}
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 32,
                maxWidth: width * 0.9,
              }}
            >
              {stats.map((stat, i) => (
                <View key={i} style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "bold",
                      color: "#10b981",
                      marginBottom: 4,
                    }}
                  >
                    {stat.number}
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </MotiView>
          </View>
        </View>

        {/* About Section */}
        <View style={{ paddingVertical: 128, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: "row", gap: 64, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(16, 185, 129, 0.3)",
                  borderRadius: 20,
                  alignSelf: "flex-start",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{ color: "#10b981", fontSize: 14, fontWeight: "600" }}
                >
                  About AgriSense
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 24,
                }}
              >
                Revolutionizing Agriculture with AI
              </Text>
              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: 16,
                  lineHeight: 24,
                  marginBottom: 32,
                }}
              >
                AgriSense is an intelligent platform designed for farmers to
                detect plant diseases, monitor soil conditions, and get
                AI-driven crop recommendations – all powered by IoT sensors and
                cutting-edge AI models.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {benefits.map((benefit, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      width: "48%",
                    }}
                  >
                    <CheckCircle2 size={20} fill="#10b981" />
                    <Text style={{ color: "#d1d5db", fontSize: 12, flex: 1 }}>
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(16, 185, 129, 0.3)",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{ color: "#10b981", fontSize: 16, fontWeight: "600" }}
                >
                  Learn More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={{ paddingVertical: 128, paddingHorizontal: 24 }}>
          <View style={{ alignItems: "center", marginBottom: 80 }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.3)",
                borderRadius: 20,
                marginBottom: 24,
              }}
            >
              <Text
                style={{ color: "#10b981", fontSize: 14, fontWeight: "600" }}
              >
                Our Features
              </Text>
            </View>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Powerful Tools for Modern Farming
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 16,
                textAlign: "center",
                maxWidth: width * 0.8,
              }}
            >
              {` Everything you need to optimize your farm's productivity and
              sustainability`}
            </Text>
          </View>

          <View style={{ gap: 32 }}>
            {features.map((feature, i) => (
              <MotiView
                key={i}
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 800, delay: i * 200 }}
                style={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderRadius: 24,
                  padding: 32,
                  borderWidth: 1,
                  borderColor: "rgba(75, 85, 99, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: feature.gradient[0],
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 24,
                    shadowColor: feature.gradient[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <feature.icon size={32} fill="#fff" />
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  {feature.title}
                </Text>

                <Text
                  style={{
                    color: "#9ca3af",
                    lineHeight: 24,
                    marginBottom: 24,
                  }}
                >
                  {feature.desc}
                </Text>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#10b981",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Learn More
                  </Text>
                  <ArrowRight size={16} fill="#10b981" />
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={{ paddingVertical: 128, paddingHorizontal: 24 }}>
          <View style={{ alignItems: "center", marginBottom: 64 }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.3)",
                borderRadius: 20,
                marginBottom: 24,
              }}
            >
              <Text
                style={{ color: "#10b981", fontSize: 14, fontWeight: "600" }}
              >
                Get In Touch
              </Text>
            </View>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {`Let's Work Together`}
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 16 }}>
              {`Have questions? We'd love to hear from you.`}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 24,
              padding: 32,
              borderWidth: 1,
              borderColor: "rgba(16, 185, 129, 0.2)",
            }}
          >
            <View style={{ gap: 24 }}>
              <View style={{ flexDirection: "row", gap: 24 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#d1d5db",
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    Your Name
                  </Text>
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: "rgba(17, 24, 39, 0.5)",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(75, 85, 99, 0.5)",
                    }}
                  >
                    <Text style={{ color: "#9ca3af" }}>John Doe</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#d1d5db",
                      marginBottom: 8,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    Your Email
                  </Text>
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: "rgba(17, 24, 39, 0.5)",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(75, 85, 99, 0.5)",
                    }}
                  >
                    <Text style={{ color: "#9ca3af" }}>john@example.com</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    color: "#d1d5db",
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Message
                </Text>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: "rgba(17, 24, 39, 0.5)",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    minHeight: 120,
                  }}
                >
                  <Text style={{ color: "#9ca3af" }}>
                    Tell us about your farming needs...
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  paddingHorizontal: 32,
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
                <Mail size={20} fill="#fff" />
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 24,
                marginTop: 48,
                paddingTop: 48,
                borderTopWidth: 1,
                borderTopColor: "rgba(75, 85, 99, 0.5)",
              }}
            >
              {[
                { icon: Mail, label: "Email", value: "support@agrisense.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "San Francisco, CA" },
              ].map((item, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      padding: 8,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: 8,
                    }}
                  >
                    <item.icon size={20} fill="#10b981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}
                    >
                      {item.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#1f2937",
            paddingVertical: 48,
            paddingHorizontal: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#10b981",
              }}
            >
              AgriSense
            </Text>
          </View>

          <Text style={{ color: "#9ca3af", fontSize: 14 }}>
            © {new Date().getFullYear()} AgriSense. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
