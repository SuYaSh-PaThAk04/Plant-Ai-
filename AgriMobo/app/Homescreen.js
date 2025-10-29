// /mobo/src/screens/HomeScreen.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import {
  Shield,
  Droplets,
  TrendingUp,
  Zap,
  Mail,
  Sprout,
} from "lucide-react-native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const features = [
    {
      icon: Shield,
      title: "Disease Detection",
      desc: "AI-powered plant disease recognition via images for healthier crops and early intervention.",
    },
    {
      icon: Droplets,
      title: "Smart Irrigation",
      desc: "IoT sensors optimize water usage and soil health in real time for maximum efficiency.",
    },
    {
      icon: TrendingUp,
      title: "Crop Recommendations",
      desc: "AI suggests the best crops based on soil & climate conditions for optimal yield.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Farmers" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "50+", label: "Crop Types" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <ScrollView className="bg-black flex-1 px-4 pt-12">
      {/* Hero Section */}
      <View className="items-center mt-10">
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 800 }}
          className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full mb-4"
        >
          <Text className="text-emerald-400 font-semibold">
            <Zap size={16} color="#34d399" /> Next-Gen Agriculture Technology
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <Text className="text-4xl font-bold text-white text-center">
            Smarter Farming,{"\n"}
            <Text className="text-emerald-400">Greener Future</Text>
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
        >
          <Text className="text-gray-400 text-center mt-4">
            AI-powered crop disease detection and IoT-based smart farming tools
            to maximize yield and sustainability.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          className="flex-row mt-8"
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            className="bg-emerald-600 px-6 py-3 rounded-xl mr-3"
          >
            <Text className="text-white font-semibold">Get Started →</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-emerald-500/40 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">Watch Demo</Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      {/* Stats */}
      <View className="grid grid-cols-2 gap-6 mt-12 flex-wrap flex-row justify-around">
        {stats.map((item, index) => (
          <View key={index} className="items-center mb-6">
            <Text className="text-3xl font-bold text-emerald-400">
              {item.number}
            </Text>
            <Text className="text-gray-400">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Features */}
      <View className="mt-12">
        <Text className="text-3xl font-bold text-white text-center mb-6">
          Powerful Tools for Modern Farming
        </Text>
        {features.map((f, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: i * 300 }}
            className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700 mb-4"
          >
            <f.icon size={32} color="#34d399" />
            <Text className="text-xl font-bold text-white mt-2">{f.title}</Text>
            <Text className="text-gray-400 mt-2">{f.desc}</Text>
          </MotiView>
        ))}
      </View>

      {/* Contact */}
      <View className="mt-16 mb-20">
        <Text className="text-3xl font-bold text-white text-center mb-6">
          Let’s Work Together
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          Have questions? We’d love to hear from you.
        </Text>

        <TouchableOpacity className="bg-emerald-600 p-4 rounded-xl flex-row justify-center items-center mx-10">
          <Mail size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Send Message</Text>
        </TouchableOpacity>

        <View className="items-center mt-10">
          <Sprout size={32} color="#34d399" />
          <Text className="text-gray-400 mt-2">
            © {new Date().getFullYear()} AgriSense. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
