"use client";

import { useState } from "react";
import {
  Leaf,
  TrendingUp,
  Droplets,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function YieldPredictionPage() {
  const [form, setForm] = useState({
    area_name: "",
    crop: "",
    variety: "",
    soil_type: "",
    soil_ph: "",
    n_nutrient_kg_ha: "",
    p_nutrient_kg_ha: "",
    k_nutrient_kg_ha: "",
    planting_date: "",
    area_ha: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        "https://plant-ai-1sxv.onrender.com/api/yeild/predict-yield",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950 pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-6 backdrop-blur-xl border border-green-500/30">
            <Sparkles className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text">
              AI Yield Prediction
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get AI-powered crop yield forecasting and revenue intelligence for
            smarter farming decisions
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-br from-gray-900/80 via-green-950/30 to-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-green-500/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  [
                    "area_name",
                    "Area Name",
                    "City or Village",
                    <MapPin className="w-5 h-5" key="icon" />,
                    "text",
                  ],
                  [
                    "crop",
                    "Crop Name",
                    "e.g., Wheat, Rice",
                    <Leaf className="w-5 h-5" key="icon" />,
                    "text",
                  ],
                  [
                    "variety",
                    "Crop Variety",
                    "Optional",
                    <Leaf className="w-5 h-5" key="icon" />,
                    "text",
                  ],
                  [
                    "soil_type",
                    "Soil Type",
                    "loam, clay, sandy",
                    <Droplets className="w-5 h-5" key="icon" />,
                    "text",
                  ],
                  ["soil_ph", "Soil pH", "e.g., 6.5", null, "number"],
                  [
                    "n_nutrient_kg_ha",
                    "Nitrogen (kg/ha)",
                    "N content",
                    null,
                    "number",
                  ],
                  [
                    "p_nutrient_kg_ha",
                    "Phosphorus (kg/ha)",
                    "P content",
                    null,
                    "number",
                  ],
                  [
                    "k_nutrient_kg_ha",
                    "Potassium (kg/ha)",
                    "K content",
                    null,
                    "number",
                  ],
                  [
                    "planting_date",
                    "Planting Date",
                    "",
                    <Calendar className="w-5 h-5" key="icon" />,
                    "date",
                  ],
                  [
                    "area_ha",
                    "Area (hectares)",
                    "Total field area",
                    null,
                    "number",
                  ],
                ].map(([name, label, placeholder, icon, type]) => (
                  <div key={name}>
                    <label className=" text-gray-300 font-semibold mb-2 flex items-center gap-2">
                      {icon}
                      {label}
                    </label>
                    <input
                      type={type}
                      step="any"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full bg-gray-900/50 border border-green-500/30 rounded-xl p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-all duration-200 backdrop-blur-sm"
                      required={[
                        "area_name",
                        "crop",
                        "soil_type",
                        "planting_date",
                        "area_ha",
                      ].includes(name)}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: "🎯", text: "Accurate Predictions" },
                  { icon: "⚡", text: "Fast Analysis" },
                  { icon: "💡", text: "Smart Insights" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-green-500/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-300 text-sm font-medium">
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center font-medium backdrop-blur-sm flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="border-t border-green-500/20 bg-gradient-to-br from-gray-900/50 to-green-950/30 p-8 md:p-12">
              <div className="space-y-8">
                {/* Success Header */}
                <div className="flex items-center justify-center space-x-3 pb-6">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                    Analysis Complete
                  </h2>
                </div>

                {/* Predicted Yield - Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-400/30 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5 animate-pulse"></div>
                  <div className="relative z-10 text-center">
                    <div className="flex items-start justify-center space-x-4 mb-6">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-2">
                          Predicted Yield
                        </h3>
                        <div className="text-6xl font-black text-transparent bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text mb-2">
                          {result.predicted_yield_t_ha
                            ? `${result.predicted_yield_t_ha}`
                            : "N/A"}
                        </div>
                        <p className="text-green-200 text-2xl font-semibold">
                          tonnes/hectare
                        </p>
                      </div>
                    </div>

                    {/* Revenue Highlight */}
                    {result.estimated_revenue && (
                      <div className="mt-6 pt-6 border-t border-green-400/30">
                        <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-2">
                          Estimated Revenue
                        </h3>
                        <div className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text">
                          ₹{result.estimated_revenue.toLocaleString()}
                        </div>
                        <p className="text-green-200 text-lg mt-1">
                          Total Expected Income
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Factors */}
                  {result.factors && (
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-950/30 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wide mb-2">
                            Key Factors
                          </h3>
                        </div>
                      </div>
                      <div className="ml-16 space-y-3">
                        {result.factors.map((factor, i) => (
                          <div key={i} className="flex items-start space-x-3">
                            <div className="mt-1">
                              <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-gray-300 leading-relaxed text-sm">
                              {factor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations && (
                    <div className="bg-gradient-to-br from-emerald-900/20 to-green-950/30 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                          <Leaf className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-2">
                            AI Recommendations
                          </h3>
                        </div>
                      </div>
                      <div className="ml-16 space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start space-x-3">
                            <div className="mt-1">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-gray-300 leading-relaxed text-sm">
                              {rec}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Visualization Section */}
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center justify-center space-x-3 py-4">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                    <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                      Data Visualizations
                    </h3>
                  </div>

                  {/* Nutrient Analysis Chart */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                    <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center space-x-2">
                      <Droplets className="w-5 h-5" />
                      <span>Nutrient Analysis (kg/ha)</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Nitrogen",
                            value: parseFloat(form.n_nutrient_kg_ha) || 0,
                            optimal: 120,
                          },
                          {
                            name: "Phosphorus",
                            value: parseFloat(form.p_nutrient_kg_ha) || 0,
                            optimal: 60,
                          },
                          {
                            name: "Potassium",
                            value: parseFloat(form.k_nutrient_kg_ha) || 0,
                            optimal: 80,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #10b981",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#10b981" name="Applied" />
                        <Bar
                          dataKey="optimal"
                          fill="#3b82f6"
                          name="Optimal Range"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Yield Comparison Chart */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                      <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Yield Comparison</span>
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              category: "National Avg",
                              yield: form.crop.toLowerCase().includes("wheat")
                                ? 3.2
                                : form.crop.toLowerCase().includes("rice")
                                ? 4.0
                                : 3.5,
                            },
                            {
                              category: "Your Prediction",
                              yield: result.predicted_yield_t_ha || 0,
                            },
                            {
                              category: "Top 10%",
                              yield: form.crop.toLowerCase().includes("wheat")
                                ? 5.5
                                : form.crop.toLowerCase().includes("rice")
                                ? 6.5
                                : 5.8,
                            },
                          ]}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="category" stroke="#9ca3af" />
                          <YAxis
                            stroke="#9ca3af"
                            label={{
                              value: "t/ha",
                              angle: -90,
                              position: "insideLeft",
                              fill: "#9ca3af",
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #10b981",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="yield" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Revenue Breakdown Pie Chart */}
                    {result.estimated_revenue && (
                      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                        <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center space-x-2">
                          <PieChart className="w-5 h-5" />
                          <span>Cost vs Revenue</span>
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPie>
                            <Pie
                              data={[
                                {
                                  name: "Net Profit",
                                  value: result.estimated_revenue * 0.65,
                                },
                                {
                                  name: "Input Costs",
                                  value: result.estimated_revenue * 0.25,
                                },
                                {
                                  name: "Labor",
                                  value: result.estimated_revenue * 0.1,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f59e0b" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "1px solid #10b981",
                                borderRadius: "8px",
                              }}
                              formatter={(value) =>
                                `₹${value.toLocaleString()}`
                              }
                            />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Soil Health Radar Chart */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                    <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center space-x-2">
                      <Leaf className="w-5 h-5" />
                      <span>Soil Health Profile</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart
                        data={[
                          {
                            metric: "pH Level",
                            value: ((parseFloat(form.soil_ph) || 7) / 14) * 100,
                            optimal: 50,
                          },
                          {
                            metric: "Nitrogen",
                            value: Math.min(
                              ((parseFloat(form.n_nutrient_kg_ha) || 0) / 200) *
                                100,
                              100
                            ),
                            optimal: 60,
                          },
                          {
                            metric: "Phosphorus",
                            value: Math.min(
                              ((parseFloat(form.p_nutrient_kg_ha) || 0) / 100) *
                                100,
                              100
                            ),
                            optimal: 60,
                          },
                          {
                            metric: "Potassium",
                            value: Math.min(
                              ((parseFloat(form.k_nutrient_kg_ha) || 0) / 150) *
                                100,
                              100
                            ),
                            optimal: 53,
                          },
                          {
                            metric: "Area Health",
                            value: 75,
                            optimal: 75,
                          },
                        ]}
                      >
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                        <PolarRadiusAxis stroke="#9ca3af" />
                        <Radar
                          name="Current"
                          dataKey="value"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Optimal"
                          dataKey="optimal"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #10b981",
                            borderRadius: "8px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Production Timeline */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                    <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Expected Growth Timeline</span>
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { stage: "Week 1", growth: 5, yield: 0 },
                          { stage: "Week 4", growth: 25, yield: 0 },
                          { stage: "Week 8", growth: 60, yield: 10 },
                          { stage: "Week 12", growth: 85, yield: 50 },
                          {
                            stage: "Harvest",
                            growth: 100,
                            yield: result.predicted_yield_t_ha || 0,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="stage" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #10b981",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="growth"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="Growth %"
                        />
                        <Line
                          type="monotone"
                          dataKey="yield"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Yield Progress %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* New Analysis Button */}
                <button
                  onClick={() => {
                    setResult(null);
                    setForm({
                      area_name: "",
                      crop: "",
                      variety: "",
                      soil_type: "",
                      soil_ph: "",
                      n_nutrient_kg_ha: "",
                      p_nutrient_kg_ha: "",
                      k_nutrient_kg_ha: "",
                      planting_date: "",
                      area_ha: "",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600/50 transition-all duration-300"
                >
                  Analyze Another Field
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
