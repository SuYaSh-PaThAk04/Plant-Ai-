"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Droplet,
  AreaChart,
  Wallet,
  ShoppingCart,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Yield", href: "/Yeild", icon: AreaChart },
    { name: "Soil Analytics", href: "/Soil", icon: BarChart },
    { name: "Farm View", href: "/FarmView", icon: Eye },
    { name: "Irrigation", href: "/Irrigation", icon: Droplet },
    { name: "Disease Detection", href: "/Disease-Detect", icon: Zap },
    { name: "Wallet", href: "/Wallet", icon: Wallet },
    { name: "Market Prices", href: "/MarketPlace", icon: ShoppingCart },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full top-0 z-50 px-4 md:px-8 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-black/95 via-gray-900/95 to-emerald-950/95 backdrop-blur-2xl rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 px-6 md:px-8 py-4">
            {/* Enhanced Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-emerald-600/20 rounded-2xl blur-2xl opacity-50"></div>

            <div className="relative flex justify-between items-center">
              {/* Logo */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative p-2.5 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                    <Sprout className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                      AgriSense
                    </h1>
                    <p className="text-[10px] text-emerald-400/70 hidden md:block font-semibold tracking-wider">
                      SMART AGRICULTURE
                    </p>
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <Link key={link.name} href={link.href}>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative px-4 py-2.5 rounded-xl transition-all duration-300 ${
                          active
                            ? "bg-gradient-to-r from-emerald-600/30 to-green-600/30"
                            : ""
                        }`}
                      >
                        {/* Active background glow */}
                        {active && (
                          <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Hover background */}
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-xl transition-all duration-300"></div>

                        <div className="relative flex items-center gap-2">
                          <link.icon
                            className={`w-4 h-4 transition-all duration-300 ${
                              active
                                ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                : "text-gray-400 group-hover:text-emerald-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold transition-all duration-300 ${
                              active
                                ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                : "text-gray-300 group-hover:text-emerald-400"
                            }`}
                          >
                            {link.name}
                          </span>
                        </div>

                        {/* Bottom accent line */}
                        <div
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 ${
                            active
                              ? "w-3/4 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                              : "w-0 group-hover:w-3/4"
                          }`}
                        ></div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 border border-emerald-500/40 transition-all shadow-lg shadow-emerald-500/20"
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-black via-gray-900 to-emerald-950 border-l border-emerald-500/30 shadow-2xl shadow-emerald-500/20 z-50 lg:hidden overflow-y-auto"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

              <div className="relative p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative p-2 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      <Sprout className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <span className="text-lg font-black bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
                      AgriSense
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all"
                  >
                    <X className="w-5 h-5 text-emerald-400" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.href);
                    return (
                      <Link key={link.name} href={link.href}>
                        <motion.div
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setIsOpen(false)}
                          className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group cursor-pointer ${
                            active
                              ? "bg-gradient-to-r from-emerald-600/30 to-green-600/30 border border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                              : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-emerald-500/20 hover:to-green-500/20 border border-gray-700/50 hover:border-emerald-500/40"
                          }`}
                        >
                          {/* Active indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-gradient-to-b from-emerald-400 to-green-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"></div>
                          )}

                          <div
                            className={`p-2 rounded-lg transition-all ${
                              active
                                ? "bg-emerald-500/30 shadow-lg shadow-emerald-500/30"
                                : "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                            }`}
                          >
                            <link.icon
                              className={`w-5 h-5 transition-all ${
                                active
                                  ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                                  : "text-emerald-400 group-hover:scale-110"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-semibold transition-all ${
                              active
                                ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]"
                                : "text-gray-300 group-hover:text-emerald-400"
                            }`}
                          >
                            {link.name}
                          </span>

                          {/* Active dot */}
                          {active && (
                            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                          )}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile CTA */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative">Get Started</span>
                </motion.button>

                {/* Decorative element */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 backdrop-blur-sm">
                  <p className="text-xs text-emerald-400/80 text-center font-medium">
                    🌱 Revolutionizing agriculture with smart technology
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
