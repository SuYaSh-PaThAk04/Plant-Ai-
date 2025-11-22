"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  MapPin,
  Calendar,
  Info,
  Sparkles,
  AlertCircle,
  BarChart3,
  DollarSign,
} from "lucide-react";

export default function PremiumMarketIntelligence() {
  const [marketPrices, setMarketPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [loadingBuyers, setLoadingBuyers] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    crop: "",
    quantity: "",
    price: "",
    negotiable: false,
    contact: "",
    location: "",
  });
  const [calcData, setCalcData] = useState({
    quantity: "",
    pricePerQuintal: "",
    selectedBuyer: null,
  });

  // Load buyers on mount
  React.useEffect(() => {
    loadBuyers();
  }, []);

// Load buyers from API
const loadBuyers = async () => {
  setLoadingBuyers(true);
  try {
    const response = await fetch(
      "https://plant-ai-1sxv.onrender.com/api/buyers"
    );
    const data = await response.json();
    
    if (data.success) {
      setBuyers(data.data);
    }
  } catch (error) {
    console.error('Error loading buyers:', error);
    setBuyers([]);
  } finally {
    setLoadingBuyers(false);
  }
  };
  const [showConfetti, setShowConfetti] = useState(false);


// Create buyer via API
const handleBuyerSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      "https://plant-ai-1sxv.onrender.com/api/buyers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyerForm),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      await loadBuyers();
      setShowBuyerModal(false);
      setBuyerForm({
        name: "",
        crop: "",
        quantity: "",
        price: "",
        negotiable: false,
        contact: "",
        location: ""
      });
      setShowConfetti(true);
       setTimeout(() => {
    setShowConfetti(false);
  }, 2000);

    } else {
      alert(data.message || 'Failed to register buyer');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to register buyer');
  }
};



  const calculateRevenue = () => {
    if (!calcData.quantity || !calcData.pricePerQuintal) return 0;
    return (
      parseFloat(calcData.quantity) * parseFloat(calcData.pricePerQuintal)
    ).toFixed(2);
  };

  const fetchMarketPrices = async () => {
    setLoadingPrices(true);
    try {
      const API_KEY =
        "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
      const API_URL = `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${API_KEY}&format=json&limit=100`;

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!data.records || data.records.length === 0) {
        throw new Error("No data available");
      }

      const commodityIcons = {
        Wheat: "🌾",
        Rice: "🌾",
        Paddy: "🌾",
        Bajra: "🌾",
        Barley: "🌾",
        Sugarcane: "🎋",
        Potato: "🥔",
        Tomato: "🍅",
        Onion: "🧅",
        Brinjal: "🍆",
        Cauliflower: "🥦",
        Cabbage: "🥬",
        Carrot: "🥕",
        Beans: "🫘",
        Peas: "🫛",
        Apple: "🍎",
        Banana: "🍌",
        Mango: "🥭",
        Orange: "🍊",
        Grapes: "🍇",
      };

      const processedData = data.records
        .filter((record) => record.State === "Uttar Pradesh")
        .reduce((acc, record) => {
          const existing = acc.find(
            (item) => item.commodity === record.Commodity
          );

          if (!existing) {
            const modalPrice = parseFloat(record.Modal_Price) || 0;
            const minPrice = parseFloat(record.Min_Price) || 0;
            const maxPrice = parseFloat(record.Max_Price) || 0;

            let trend = "stable";
            const priceRatio = modalPrice / ((minPrice + maxPrice) / 2);

            if (priceRatio > 1.05) trend = "up";
            else if (priceRatio < 0.95) trend = "down";

            const changePercent = Math.abs(
              ((modalPrice - minPrice) / minPrice) * 100
            );

            acc.push({
              commodity: record.Commodity,
              icon: commodityIcons[record.Commodity] || "🌱",
              modalPrice: Math.round(modalPrice),
              minPrice: Math.round(minPrice),
              maxPrice: Math.round(maxPrice),
              trend,
              changePercent: changePercent.toFixed(1),
              market: record.Market,
              lastUpdated: new Date(record.Arrival_Date).toLocaleDateString(
                "en-IN"
              ),
              advice:
                trend === "up"
                  ? "Good time to sell"
                  : trend === "down"
                  ? "Consider holding"
                  : "Stable market",
              demand:
                trend === "up" ? "High" : trend === "down" ? "Low" : "Moderate",
            });
          }

          return acc;
        }, [])
        .slice(0, 6);

      if (processedData.length === 0) {
        throw new Error("No matching market data found");
      }

      setMarketPrices({
        market: processedData[0]?.market || "Uttar Pradesh Mandi",
        date: new Date().toLocaleDateString("en-IN"),
        commodities: processedData,
      });
    } catch (err) {
      const demoMarketData = [
        {
          commodity: "Wheat",
          icon: "🌾",
          modalPrice: 2150,
          minPrice: 2050,
          maxPrice: 2250,
          trend: "up",
          changePercent: 2.5,
          market: "Roorkee,IN",
          lastUpdated: "Today",
          advice: "Prices rising - good time to sell",
          demand: "High",
        },
        {
          commodity: "Rice (Basmati)",
          icon: "🌾",
          modalPrice: 3800,
          minPrice: 3600,
          maxPrice: 4000,
          trend: "stable",
          changePercent: 0.5,
          market: "Majra,Dehradun",
          lastUpdated: "Today",
          advice: "Stable prices - moderate selling",
          demand: "Moderate",
        },
        {
          commodity: "Potato",
          icon: "🥔",
          modalPrice: 1500,
          minPrice: 1300,
          maxPrice: 2200,
          trend: "up",
          changePercent: 5.2,
          market: "Majra,Dehradun",
          lastUpdated: "Today",
          advice: "Strong demand - excellent selling time",
          demand: "Very High",
        },
      ];

      setMarketPrices({
        market: "Majra,Dehradun",
        date: new Date().toLocaleDateString("en-IN"),
        commodities: demoMarketData,
      });
    } finally {
      setLoadingPrices(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-xl px-4 py-2 rounded-full border border-emerald-500/30 mb-4 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-emerald-300 text-xs font-semibold tracking-wide">
                  CROP MARKETPLACE
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 animate-gradient">
                  Connect with Buyers
                </span>
                <br />
                <span className="text-white">Sell Smarter</span>
              </h1>

              <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                Browse verified buyers, compare offers, and maximize your
                profits
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCalculator(true)}
                className="px-6 py-3 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Revenue Calculator</span>
              </button>

              <button
                onClick={() => setShowBuyerModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Register as Buyer</span>
              </button>

              <button
                onClick={fetchMarketPrices}
                disabled={loadingPrices}
                className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 disabled:bg-gray-900/80 text-emerald-400 rounded-xl font-semibold border border-emerald-500/30 transition-all duration-300 flex items-center space-x-2 text-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingPrices ? "animate-spin" : ""}`}
                />
                <span>Market Prices</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Buyers Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Active Buyers
                </h2>
                <p className="text-gray-400">
                  Browse verified buyers looking for crops
                </p>
              </div>
              <div className="px-4 py-2 bg-emerald-600/20 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-semibold">
                  {buyers.length} Buyers
                </span>
              </div>
            </div>

            {loadingBuyers ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : buyers.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700/50">
                <p className="text-gray-400 mb-4">No buyers registered yet</p>
                <button
                  onClick={() => setShowBuyerModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold"
                >
                  Be the First Buyer
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buyers.map((buyer, i) => (
                  <div
                    key={i}
                    className="group bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-emerald-500/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {buyer.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {buyer.location || "Location not specified"}
                          </span>
                        </div>
                      </div>
                      {buyer.negotiable && (
                        <div className="px-3 py-1 bg-lime-600/20 rounded-lg border border-lime-500/30">
                          <span className="text-lime-400 text-xs font-semibold">
                            Negotiable
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600/10 to-green-600/10 rounded-xl p-4 mb-4 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">
                          Crop Required
                        </span>
                        <span className="text-2xl">🌾</span>
                      </div>
                      <p className="text-2xl font-bold text-white mb-3">
                        {buyer.crop}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Quantity</p>
                          <p className="text-sm font-semibold text-emerald-400">
                            {buyer.quantity} quintals
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Offering</p>
                          <p className="text-sm font-semibold text-green-400">
                            ₹{buyer.price}/quintal
                          </p>
                        </div>
                      </div>
                    </div>

                    {buyer.contact && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                        <AlertCircle className="w-4 h-4" />
                        <span>Contact: {buyer.contact}</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setCalcData({
                          quantity: buyer.quantity,
                          pricePerQuintal: buyer.price,
                          selectedBuyer: buyer,
                        });
                        setShowCalculator(true);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Calculate Revenue</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loadingPrices && (
            <div className="flex flex-col items-center space-y-6 py-12 mb-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-emerald-400 mb-2">
                  Fetching Market Prices...
                </p>
              </div>
            </div>
          )}

          {/* Market Data Display */}
          {marketPrices && !loadingPrices && (
            <div className="space-y-8 animate-fade-in mb-12">
              {/* Market Info Card */}
              <div className="bg-gradient-to-br from-gray-900/80 via-emerald-950/50 to-black/50 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Market Location
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {marketPrices.market}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-semibold text-white">
                          {marketPrices.date}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-emerald-600/20 rounded-xl border border-emerald-500/30">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-xs font-semibold">
                          LIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commodities Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketPrices.commodities.map((item, i) => (
                  <div
                    key={i}
                    className="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-emerald-500/50 overflow-hidden"
                  >
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <h4 className="text-white font-bold text-base">
                              {item.commodity}
                            </h4>
                            <p className="text-gray-500 text-xs">
                              {item.market}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-bold text-xs ${
                            item.trend === "up"
                              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                              : item.trend === "down"
                              ? "bg-red-600/20 text-red-400 border border-red-500/30"
                              : "bg-gray-600/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {item.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : item.trend === "down" ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>{item.changePercent}%</span>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="bg-gradient-to-br from-emerald-600/10 to-green-600/10 rounded-xl p-3 mb-3 border border-emerald-500/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs">
                            Modal Price
                          </span>
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                          ₹{item.modalPrice}
                          <span className="text-xs text-gray-500 font-normal">
                            /quintal
                          </span>
                        </p>

                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-700/50">
                          <div>
                            <p className="text-xs text-gray-500">Min</p>
                            <p className="text-sm font-semibold text-gray-300">
                              ₹{item.minPrice}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Max</p>
                            <p className="text-sm font-semibold text-gray-300">
                              ₹{item.maxPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="flex items-start space-x-2 bg-lime-600/10 border border-lime-500/20 rounded-lg p-2">
                        <AlertCircle className="w-3 h-3 text-lime-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-lime-300">{item.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showBuyerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-emerald-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                Register as Buyer
              </h2>
              <button
                onClick={() => setShowBuyerModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBuyerSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerForm.name}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerForm.contact}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, contact: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Your contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={buyerForm.location}
                  onChange={(e) =>
                    setBuyerForm({ ...buyerForm, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="City, State"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Crop Required *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerForm.crop}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, crop: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="e.g., Wheat, Rice"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Quantity (quintals) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={buyerForm.quantity}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, quantity: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Price per Quintal (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={buyerForm.price}
                  onChange={(e) =>
                    setBuyerForm({ ...buyerForm, price: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Enter price"
                />
              </div>

              <div className="flex items-center space-x-3 bg-lime-600/10 border border-lime-500/20 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={buyerForm.negotiable}
                  onChange={(e) =>
                    setBuyerForm({ ...buyerForm, negotiable: e.target.checked })
                  }
                  className="w-5 h-5 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="negotiable"
                  className="text-lime-300 font-semibold cursor-pointer"
                >
                  Price is negotiable
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBuyerModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  Register as Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revenue Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-emerald-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Revenue Calculator
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowCalculator(false);
                  setCalcData({
                    quantity: "",
                    pricePerQuintal: "",
                    selectedBuyer: null,
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {calcData.selectedBuyer && (
              <div className="mb-6 p-4 bg-emerald-600/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">
                  Calculating for buyer:
                </p>
                <p className="text-lg font-bold text-white">
                  {calcData.selectedBuyer.name}
                </p>
                <p className="text-sm text-emerald-400">
                  {calcData.selectedBuyer.crop} @ ₹
                  {calcData.selectedBuyer.price}/quintal
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Your Yield Quantity (quintals)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={calcData.quantity}
                  onChange={(e) =>
                    setCalcData({ ...calcData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Price per Quintal (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcData.pricePerQuintal}
                  onChange={(e) =>
                    setCalcData({
                      ...calcData,
                      pricePerQuintal: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                  placeholder="Enter price"
                />
              </div>

              <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Total Revenue</span>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                  ₹{calculateRevenue() || "0.00"}
                </p>
                {calcData.quantity && calcData.pricePerQuintal && (
                  <p className="text-sm text-gray-400 mt-2">
                    {calcData.quantity} quintals × ₹{calcData.pricePerQuintal}{" "}
                    per quintal
                  </p>
                )}
              </div>

              <div className="bg-lime-600/10 border border-lime-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-lime-300">
                    This calculation shows your gross revenue. Deduct
                    transportation, labor, and other costs for net profit.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCalculator(false);
                  setCalcData({
                    quantity: "",
                    pricePerQuintal: "",
                    selectedBuyer: null,
                  });
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                Done
              </button>
              {showConfetti && (
                <div className="confetti-container">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="confetti"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
