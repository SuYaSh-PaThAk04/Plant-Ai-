"use client";
import { motion } from "framer-motion";
import Navbar from "./component/Navber";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Droplets,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: "Disease Detection",
      desc: "AI-powered plant disease recognition via images for healthier crops and early intervention.",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      icon: Droplets,
      title: "Smart Irrigation",
      desc: "IoT sensors optimize water usage and soil health in real time for maximum efficiency.",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: TrendingUp,
      title: "Crop Recommendations",
      desc: "AI suggests the best crops based on soil & climate conditions for optimal yield.",
      gradient: "from-purple-500 to-pink-600",
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
    <main className="bg-gradient-to-b from-black via-gray-900 to-emerald-950 min-h-screen font-sans overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Animated background effects */}
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

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm">
              <span className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Next-Gen Agriculture Technology
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
              Smarter Farming,
            </span>
            <br />
            <span className="text-white">Greener Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            AI-powered crop disease detection and IoT-based smart farming tools
            to maximize yield and sustainability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/50 backdrop-blur-sm">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                <span className="text-emerald-400 text-sm font-semibold">
                  About AgriSense
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Revolutionizing Agriculture with AI
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                AgriSense is an intelligent platform designed for farmers to
                detect plant diseases, monitor soil conditions, and get
                AI-driven crop recommendations – all powered by IoT sensors and
                cutting-edge AI models.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold rounded-xl transition-all duration-300 border border-emerald-500/30 hover:border-emerald-500/50">
                Learn More
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-emerald-500/20 p-8 backdrop-blur-sm">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>

                <div className="relative space-y-6">
                  {[
                    {
                      icon: Users,
                      label: "10,000+ Farmers Trust Us",
                      color: "emerald",
                    },
                    {
                      icon: Award,
                      label: "Award-Winning Technology",
                      color: "green",
                    },
                    { icon: Zap, label: "Real-Time Monitoring", color: "blue" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50"
                    >
                      <div className={`p-3 bg-${item.color}-500/10 rounded-lg`}>
                        <item.icon
                          className={`w-6 h-6 text-${item.color}-400`}
                        />
                      </div>
                      <span className="text-white font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
            >
              <span className="text-emerald-400 text-sm font-semibold">
                Our Features
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Powerful Tools for Modern Farming
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
           {`   Everything you need to optimize your farm's productivity and
              sustainability`}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-emerald-500/50 p-8 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg shadow-emerald-500/20 mb-6`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {feature.desc}
                  </p>

                  <button className="text-emerald-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6"
            >
              <span className="text-emerald-400 text-sm font-semibold">
                Get In Touch
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
             {` Let's Work Together`}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg"
            >
             {` Have questions? We'd love to hear from you.`}
              {` Have questions? We'd love to hear from you.`}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 md:p-12"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Message
                </label>
                <textarea
                  placeholder="Tell us about your farming needs..."
                  rows={6}
                  className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </form>

            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-700/50">
              {[
                { icon: Mail, label: "Email", value: "support@agrisense.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "San Francisco, CA" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">
                      {item.label}
                    </div>
                    <div className="text-white text-sm font-medium">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                AgriSense
              </span>
            </div>

            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AgriSense. All rights reserved.
            </div>

            <div className="flex gap-4">
              {["Privacy", "Terms", "Contact"].map((item) => (
                <button
                  key={item}
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
