"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Menu,
  X,
  Sprout,
  Home,
  LayoutDashboard,
  Eye,
  Zap,
  BarChart,
  Sprinkler,
  Droplet ,
  WalletIcon,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Soil Analytics", href: "/Soil", icon: BarChart },
    { name: "Farm View", href: "/FarmView", icon: Eye },
    { name: "Irrigation", href: "/Irrigation", icon: Droplet },
    { name: "Disease Detection", href: "/Disease-Detect", icon: Zap },
    { name: "Wallet", href: "/Wallet", icon: WalletIcon },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full top-0 z-50 px-4 md:px-8 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-emerald-950/95 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 px-6 md:px-8 py-4">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl blur-xl"></div>

            <div className="relative flex justify-between items-center">
              {/* Logo */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                      AgriSense
                    </h1>
                    <p className="text-[10px] text-gray-400 hidden md:block">
                      Smart Agriculture
                    </p>
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-2">
                {navLinks.map((link, index) => (
                  <Link key={link.name} href={link.href}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-lg transition-all duration-300"></div>
                      <div className="relative flex items-center gap-2">
                        <link.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-sm font-medium text-gray-300 group-hover:text-emerald-400 transition-colors">
                          {link.name}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-400 group-hover:w-3/4 transition-all duration-300"></div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* CTA Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
              >
                Get Started
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Menu className="w-6 h-6 text-emerald-400" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
         
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-emerald-950 border-l border-emerald-500/20 shadow-2xl z-50 lg:hidden"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
                      <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                      AgriSense
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                  >
                    <X className="w-5 h-5 text-emerald-400" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <Link key={link.name} href={link.href}>
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-emerald-500/10 hover:to-green-500/10 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-all">
                          <link.icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-gray-300 group-hover:text-emerald-400 font-medium transition-colors">
                          {link.name}
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                >
                  Get Started
                </motion.button>

                {/* Decorative element */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-500/20">
                  <p className="text-xs text-gray-400 text-center">
                    Revolutionizing agriculture with smart technology
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
