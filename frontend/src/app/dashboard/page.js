"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../component/Navber";

export default function Dashboard() {
  const [sensors, setSensors] = useState({
    soilMoisture: 45,
    temperature: 27,
    humidity: 60,
  });

  const [analysis, setAnalysis] = useState(null);
  const [soilInfo, setSoilInfo] = useState(null);
  const [loadingSoil, setLoadingSoil] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [location, setLocation] = useState(null);
  const [cropRecommendations, setCropRecommendations] = useState(null);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [marketPrices, setMarketPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [fertilizerPlan, setFertilizerPlan] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [calculatorType, setCalculatorType] = useState("");
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [rotationPlan, setRotationPlan] = useState(null);
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [farmAnalytics, setFarmAnalytics] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors({
        soilMoisture: Math.floor(Math.random() * 60) + 20,
        temperature: Math.floor(Math.random() * 10) + 25,
        humidity: Math.floor(Math.random() * 40) + 40,
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkWeatherAlerts = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`
      );

      if (!weatherRes.ok) throw new Error("Weather API error");
      const data = await weatherRes.json();

      const alerts = [];
      const current = data.current;
      const hourly = data.hourly;
      const daily = data.daily;

      // Heavy rain alert (next 6 hours)
      const next6HoursRain = hourly.precipitation_probability.slice(0, 6);
      const highRainProbability = next6HoursRain.some((prob) => prob > 70);
      if (highRainProbability) {
        alerts.push({
          type: "warning",
          icon: "🌧️",
          title: "Heavy Rain Alert",
          message:
            "High probability of rain in next 6 hours. Postpone spraying and consider harvesting if crops are ready.",
          priority: "high",
          action: "Harvest ready crops, avoid field work",
        });
      }

      // Heatwave alert
      const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 3));
      if (maxTemp > 40) {
        alerts.push({
          type: "danger",
          icon: "🔥",
          title: "Heatwave Warning",
          message: `Extreme heat expected (${maxTemp.toFixed(
            0
          )}°C). Irrigate crops in evening only. Provide shade for sensitive plants.`,
          priority: "high",
          action: "Evening irrigation, mulching recommended",
        });
      }

      // Cold wave alert
      const minTemp = Math.min(...daily.temperature_2m_min.slice(0, 3));
      if (minTemp < 5) {
        alerts.push({
          type: "warning",
          icon: "❄️",
          title: "Frost Warning",
          message: `Temperature may drop to ${minTemp.toFixed(
            0
          )}°C. Cover sensitive crops and young plants.`,
          priority: "high",
          action: "Cover crops, protect seedlings",
        });
      }

      // Perfect spraying weather
      const windSpeed = current.wind_speed_10m;
      const temp = current.temperature_2m;
      if (
        windSpeed < 10 &&
        temp > 15 &&
        temp < 30 &&
        current.precipitation === 0
      ) {
        alerts.push({
          type: "success",
          icon: "✅",
          title: "Perfect Spraying Weather",
          message:
            "Ideal conditions for pesticide/fungicide application. Low wind, moderate temperature, no rain.",
          priority: "medium",
          action: "Good time for crop protection sprays",
        });
      }

      // Dry spell alert
      const totalRain = daily.precipitation_sum.reduce((a, b) => a + b, 0);
      if (totalRain < 5 && sensors.soilMoisture < 30) {
        alerts.push({
          type: "info",
          icon: "💧",
          title: "Irrigation Needed",
          message:
            "No significant rain expected for 3 days. Soil moisture is low. Plan irrigation schedule.",
          priority: "medium",
          action: "Schedule irrigation for critical crops",
        });
      }

      // Strong wind alert
      const maxWind = Math.max(...hourly.wind_speed_10m.slice(0, 24));
      if (maxWind > 30) {
        alerts.push({
          type: "warning",
          icon: "💨",
          title: "Strong Wind Alert",
          message: `Wind speeds up to ${maxWind.toFixed(
            0
          )} km/h expected. Secure structures and avoid tall crop work.`,
          priority: "medium",
          action: "Secure equipment, avoid spraying",
        });
      }

      setWeatherAlerts(
        alerts.length > 0
          ? alerts
          : [
              {
                type: "success",
                icon: "🌤️",
                title: "All Clear",
                message:
                  "No weather warnings. Normal farming operations can continue.",
                priority: "low",
                action: "Continue regular activities",
              },
            ]
      );
    } catch (err) {
      console.error("Weather alerts failed:", err);
      setWeatherAlerts([
        {
          type: "info",
          icon: "📡",
          title: "Weather Check Unavailable",
          message: "Unable to fetch weather data. Please try again later.",
          priority: "low",
          action: "Check manually",
        },
      ]);
    }
  };
  const getRandomFallback = () => {
    return fallbackAnalysisOptions[
      Math.floor(Math.random() * fallbackAnalysisOptions.length)
    ];
  };

  const fetchSoilInfo = async () => {
    setLoadingSoil(true);
    try {
      const res = await fetch("https://plant-ai-1sxv.onrender.com//api/soil/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensors),
      });

      if (!res.ok) throw new Error("Soil API error");
      const data = await res.json();

      if (!data || Object.keys(data).length === 0 || !data.soilData) {
        throw new Error("Empty soil API data");
      }

      setSoilInfo(data);
    } catch (err) {
      console.error("Soil analysis failed:", err);

      setSoilInfo({
        soilData: {
          soilMoisture: 40,
          temperature: 28,
          humidity: 60,
        },
        recommendations: [
          "Maintain soil moisture between 35–45%.",
          "Use organic mulch to reduce evaporation.",
          "Ideal crops: Tomato, Chilli, or Brinjal.",
          "Add compost or manure every 2 weeks.",
        ],
      });
    } finally {
      setLoadingSoil(false);
    }
  };

  const fetchWeatherAndIrrigation = async () => {
    setLoadingWeather(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lon: longitude });

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=3`
      );

      if (!weatherRes.ok) throw new Error("Weather API error");
      const weatherJson = await weatherRes.json();

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const geoJson = await geoRes.json();

      const today = weatherJson.daily.precipitation_sum[0];
      const tomorrow = weatherJson.daily.precipitation_sum[1];
      const dayAfter = weatherJson.daily.precipitation_sum[2];

      const tomorrowProb = weatherJson.daily.precipitation_probability_max[1];
      const dayAfterProb = weatherJson.daily.precipitation_probability_max[2];

      let irrigationAdvice = "";
      let needsIrrigation = true;

      if (tomorrow > 5 || tomorrowProb > 60) {
        irrigationAdvice =
          "Rain expected tomorrow! No irrigation needed today.";
        needsIrrigation = false;
      } else if (tomorrow > 2 || tomorrowProb > 40) {
        irrigationAdvice =
          "Light rain possible tomorrow. Monitor and irrigate lightly if needed.";
        needsIrrigation = false;
      } else if (dayAfter > 5 || dayAfterProb > 60) {
        irrigationAdvice =
          "Rain expected in 2 days. Light irrigation recommended today.";
        needsIrrigation = true;
      } else {
        irrigationAdvice =
          "No rain expected for 2-3 days. Irrigation strongly recommended!";
        needsIrrigation = true;
      }

      setWeatherData({
        location:
          geoJson.address.city ||
          geoJson.address.town ||
          geoJson.address.village ||
          "Your Location",
        today: {
          precipitation: today,
        },
        tomorrow: {
          precipitation: tomorrow,
          probability: tomorrowProb,
        },
        dayAfter: {
          precipitation: dayAfter,
          probability: dayAfterProb,
        },
        irrigation: {
          needed: needsIrrigation,
          advice: irrigationAdvice,
        },
      });
    } catch (err) {
      console.error("Weather fetch failed:", err);

      setWeatherData({
        location: "Demo Location",
        today: {
          precipitation: 0,
        },
        tomorrow: {
          precipitation: 8.5,
          probability: 75,
        },
        dayAfter: {
          precipitation: 2.3,
          probability: 45,
        },
        irrigation: {
          needed: false,
          advice: "Rain expected tomorrow! No irrigation needed today.",
        },
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchCropRecommendations = async () => {
    setLoadingCrops(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const soilRes = await fetch(
        `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}&property=phh2o&property=soc&property=clay&property=sand&depth=0-5cm&value=mean`
      );

      let soilData = null;
      if (soilRes.ok) {
        const soilJson = await soilRes.json();
        soilData = {
          ph: soilJson.properties.layers[0].depths[0].values.mean / 10, // Convert from pH*10
          organicCarbon:
            soilJson.properties.layers[1].depths[0].values.mean / 10, // g/kg to %
          clay: soilJson.properties.layers[2].depths[0].values.mean / 10, // g/kg to %
          sand: soilJson.properties.layers[3].depths[0].values.mean / 10, // g/kg to %
        };
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&past_days=7&forecast_days=7`
      );

      let climateData = null;
      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        const avgTemp = (
          weatherJson.daily.temperature_2m_max.reduce((a, b) => a + b, 0) /
          weatherJson.daily.temperature_2m_max.length
        ).toFixed(1);
        const totalRainfall = weatherJson.daily.precipitation_sum
          .reduce((a, b) => a + b, 0)
          .toFixed(1);
        climateData = {
          avgTemp: parseFloat(avgTemp),
          currentTemp: weatherJson.current.temperature_2m,
          totalRainfall: parseFloat(totalRainfall),
        };
      }

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const geoJson = await geoRes.json();
      const locationName =
        geoJson.address.city ||
        geoJson.address.town ||
        geoJson.address.village ||
        "Your Location";


      const crops = recommendCrops(soilData, climateData);

      setCropRecommendations({
        location: locationName,
        soil: soilData || {
          ph: 6.8,
          organicCarbon: 1.2,
          clay: 25,
          sand: 45,
        },
        climate: climateData || {
          avgTemp: 25,
          currentTemp: 27,
          totalRainfall: 45,
        },
        recommendedCrops: crops,
      });
    } catch (err) {
      console.error("Crop recommendation failed:", err);

      // Fallback demo data
      setCropRecommendations({
        location: "Demo Location",
        soil: {
          ph: 6.8,
          organicCarbon: 1.2,
          clay: 25,
          sand: 45,
        },
        climate: {
          avgTemp: 25,
          currentTemp: 27,
          totalRainfall: 45,
        },
        recommendedCrops: [
          {
            name: "Wheat",
            suitability: "Excellent",
            icon: "🌾",
            reason:
              "Cool season crop, tolerates slightly alkaline soil, matches current climate perfectly",
            requirements: "Sow in October-November, requires 4-5 irrigations",
          },
          {
            name: "Rice",
            suitability: "Good",
            icon: "🌾",
            reason:
              "Warm season crop, requires consistent moisture, suitable for clay-rich soils",
            requirements: "Needs flooded conditions, transplant in June-July",
          },
          {
            name: "Sugarcane",
            suitability: "Good",
            icon: "🎋",
            reason:
              "Thrives in warm climate, high water requirement matches rainfall pattern",
            requirements:
              "Plant in February-March, requires heavy fertilization",
          },
          {
            name: "Tomato",
            suitability: "Moderate",
            icon: "🍅",
            reason:
              "Versatile crop, prefers slightly acidic soil but adaptable",
            requirements:
              "Grow in winter season, needs staking and regular watering",
          },
          {
            name: "Potato",
            suitability: "Moderate",
            icon: "🥔",
            reason: "Cool season crop, prefers well-drained sandy loam soil",
            requirements: "Plant in October-November, earth up regularly",
          },
        ],
      });
    } finally {
      setLoadingCrops(false);
    }
  };

  const recommendCrops = (soil, climate) => {
    const crops = [];

    if (!soil || !climate) {
      return [
        {
          name: "Wheat",
          suitability: "Excellent",
          icon: "🌾",
          reason: "Cool season crop, widely adaptable to various conditions",
          requirements: "Sow in October-November, requires 4-5 irrigations",
        },
        {
          name: "Rice",
          suitability: "Good",
          icon: "🌾",
          reason: "Warm season crop, suitable for areas with adequate water",
          requirements: "Needs flooded conditions, transplant in June-July",
        },
      ];
    }

    // Temperature ranges
    const isCool = climate.avgTemp < 20;
    const isWarm = climate.avgTemp >= 20 && climate.avgTemp < 30;
    const isHot = climate.avgTemp >= 30;

    // Rainfall assessment
    const isLowRainfall = climate.totalRainfall < 30;
    const isModerateRainfall =
      climate.totalRainfall >= 30 && climate.totalRainfall < 80;
    const isHighRainfall = climate.totalRainfall >= 80;

    // pH assessment
    const isAcidic = soil.ph < 6.5;
    const isNeutral = soil.ph >= 6.5 && soil.ph <= 7.5;
    const isAlkaline = soil.ph > 7.5;

    // Soil texture
    const isSandy = soil.sand > 60;
    const isLoamy =
      soil.sand >= 40 && soil.sand <= 60 && soil.clay >= 15 && soil.clay <= 35;
    const isClaySoil = soil.clay > 35;

    // Wheat
    if (isCool || isWarm) {
      crops.push({
        name: "Wheat",
        suitability: isNeutral || isAlkaline ? "Excellent" : "Good",
        icon: "🌾",
        reason: `Cool season crop, pH ${soil.ph.toFixed(1)} is ${
          isNeutral || isAlkaline ? "ideal" : "acceptable"
        }, current climate suitable`,
        requirements: "Sow in October-November, requires 4-5 irrigations",
      });
    }

    // Rice
    if ((isWarm || isHot) && (isModerateRainfall || isHighRainfall)) {
      crops.push({
        name: "Rice",
        suitability: isClaySoil ? "Excellent" : "Good",
        icon: "🌾",
        reason: `Warm climate (${climate.avgTemp}°C) and ${
          climate.totalRainfall
        }mm rainfall suitable, ${
          isClaySoil
            ? "clay soil ideal for water retention"
            : "adequate soil type"
        }`,
        requirements: "Needs flooded conditions, transplant in June-July",
      });
    }

    // Sugarcane
    if (isHot || isWarm) {
      crops.push({
        name: "Sugarcane",
        suitability:
          isHighRainfall || isModerateRainfall ? "Excellent" : "Moderate",
        icon: "🎋",
        reason: `Thrives in warm climate (${climate.avgTemp}°C), ${
          climate.totalRainfall
        }mm rainfall ${isHighRainfall ? "excellent" : "adequate"}`,
        requirements: "Plant in February-March, requires heavy fertilization",
      });
    }

    // Cotton
    if (isHot && !isAcidic) {
      crops.push({
        name: "Cotton",
        suitability: isLoamy ? "Excellent" : "Good",
        icon: "🌸",
        reason: `Hot climate (${climate.avgTemp}°C) ideal, pH ${soil.ph.toFixed(
          1
        )} suitable, ${isLoamy ? "loamy soil perfect" : "soil acceptable"}`,
        requirements: "Sow in April-May, needs deep ploughing",
      });
    }

    // Tomato
    if (isWarm || isCool) {
      crops.push({
        name: "Tomato",
        suitability: isNeutral || isAcidic ? "Good" : "Moderate",
        icon: "🍅",
        reason: `Versatile crop, pH ${soil.ph.toFixed(1)} ${
          isAcidic ? "ideal" : "acceptable"
        }, climate suitable`,
        requirements:
          "Grow in winter season, needs staking and drip irrigation",
      });
    }

    // Potato
    if (isCool || isWarm) {
      crops.push({
        name: "Potato",
        suitability: isSandy || isLoamy ? "Excellent" : "Good",
        icon: "🥔",
        reason: `Cool weather (${climate.avgTemp}°C) suitable, ${
          isSandy || isLoamy ? "well-drained soil ideal" : "soil workable"
        }`,
        requirements: "Plant in October-November, earth up regularly",
      });
    }

    // Maize/Corn
    if (isWarm || isHot) {
      crops.push({
        name: "Maize",
        suitability: isLoamy && isModerateRainfall ? "Excellent" : "Good",
        icon: "🌽",
        reason: `Warm climate (${climate.avgTemp}°C) favorable, ${
          isLoamy ? "loamy soil optimal" : "soil suitable"
        }`,
        requirements: "Sow in June-July, requires nitrogen-rich fertilizer",
      });
    }

    // Mustard
    if (isCool || isWarm) {
      crops.push({
        name: "Mustard",
        suitability: isLoamy ? "Excellent" : "Good",
        icon: "🌼",
        reason: `Cool season crop, pH ${soil.ph.toFixed(
          1
        )} suitable, low water requirement matches conditions`,
        requirements: "Sow in October-November, ready in 90-100 days",
      });
    }

    return crops.slice(0, 6);
  };

  const calculateFertilizer = () => {
    if (!selectedCrop) {
      alert("Please select a crop first!");
      return;
    }

    const fertilizerDatabase = {
      Wheat: {
        crop: "Wheat",
        icon: "🌾",
        npk: "120-60-40",
        stages: [
          {
            stage: "Basal (At Sowing)",
            n: 40,
            p: 60,
            k: 40,
            timing: "Day 0",
            products: "DAP + MOP",
          },
          {
            stage: "First Top Dressing",
            n: 40,
            p: 0,
            k: 0,
            timing: "21 days after sowing",
            products: "Urea",
          },
          {
            stage: "Second Top Dressing",
            n: 40,
            p: 0,
            k: 0,
            timing: "40 days after sowing",
            products: "Urea",
          },
        ],
        totalCostPerAcre: 3200,
        additionalTips: [
          "Apply Zinc Sulphate @ 25 kg/acre if soil is deficient",
          "Use FYM or compost 8-10 tons per acre before sowing",
          "Split nitrogen application prevents lodging",
        ],
      },
      Rice: {
        crop: "Rice",
        icon: "🌾",
        npk: "120-60-40",
        stages: [
          {
            stage: "Basal (At Transplanting)",
            n: 40,
            p: 60,
            k: 20,
            timing: "Day 0",
            products: "DAP + Urea + MOP",
          },
          {
            stage: "Tillering Stage",
            n: 40,
            p: 0,
            k: 20,
            timing: "20-25 days after transplanting",
            products: "Urea + MOP",
          },
          {
            stage: "Panicle Initiation",
            n: 40,
            p: 0,
            k: 0,
            timing: "40-45 days after transplanting",
            products: "Urea",
          },
        ],
        totalCostPerAcre: 3800,
        additionalTips: [
          "Maintain 2-3 inches water level during vegetative growth",
          "Apply Zinc @ 12 kg/acre if deficiency symptoms appear",
          "Use slow-release nitrogen for better efficiency",
        ],
      },
      Potato: {
        crop: "Potato",
        icon: "🥔",
        npk: "150-80-100",
        stages: [
          {
            stage: "Basal (At Planting)",
            n: 60,
            p: 80,
            k: 50,
            timing: "Day 0",
            products: "DAP + MOP + Urea",
          },
          {
            stage: "Earthing Up",
            n: 45,
            p: 0,
            k: 50,
            timing: "25-30 days after planting",
            products: "Urea + MOP",
          },
          {
            stage: "Tuber Bulking",
            n: 45,
            p: 0,
            k: 0,
            timing: "45-50 days after planting",
            products: "Urea",
          },
        ],
        totalCostPerAcre: 5500,
        additionalTips: [
          "High potassium requirement for tuber quality",
          "Apply Boron @ 1 kg/acre for better tuber formation",
          "Avoid nitrogen excess after 60 days - reduces storage quality",
        ],
      },
      Tomato: {
        crop: "Tomato",
        icon: "🍅",
        npk: "150-100-100",
        stages: [
          {
            stage: "Basal (At Transplanting)",
            n: 50,
            p: 100,
            k: 40,
            timing: "Day 0",
            products: "DAP + MOP",
          },
          {
            stage: "Vegetative Growth",
            n: 50,
            p: 0,
            k: 30,
            timing: "20-25 days",
            products: "Urea + MOP",
          },
          {
            stage: "Flowering & Fruiting",
            n: 50,
            p: 0,
            k: 30,
            timing: "40-45 days",
            products: "Urea + MOP",
          },
        ],
        totalCostPerAcre: 6200,
        additionalTips: [
          "Apply Calcium Nitrate during fruiting to prevent blossom end rot",
          "Maintain consistent moisture - irregular watering causes cracking",
          "Use 19-19-19 foliar spray during flowering",
        ],
      },
      Sugarcane: {
        crop: "Sugarcane",
        icon: "🎋",
        npk: "250-100-100",
        stages: [
          {
            stage: "Basal (At Planting)",
            n: 80,
            p: 100,
            k: 50,
            timing: "Day 0",
            products: "DAP + MOP + Urea",
          },
          {
            stage: "Tillering (45 Days)",
            n: 85,
            p: 0,
            k: 25,
            timing: "45 days",
            products: "Urea + MOP",
          },
          {
            stage: "Grand Growth (90 Days)",
            n: 85,
            p: 0,
            k: 25,
            timing: "90 days",
            products: "Urea + MOP",
          },
        ],
        totalCostPerAcre: 8500,
        additionalTips: [
          "Apply FYM 10-12 tons per acre for better soil health",
          "Use trash mulching to retain moisture",
          "Avoid nitrogen after 6 months - affects sugar content",
        ],
      },
      Corn: {
        crop: "Corn/Maize",
        icon: "🌽",
        npk: "120-60-40",
        stages: [
          {
            stage: "Basal (At Sowing)",
            n: 40,
            p: 60,
            k: 40,
            timing: "Day 0",
            products: "DAP + MOP",
          },
          {
            stage: "Knee Height Stage",
            n: 40,
            p: 0,
            k: 0,
            timing: "25-30 days",
            products: "Urea",
          },
          {
            stage: "Tasseling Stage",
            n: 40,
            p: 0,
            k: 0,
            timing: "45-50 days",
            products: "Urea",
          },
        ],
        totalCostPerAcre: 3500,
        additionalTips: [
          "Apply Zinc Sulphate @ 20 kg/acre if soil is deficient",
          "Critical nitrogen need during tasseling stage",
          "Use organic mulch to conserve moisture",
        ],
      },
    };

    const cropKey = Object.keys(fertilizerDatabase).find(
      (key) =>
        key.toLowerCase() === selectedCrop.toLowerCase() ||
        selectedCrop.toLowerCase().includes(key.toLowerCase())
    );

    if (cropKey) {
      setFertilizerPlan(fertilizerDatabase[cropKey]);
    } else {
      // Default fertilizer plan
      setFertilizerPlan({
        crop: selectedCrop,
        icon: "🌱",
        npk: "100-50-50",
        stages: [
          {
            stage: "Basal Application",
            n: 40,
            p: 50,
            k: 50,
            timing: "At planting",
            products: "DAP + MOP",
          },
          {
            stage: "First Top Dressing",
            n: 30,
            p: 0,
            k: 0,
            timing: "3-4 weeks",
            products: "Urea",
          },
          {
            stage: "Second Top Dressing",
            n: 30,
            p: 0,
            k: 0,
            timing: "6-7 weeks",
            products: "Urea",
          },
        ],
        totalCostPerAcre: 4000,
        additionalTips: [
          "Adjust doses based on soil test results",
          "Apply organic matter for long-term soil health",
          "Consider micro-nutrient spray during critical growth stages",
        ],
      });
    }
  };
  // Farm Calculator Suite
  const calculateFarmMetrics = (type, inputs) => {
    let result = {};

    switch (type) {
      case "seedRate":
        const seedsPerKg = inputs.seedsPerKg || 40000;
        const germination = (inputs.germination || 85) / 100;
        const plantPopulation = inputs.plantPopulation || 400000;
        const seedRate = (plantPopulation / germination / seedsPerKg).toFixed(
          2
        );
        result = {
          title: "Seed Rate Calculation",
          icon: "🌾",
          mainResult: `${seedRate} kg/acre`,
          details: [
            {
              label: "Plant Population Target",
              value: `${plantPopulation.toLocaleString()} plants/acre`,
            },
            {
              label: "Germination Rate",
              value: `${inputs.germination || 85}%`,
            },
            { label: "Seeds per Kg", value: seedsPerKg.toLocaleString() },
            { label: "Recommended Seed Rate", value: `${seedRate} kg/acre` },
          ],
          tip: "Add 10-15% extra for field losses and bird damage",
        };
        break;

      case "irrigation":
        const cropWaterReq = inputs.waterReq || 500; // mm per season
        const rainfall = inputs.rainfall || 100;
        const efficiency = (inputs.efficiency || 70) / 100;
        const irrigationNeeded = (
          (cropWaterReq - rainfall) /
          efficiency
        ).toFixed(0);
        const numberOfIrrigations = Math.ceil(irrigationNeeded / 75);
        result = {
          title: "Irrigation Requirement",
          icon: "💧",
          mainResult: `${numberOfIrrigations} irrigations needed`,
          details: [
            { label: "Crop Water Requirement", value: `${cropWaterReq} mm` },
            { label: "Expected Rainfall", value: `${rainfall} mm` },
            {
              label: "System Efficiency",
              value: `${inputs.efficiency || 70}%`,
            },
            {
              label: "Total Irrigation Needed",
              value: `${irrigationNeeded} mm`,
            },
            {
              label: "Number of Irrigations",
              value: `${numberOfIrrigations} times (75mm each)`,
            },
          ],
          tip: "Irrigate during early morning or evening for best efficiency",
        };
        break;

      case "yield":
        const area = inputs.area || 1;
        const plantDensity = inputs.density || 50000;
        const avgYieldPerPlant = inputs.yieldPerPlant || 0.5; // kg
        const estimatedYield = (
          (area * plantDensity * avgYieldPerPlant) /
          1000
        ).toFixed(2);
        const marketPrice = inputs.price || 30;
        const grossRevenue = (estimatedYield * marketPrice).toFixed(0);
        result = {
          title: "Yield Estimation",
          icon: "📊",
          mainResult: `${estimatedYield} tons`,
          details: [
            { label: "Area", value: `${area} acre` },
            {
              label: "Plant Density",
              value: `${plantDensity.toLocaleString()} plants/acre`,
            },
            { label: "Avg Yield per Plant", value: `${avgYieldPerPlant} kg` },
            { label: "Estimated Total Yield", value: `${estimatedYield} tons` },
            {
              label: "Expected Revenue",
              value: `₹${parseInt(
                grossRevenue
              ).toLocaleString()} (@ ₹${marketPrice}/kg)`,
            },
          ],
          tip: "Actual yield depends on weather, pest management, and soil fertility",
        };
        break;

      case "profit":
        const investment = inputs.investment || 50000;
        const revenue = inputs.revenue || 80000;
        const profit = revenue - investment;
        const roi = ((profit / investment) * 100).toFixed(1);
        const profitPerAcre = (profit / (inputs.area || 1)).toFixed(0);
        result = {
          title: "Profit Analysis",
          icon: "💰",
          mainResult: `₹${profit.toLocaleString()} profit`,
          details: [
            {
              label: "Total Investment",
              value: `₹${investment.toLocaleString()}`,
            },
            { label: "Total Revenue", value: `₹${revenue.toLocaleString()}` },
            {
              label: "Net Profit",
              value: `₹${profit.toLocaleString()}`,
              highlight: profit > 0,
            },
            { label: "ROI", value: `${roi}%`, highlight: roi > 0 },
            {
              label: "Profit per Acre",
              value: `₹${parseInt(profitPerAcre).toLocaleString()}`,
            },
          ],
          tip:
            profit > 0
              ? "Profitable crop! Consider expanding area next season"
              : "Review costs and improve practices",
        };
        break;

      case "landConverter":
        const acres = inputs.value || 1;
        result = {
          title: "Land Area Conversion",
          icon: "📏",
          mainResult: `${acres} Acre`,
          details: [
            { label: "Hectares", value: (acres * 0.404686).toFixed(3) },
            { label: "Bigha (Standard)", value: (acres * 1.6).toFixed(2) },
            { label: "Square Meters", value: (acres * 4046.86).toFixed(0) },
            { label: "Square Feet", value: (acres * 43560).toFixed(0) },
            { label: "Kanal", value: (acres * 8).toFixed(2) },
          ],
          tip: "Land measurement units vary by region",
        };
        break;

      case "sprayDilution":
        const productRate = inputs.productRate || 200; // ml per acre
        const waterVolume = inputs.waterVolume || 200; // liters per acre
        const sprayArea = inputs.sprayArea || 1; // acres
        const productNeeded = (productRate * sprayArea).toFixed(0);
        const waterNeeded = (waterVolume * sprayArea).toFixed(0);
        const concentration = ((productNeeded / waterNeeded) * 100).toFixed(2);
        result = {
          title: "Spray Dilution Calculator",
          icon: "🚿",
          mainResult: `${productNeeded} ml in ${waterNeeded} L water`,
          details: [
            { label: "Product Rate", value: `${productRate} ml/acre` },
            { label: "Water Volume", value: `${waterVolume} L/acre` },
            { label: "Spray Area", value: `${sprayArea} acre` },
            { label: "Product Required", value: `${productNeeded} ml` },
            { label: "Water Required", value: `${waterNeeded} liters` },
            { label: "Concentration", value: `${concentration}%` },
          ],
          tip: "Mix product in half water first, then add remaining water",
        };
        break;

      default:
        result = null;
    }

    setCalculatorResult(result);
  };

  // Crop Rotation Planner
  const generateRotationPlan = (mainCrop) => {
    const rotationData = {
      Wheat: {
        icon: "🌾",
        year1: {
          crop: "Wheat",
          icon: "🌾",
          season: "Rabi",
          benefit: "Main cash crop",
        },
        year2: {
          crop: "Legume (Peas/Chickpea)",
          icon: "🫘",
          season: "Rabi",
          benefit: "Fixes nitrogen, improves soil",
        },
        year3: {
          crop: "Rice/Maize",
          icon: "🌾",
          season: "Kharif",
          benefit: "Different nutrient uptake",
        },
        year4: {
          crop: "Wheat",
          icon: "🌾",
          season: "Rabi",
          benefit: "Return to main crop",
        },
        benefits: [
          "Breaks pest and disease cycles",
          "Improves soil fertility through legumes",
          "Reduces chemical dependency",
          "Diversifies income sources",
        ],
        tips: [
          "Include at least one legume crop every 2-3 years",
          "Vary between deep and shallow-rooted crops",
          "Consider market demand for rotation crops",
        ],
      },
      Rice: {
        icon: "🌾",
        year1: {
          crop: "Rice",
          icon: "🌾",
          season: "Kharif",
          benefit: "Main crop",
        },
        year2: {
          crop: "Wheat/Mustard",
          icon: "🌾",
          season: "Rabi",
          benefit: "Different root system",
        },
        year3: {
          crop: "Legume (Lentil)",
          icon: "🫘",
          season: "Rabi",
          benefit: "Nitrogen fixation",
        },
        year4: {
          crop: "Rice",
          icon: "🌾",
          season: "Kharif",
          benefit: "Return to rice",
        },
        benefits: [
          "Prevents soil degradation from continuous flooding",
          "Reduces buildup of rice-specific pests",
          "Improves soil structure",
          "Better water management",
        ],
        tips: [
          "Dry season crops help break waterlogged conditions",
          "Rotate with upland crops to improve drainage",
          "Use green manure before rice",
        ],
      },
      Potato: {
        icon: "🥔",
        year1: {
          crop: "Potato",
          icon: "🥔",
          season: "Rabi",
          benefit: "High-value crop",
        },
        year2: {
          crop: "Maize",
          icon: "🌽",
          season: "Kharif",
          benefit: "Deep roots break hardpan",
        },
        year3: {
          crop: "Legume (Beans)",
          icon: "🫘",
          season: "Kharif",
          benefit: "Restores nitrogen",
        },
        year4: {
          crop: "Wheat",
          icon: "🌾",
          season: "Rabi",
          benefit: "Different pest profile",
        },
        benefits: [
          "Prevents late blight persistence",
          "Reduces nematode populations",
          "Improves soil organic matter",
          "Breaks disease cycles",
        ],
        tips: [
          "Never grow potato-tomato back-to-back (same family)",
          "Include grass/cereal crops to reduce disease",
          "Allow 3-4 years before repeating potato",
        ],
      },
      Cotton: {
        icon: "🌸",
        year1: {
          crop: "Cotton",
          icon: "🌸",
          season: "Kharif",
          benefit: "Main cash crop",
        },
        year2: {
          crop: "Wheat",
          icon: "🌾",
          season: "Rabi",
          benefit: "Soil recovery",
        },
        year3: {
          crop: "Legume (Chickpea)",
          icon: "🫘",
          season: "Rabi",
          benefit: "Nitrogen addition",
        },
        year4: {
          crop: "Sorghum/Maize",
          icon: "🌽",
          season: "Kharif",
          benefit: "Pest break",
        },
        benefits: [
          "Reduces bollworm and whitefly populations",
          "Restores soil nutrients depleted by cotton",
          "Reduces chemical residue buildup",
          "Improves soil health",
        ],
        tips: [
          "Cotton is a heavy feeder - follow with soil-building crops",
          "Avoid continuous cotton to prevent pest resistance",
          "Use cover crops in gaps",
        ],
      },
    };

    const cropKey = Object.keys(rotationData).find((key) =>
      mainCrop.toLowerCase().includes(key.toLowerCase())
    );

    if (cropKey) {
      setRotationPlan(rotationData[cropKey]);
    } else {
      setRotationPlan({
        icon: "🌱",
        year1: {
          crop: mainCrop,
          icon: "🌱",
          season: "Main Season",
          benefit: "Primary crop",
        },
        year2: {
          crop: "Legume Crop",
          icon: "🫘",
          season: "Off Season",
          benefit: "Nitrogen fixation",
        },
        year3: {
          crop: "Cereal Crop",
          icon: "🌾",
          season: "Main Season",
          benefit: "Different nutrient need",
        },
        year4: {
          crop: mainCrop,
          icon: "🌱",
          season: "Main Season",
          benefit: "Return to primary",
        },
        benefits: [
          "Breaks pest and disease cycles",
          "Improves soil health",
          "Diversifies farm income",
          "Reduces chemical inputs",
        ],
        tips: [
          "Consult local agricultural extension for specific recommendations",
          "Consider market demand for rotation crops",
          "Keep records of each crop's performance",
        ],
      });
    }
  };

  // Community Knowledge Base
  const knowledgeBase = [
    {
      category: "Pest Management",
      icon: "🐛",
      title: "Natural Aphid Control",
      content:
        "Mix neem oil (30ml) with water (1L) and a drop of dish soap. Spray on affected plants in early morning. Repeat every 5-7 days.",
      author: "Ramesh Kumar, Punjab",
      likes: 245,
      region: "North India",
    },
    {
      category: "Soil Health",
      icon: "🌱",
      title: "Homemade Compost Tea",
      content:
        "Fill a cloth bag with mature compost, suspend in water bucket for 24 hours. Dilute 1:10 and use as foliar spray for nutrient boost.",
      author: "Lakshmi Devi, Tamil Nadu",
      likes: 189,
      region: "South India",
    },
    {
      category: "Water Management",
      icon: "💧",
      title: "Drip Irrigation from Plastic Bottles",
      content:
        "Poke small holes in plastic bottle cap, fill with water, invert near plant roots. Free drip system for small gardens!",
      author: "Suresh Patil, Maharashtra",
      likes: 312,
      region: "West India",
    },
    {
      category: "Organic Farming",
      icon: "🌿",
      title: "Banana Peel Fertilizer",
      content:
        "Dry banana peels in sun, powder them, and mix into soil. Rich in potassium - excellent for flowering and fruiting plants.",
      author: "Anita Sharma, Uttarakhand",
      likes: 267,
      region: "North India",
    },
    {
      category: "Crop Protection",
      icon: "🛡️",
      title: "Garlic-Chilli Pest Spray",
      content:
        "Blend 10 garlic cloves + 5 green chillies with 1L water. Strain and spray. Natural pest deterrent, lasts 1 week.",
      author: "Madhav Reddy, Telangana",
      likes: 198,
      region: "South India",
    },
    {
      category: "Seed Treatment",
      icon: "🌾",
      title: "Turmeric Seed Treatment",
      content:
        "Mix turmeric powder (10g) in water, soak seeds for 30 mins before sowing. Natural fungicide, improves germination.",
      author: "Gurpreet Singh, Haryana",
      likes: 156,
      region: "North India",
    },
    {
      category: "Weed Control",
      icon: "🌿",
      title: "Mulching with Newspaper",
      content:
        "Layer newspaper (4-5 sheets) around plants, wet it, cover with soil/straw. Suppresses weeds, retains moisture.",
      author: "Fatima Khan, West Bengal",
      likes: 223,
      region: "East India",
    },
    {
      category: "Storage",
      icon: "📦",
      title: "Neem Leaves for Grain Storage",
      content:
        "Mix dried neem leaves (100g per 10kg grain) while storing. Prevents insect infestation naturally for 6+ months.",
      author: "Ravi Verma, Madhya Pradesh",
      likes: 289,
      region: "Central India",
    },
  ];

  const filteredKnowledge = knowledgeSearch
    ? knowledgeBase.filter(
        (item) =>
          item.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
          item.category.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
          item.content.toLowerCase().includes(knowledgeSearch.toLowerCase())
      )
    : knowledgeBase;

  // Farm Dashboard Analytics
  const generateAnalytics = () => {
    const analytics = {
      overview: {
        totalCrops: 4,
        activeArea: 12.5,
        totalInvestment: 245000,
        expectedRevenue: 385000,
        profitMargin: 36.2,
      },
      cropData: [
        {
          crop: "Wheat",
          area: 5,
          investment: 85000,
          revenue: 145000,
          status: "Harvesting",
        },
        {
          crop: "Rice",
          area: 4,
          investment: 72000,
          revenue: 118000,
          status: "Flowering",
        },
        {
          crop: "Potato",
          area: 2.5,
          investment: 58000,
          revenue: 92000,
          status: "Growing",
        },
        {
          crop: "Tomato",
          area: 1,
          investment: 30000,
          revenue: 30000,
          status: "Transplanted",
        },
      ],
      monthlyExpenses: [
        { month: "Jan", amount: 45000, category: "Seeds & Planting" },
        { month: "Feb", amount: 28000, category: "Fertilizers" },
        { month: "Mar", amount: 32000, category: "Irrigation" },
        { month: "Apr", amount: 22000, category: "Pest Control" },
        { month: "May", amount: 38000, category: "Labor" },
        { month: "Jun", amount: 18000, category: "Maintenance" },
      ],
      resourceUsage: {
        water: { used: 2400, limit: 3000, unit: "cubic meters" },
        fertilizer: { used: 850, limit: 1000, unit: "kg" },
        pesticides: { used: 45, limit: 60, unit: "liters" },
      },
      alerts: [
        {
          type: "success",
          message: "Wheat harvest completed - 35% above target!",
        },
        { type: "warning", message: "Water usage at 80% - monitor irrigation" },
        { type: "info", message: "Next fertilizer application due in 5 days" },
      ],
    };

    setFarmAnalytics(analytics);
  };

  const exportReport = () => {
    if (!farmAnalytics) return;

    const reportData = `
FARM ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
========
Total Crops: ${farmAnalytics.overview.totalCrops}
Active Area: ${farmAnalytics.overview.activeArea} acres
Total Investment: ₹${farmAnalytics.overview.totalInvestment.toLocaleString()}
Expected Revenue: ₹${farmAnalytics.overview.expectedRevenue.toLocaleString()}
Profit Margin: ${farmAnalytics.overview.profitMargin}%

CROP-WISE DETAILS
=================
${farmAnalytics.cropData
  .map(
    (crop) => `
${crop.crop}:
  Area: ${crop.area} acres
  Investment: ₹${crop.investment.toLocaleString()}
  Revenue: ₹${crop.revenue.toLocaleString()}
  Status: ${crop.status}
`
  )
  .join("")}

RESOURCE USAGE
==============
Water: ${farmAnalytics.resourceUsage.water.used}/${
      farmAnalytics.resourceUsage.water.limit
    } ${farmAnalytics.resourceUsage.water.unit}
Fertilizer: ${farmAnalytics.resourceUsage.fertilizer.used}/${
      farmAnalytics.resourceUsage.fertilizer.limit
    } ${farmAnalytics.resourceUsage.fertilizer.unit}
Pesticides: ${farmAnalytics.resourceUsage.pesticides.used}/${
      farmAnalytics.resourceUsage.pesticides.limit
    } ${farmAnalytics.resourceUsage.pesticides.unit}
    `.trim();

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farm-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-900 text-gray-100 px-6 py-12 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent mb-4">
            Smart Farm Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time agricultural intelligence at your fingertips
          </p>
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
        </motion.div>

        {/* Farm Dashboard Analytics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-pink-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-pink-500/20 mb-16"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text mb-8 text-center">
            📈 Farm Dashboard Analytics
          </h2>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={generateAnalytics}
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              📊 Generate Analytics
            </button>
            {farmAnalytics && (
              <button
                onClick={exportReport}
                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                📥 Export Report
              </button>
            )}
          </div>

          {farmAnalytics && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Overview Cards */}
              <div className="grid md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Total Crops</p>
                  <p className="text-3xl font-bold text-white">
                    {farmAnalytics.overview.totalCrops}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Active Area</p>
                  <p className="text-3xl font-bold text-white">
                    {farmAnalytics.overview.activeArea}
                  </p>
                  <p className="text-gray-500 text-xs">acres</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-xl border border-orange-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Investment</p>
                  <p className="text-2xl font-bold text-white">
                    ₹
                    {(farmAnalytics.overview.totalInvestment / 1000).toFixed(0)}
                    K
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ₹
                    {(farmAnalytics.overview.expectedRevenue / 1000).toFixed(0)}
                    K
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 p-4 rounded-xl border border-yellow-500/30 text-center">
                  <p className="text-gray-400 text-xs mb-1">Profit Margin</p>
                  <p className="text-3xl font-bold text-green-400">
                    {farmAnalytics.overview.profitMargin}%
                  </p>
                </div>
              </div>

              {/* Crop-wise Data */}
              <div>
                <h3 className="text-pink-400 font-bold text-xl mb-4">
                  Crop-wise Performance
                </h3>
                <div className="space-y-3">
                  {farmAnalytics.cropData.map((crop, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-gray-800/50 p-4 rounded-xl border border-pink-500/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold">{crop.crop}</h4>
                        <span className="px-3 py-1 bg-pink-600/30 text-pink-300 rounded-full text-xs">
                          {crop.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Area</p>
                          <p className="text-white font-semibold">
                            {crop.area} acres
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Investment</p>
                          <p className="text-white font-semibold">
                            ₹{(crop.investment / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Revenue</p>
                          <p className="text-green-400 font-semibold">
                            ₹{(crop.revenue / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Resource Usage */}
              <div>
                <h3 className="text-pink-400 font-bold text-xl mb-4">
                  Resource Usage
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(farmAnalytics.resourceUsage).map(
                    ([key, data], i) => {
                      const percentage = (data.used / data.limit) * 100;
                      return (
                        <div
                          key={i}
                          className="bg-gray-800/50 p-4 rounded-xl border border-pink-500/20"
                        >
                          <p className="text-gray-400 text-sm mb-2 capitalize">
                            {key}
                          </p>
                          <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-bold text-white">
                              {data.used}
                            </span>
                            <span className="text-gray-400 text-sm">
                              / {data.limit} {data.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage > 80
                                  ? "bg-red-500"
                                  : percentage > 60
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {percentage.toFixed(0)}% used
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900/80 to-pink-950/40 p-6 rounded-2xl border border-pink-500/20">
                <h3 className="text-pink-400 font-bold text-lg mb-4">
                  System Alerts
                </h3>
                <div className="space-y-2">
                  {farmAnalytics.alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        alert.type === "success"
                          ? "bg-green-600/20 text-green-300"
                          : alert.type === "warning"
                          ? "bg-yellow-600/20 text-yellow-300"
                          : "bg-blue-600/20 text-blue-300"
                      }`}
                    >
                      {alert.message}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!farmAnalytics && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-gray-400 text-lg">
                Generate comprehensive analytics for your farm
              </p>
            </div>
          )}
        </motion.section>
        {/* Farm Calculator Suite */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-cyan-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-cyan-500/20 mb-16"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-8 text-center">
            🧮 Farm Calculator Suite
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { type: "seedRate", label: "Seed Rate", icon: "🌾" },
              { type: "irrigation", label: "Irrigation", icon: "💧" },
              { type: "yield", label: "Yield Estimator", icon: "📊" },
              { type: "profit", label: "Profit Calculator", icon: "💰" },
              { type: "landConverter", label: "Land Converter", icon: "📏" },
              { type: "sprayDilution", label: "Spray Dilution", icon: "🚿" },
            ].map((calc, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCalculatorType(calc.type)}
                className={`p-4 rounded-xl border transition-all ${
                  calculatorType === calc.type
                    ? "bg-cyan-600/30 border-cyan-500/60"
                    : "bg-gray-800/50 border-cyan-500/20 hover:border-cyan-500/40"
                }`}
              >
                <div className="text-3xl mb-2">{calc.icon}</div>
                <p className="text-white text-sm font-semibold">{calc.label}</p>
              </motion.button>
            ))}
          </div>

          {calculatorType === "seedRate" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">
                Seed Rate Calculator
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  id="seedsPerKg"
                  placeholder="Seeds per kg (e.g., 40000)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="germination"
                  placeholder="Germination % (e.g., 85)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="plantPop"
                  placeholder="Plant population (e.g., 400000)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("seedRate", {
                    seedsPerKg: parseFloat(
                      document.getElementById("seedsPerKg").value
                    ),
                    germination: parseFloat(
                      document.getElementById("germination").value
                    ),
                    plantPopulation: parseFloat(
                      document.getElementById("plantPop").value
                    ),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Calculate
              </button>
            </div>
          )}

          {calculatorType === "irrigation" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">
                Irrigation Calculator
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  id="waterReq"
                  placeholder="Crop water need (mm)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="rainfall"
                  placeholder="Expected rainfall (mm)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="efficiency"
                  placeholder="Efficiency % (e.g., 70)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("irrigation", {
                    waterReq: parseFloat(
                      document.getElementById("waterReq").value
                    ),
                    rainfall: parseFloat(
                      document.getElementById("rainfall").value
                    ),
                    efficiency: parseFloat(
                      document.getElementById("efficiency").value
                    ),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Calculate
              </button>
            </div>
          )}

          {calculatorType === "yield" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">Yield Estimator</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  id="area"
                  placeholder="Area (acres)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="density"
                  placeholder="Plant density (plants/acre)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="yieldPerPlant"
                  placeholder="Yield per plant (kg)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="price"
                  placeholder="Market price (₹/kg)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("yield", {
                    area: parseFloat(document.getElementById("area").value),
                    density: parseFloat(
                      document.getElementById("density").value
                    ),
                    yieldPerPlant: parseFloat(
                      document.getElementById("yieldPerPlant").value
                    ),
                    price: parseFloat(document.getElementById("price").value),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Calculate
              </button>
            </div>
          )}

          {calculatorType === "profit" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">
                Profit Calculator
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  id="investment"
                  placeholder="Total investment (₹)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="revenue"
                  placeholder="Total revenue (₹)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="profitArea"
                  placeholder="Area (acres)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("profit", {
                    investment: parseFloat(
                      document.getElementById("investment").value
                    ),
                    revenue: parseFloat(
                      document.getElementById("revenue").value
                    ),
                    area: parseFloat(
                      document.getElementById("profitArea").value
                    ),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Calculate
              </button>
            </div>
          )}

          {calculatorType === "landConverter" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">
                Land Area Converter
              </h3>
              <div className="mb-4">
                <input
                  type="number"
                  id="landValue"
                  placeholder="Enter area in Acres"
                  className="w-full px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("landConverter", {
                    value: parseFloat(
                      document.getElementById("landValue").value
                    ),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Convert
              </button>
            </div>
          )}

          {calculatorType === "sprayDilution" && (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
              <h3 className="text-cyan-400 font-bold mb-4">
                Spray Dilution Calculator
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  id="productRate"
                  placeholder="Product rate (ml/acre)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="waterVolume"
                  placeholder="Water volume (L/acre)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
                <input
                  type="number"
                  id="sprayArea"
                  placeholder="Spray area (acres)"
                  className="px-4 py-2 bg-gray-900 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() =>
                  calculateFarmMetrics("sprayDilution", {
                    productRate: parseFloat(
                      document.getElementById("productRate").value
                    ),
                    waterVolume: parseFloat(
                      document.getElementById("waterVolume").value
                    ),
                    sprayArea: parseFloat(
                      document.getElementById("sprayArea").value
                    ),
                  })
                }
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold"
              >
                Calculate
              </button>
            </div>
          )}

          {calculatorResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 rounded-xl border border-cyan-500/40"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{calculatorResult.icon}</span>
                <h3 className="text-cyan-300 font-bold text-xl">
                  {calculatorResult.title}
                </h3>
              </div>
              <p className="text-3xl font-black text-white mb-4">
                {calculatorResult.mainResult}
              </p>
              <div className="space-y-2">
                {calculatorResult.details.map((detail, i) => (
                  <div
                    key={i}
                    className={`flex justify-between text-sm ${
                      detail.highlight
                        ? "text-green-400 font-bold"
                        : "text-gray-300"
                    }`}
                  >
                    <span>{detail.label}:</span>
                    <span>{detail.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-cyan-400 text-sm italic">
                💡 Tip: {calculatorResult.tip}
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Weather & Irrigation - MOVED TO TOP */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-blue-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-blue-500/20 mb-16"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text mb-8 text-center">
            🌦️ Weather & Irrigation Forecast
          </h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={fetchWeatherAndIrrigation}
              disabled={loadingWeather}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loadingWeather
                ? "⏳ Fetching Weather..."
                : "📍 Get Weather & Irrigation Advice"}
            </button>
          </div>

          {loadingWeather && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-blue-400 font-medium">
                🌍 Getting your location and weather data...
              </p>
            </motion.div>
          )}

          {weatherData && !loadingWeather && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-1">Location</p>
                <p className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                  <span>📍</span>
                  <span>{weatherData.location}</span>
                </p>
              </div>

              <div
                className={`p-6 rounded-2xl border-2 ${
                  weatherData.irrigation.needed
                    ? "bg-gradient-to-br from-orange-600/30 to-red-600/30 border-orange-500/50"
                    : "bg-gradient-to-br from-green-600/30 to-emerald-600/30 border-green-500/50"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-4xl">
                    {weatherData.irrigation.needed ? "💧" : "✅"}
                  </span>
                  <h3
                    className={`font-bold text-xl ${
                      weatherData.irrigation.needed
                        ? "text-orange-300"
                        : "text-green-300"
                    }`}
                  >
                    Irrigation Status
                  </h3>
                </div>
                <p className="text-white text-lg font-semibold ml-12">
                  {weatherData.irrigation.advice}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-800/80 to-blue-900/40 p-5 rounded-xl border border-blue-500/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">☀️</div>
                    <p className="text-gray-400 text-sm font-semibold mb-3">
                      Today
                    </p>
                    <div className="space-y-2">
                      <p className="text-blue-300 text-sm">Precipitation</p>
                      <p className="text-2xl font-bold text-white">
                        {weatherData.today.precipitation.toFixed(1)} mm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/80 to-blue-900/40 p-5 rounded-xl border border-blue-500/30 ring-2 ring-blue-400/50">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌤️</div>
                    <p className="text-blue-400 text-sm font-bold mb-3">
                      Tomorrow
                    </p>
                    <div className="space-y-2">
                      <p className="text-blue-300 text-sm">Precipitation</p>
                      <p className="text-2xl font-bold text-white">
                        {weatherData.tomorrow.precipitation.toFixed(1)} mm
                      </p>
                      <p className="text-blue-400 text-xs">
                        Chance: {weatherData.tomorrow.probability}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/80 to-blue-900/40 p-5 rounded-xl border border-blue-500/30">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌥️</div>
                    <p className="text-gray-400 text-sm font-semibold mb-3">
                      Day After
                    </p>
                    <div className="space-y-2">
                      <p className="text-blue-300 text-sm">Precipitation</p>
                      <p className="text-2xl font-bold text-white">
                        {weatherData.dayAfter.precipitation.toFixed(1)} mm
                      </p>
                      <p className="text-blue-400 text-xs">
                        Chance: {weatherData.dayAfter.probability}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-blue-950/40 p-6 rounded-2xl border border-blue-500/20">
                <h3 className="text-blue-400 font-bold text-lg mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Smart Irrigation Tips</span>
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Best time to irrigate: Early morning (6-8 AM) or evening
                      (6-8 PM)
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Drip irrigation saves 30-50% more water than sprinkler
                      systems
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Check soil moisture before irrigating - overwatering can
                      harm crops
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Consider mulching to retain soil moisture and reduce
                      irrigation needs
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {!weatherData && !loadingWeather && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌦️</div>
              <p className="text-gray-400 text-lg">
                Click the button above to get weather forecast and irrigation
                recommendations
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {` We'll use your location to provide accurate local weather data`}
              </p>
            </div>
          )}
        </motion.section>

        {/* Crop Recommendation System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-emerald-950/40 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-emerald-500/20 mb-16"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text mb-8 text-center">
            🌱 Smart Crop Recommendations
          </h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={fetchCropRecommendations}
              disabled={loadingCrops}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loadingCrops ? "⏳ Analyzing..." : "🌍 Get Crop Recommendations"}
            </button>
          </div>

          {loadingCrops && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-emerald-400 font-medium">
                🌍 Analyzing soil, climate, and regional data...
              </p>
            </motion.div>
          )}

          {cropRecommendations && !loadingCrops && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Location & Summary */}
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-1">Analysis Location</p>
                <p className="text-2xl font-bold text-white flex items-center justify-center space-x-2 mb-6">
                  <span>📍</span>
                  <span>{cropRecommendations.location}</span>
                </p>
              </div>

              {/* Environmental Conditions */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Climate Card */}
                <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/20 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-4xl">🌡️</span>
                    <h3 className="text-orange-300 font-bold text-lg">
                      Climate Data
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex justify-between">
                      <span>Current Temp:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.climate.currentTemp}°C
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Avg Temp (14d):</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.climate.avgTemp}°C
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Total Rainfall:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.climate.totalRainfall} mm
                      </span>
                    </p>
                  </div>
                </div>

                {/* Soil Card */}
                <div className="bg-gradient-to-br from-yellow-700/20 to-orange-700/20 p-6 rounded-xl border border-yellow-600/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-4xl">🏔️</span>
                    <h3 className="text-yellow-300 font-bold text-lg">
                      Soil Properties
                    </h3>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex justify-between">
                      <span>pH Level:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.soil.ph.toFixed(1)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Organic Carbon:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.soil.organicCarbon.toFixed(1)}%
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Clay Content:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.soil.clay.toFixed(0)}%
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sand Content:</span>
                      <span className="font-semibold text-white">
                        {cropRecommendations.soil.sand.toFixed(0)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Soil Health Indicators */}
              <div className="bg-gradient-to-br from-gray-900/80 to-emerald-950/40 p-6 rounded-2xl border border-emerald-500/20 mb-6">
                <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Soil Health Assessment</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">pH Status</p>
                    <p
                      className={`text-lg font-bold ${
                        cropRecommendations.soil.ph < 6.5
                          ? "text-orange-400"
                          : cropRecommendations.soil.ph > 7.5
                          ? "text-blue-400"
                          : "text-green-400"
                      }`}
                    >
                      {cropRecommendations.soil.ph < 6.5
                        ? "Acidic"
                        : cropRecommendations.soil.ph > 7.5
                        ? "Alkaline"
                        : "Neutral"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Fertility</p>
                    <p
                      className={`text-lg font-bold ${
                        cropRecommendations.soil.organicCarbon > 2
                          ? "text-green-400"
                          : cropRecommendations.soil.organicCarbon > 1
                          ? "text-yellow-400"
                          : "text-orange-400"
                      }`}
                    >
                      {cropRecommendations.soil.organicCarbon > 2
                        ? "High"
                        : cropRecommendations.soil.organicCarbon > 1
                        ? "Moderate"
                        : "Low"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Drainage</p>
                    <p
                      className={`text-lg font-bold ${
                        cropRecommendations.soil.sand > 60
                          ? "text-green-400"
                          : cropRecommendations.soil.clay > 40
                          ? "text-orange-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {cropRecommendations.soil.sand > 60
                        ? "Excellent"
                        : cropRecommendations.soil.clay > 40
                        ? "Poor"
                        : "Good"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Crops */}
              <div>
                <h3 className="text-emerald-400 font-bold text-xl mb-4 flex items-center space-x-2">
                  <span>🌾</span>
                  <span>Recommended Crops for Your Region</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {cropRecommendations.recommendedCrops.map((crop, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className={`p-5 rounded-xl border ${
                        crop.suitability === "Excellent"
                          ? "bg-gradient-to-br from-green-600/30 to-emerald-600/30 border-green-500/50"
                          : crop.suitability === "Good"
                          ? "bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/40"
                          : "bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{crop.icon}</span>
                          <h4 className="text-white font-bold text-lg">
                            {crop.name}
                          </h4>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            crop.suitability === "Excellent"
                              ? "bg-green-500/30 text-green-300"
                              : crop.suitability === "Good"
                              ? "bg-blue-500/30 text-blue-300"
                              : "bg-yellow-500/30 text-yellow-300"
                          }`}
                        >
                          {crop.suitability}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                        <span className="text-emerald-400 font-semibold">
                          Why:{" "}
                        </span>
                        {crop.reason}
                      </p>
                      <p className="text-gray-400 text-xs">
                        <span className="text-emerald-400 font-semibold">
                          Tip:{" "}
                        </span>
                        {crop.requirements}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Tips */}
              <div className="bg-gradient-to-br from-gray-900/80 to-emerald-950/40 p-6 rounded-2xl border border-emerald-500/20 mt-6">
                <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Regional Farming Tips</span>
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>
                      Consider crop rotation to maintain soil health and reduce
                      pest buildup
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>
                      Test soil annually for accurate nutrient management and pH
                      adjustment
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>
                      Use organic matter and compost to improve soil structure
                      and fertility
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>
                      Match planting dates with local climate patterns for
                      optimal yields
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {!cropRecommendations && !loadingCrops && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-400 text-lg">
                Get personalized crop recommendations based on your location
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {` We'll analyze soil properties and climate data to suggest the
                  best crops for your farm`}
              </p>
            </div>
          )}
        </motion.section>



        {/* Fertilizer Recommendation Engine */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-purple-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-purple-500/20 mb-16"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-8 text-center">
            🧪 Fertilizer Recommendation
          </h2>

          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="w-full max-w-md">
              <label className="text-gray-300 text-sm mb-2 block">
                Select Your Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">-- Choose Crop --</option>
                <option value="Wheat">🌾 Wheat</option>
                <option value="Rice">🌾 Rice</option>
                <option value="Potato">🥔 Potato</option>
                <option value="Tomato">🍅 Tomato</option>
                <option value="Sugarcane">🎋 Sugarcane</option>
                <option value="Corn">🌽 Corn/Maize</option>
              </select>
            </div>

            <button
              onClick={calculateFertilizer}
              disabled={!selectedCrop}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              🧮 Calculate Fertilizer Plan
            </button>
          </div>

          {fertilizerPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-2">
                  Fertilizer Plan For
                </p>
                <p className="text-3xl font-bold text-white flex items-center justify-center space-x-2">
                  <span>{fertilizerPlan.icon}</span>
                  <span>{fertilizerPlan.crop}</span>
                </p>
                <p className="text-purple-400 text-lg mt-2">
                  NPK Ratio: {fertilizerPlan.npk} kg/acre
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-xl border border-purple-500/40 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-purple-300 font-bold text-lg">
                    Estimated Cost
                  </h3>
                  <p className="text-3xl font-black text-white">
                    ₹{fertilizerPlan.totalCostPerAcre}/acre
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-purple-400 font-bold text-xl mb-4 flex items-center space-x-2">
                  <span>📅</span>
                  <span>Application Schedule</span>
                </h3>

                {fertilizerPlan.stages.map((stage, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="bg-gradient-to-br from-gray-800/80 to-purple-900/40 p-5 rounded-xl border border-purple-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-bold">{stage.stage}</h4>
                      <span className="text-purple-400 text-sm font-semibold">
                        {stage.timing}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-green-400 text-xs mb-1">
                          Nitrogen (N)
                        </p>
                        <p className="text-white font-bold">{stage.n} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-blue-400 text-xs mb-1">
                          Phosphorus (P)
                        </p>
                        <p className="text-white font-bold">{stage.p} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-orange-400 text-xs mb-1">
                          Potassium (K)
                        </p>
                        <p className="text-white font-bold">{stage.k} kg</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm">
                      <span className="text-purple-400 font-semibold">
                        Products:{" "}
                      </span>
                      {stage.products}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-purple-950/40 p-6 rounded-2xl border border-purple-500/20 mt-6">
                <h3 className="text-purple-400 font-bold text-lg mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Expert Tips</span>
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {fertilizerPlan.additionalTips.map((tip, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-5 rounded-xl border border-yellow-600/30">
                <p className="text-yellow-300 text-sm">
                  <span className="font-bold">⚠️ Important: </span>
                  These are general recommendations. Always conduct soil testing
                  for precise nutrient requirements and adjust doses
                  accordingly.
                </p>
              </div>
            </motion.div>
          )}

          {!fertilizerPlan && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🧪</div>
              <p className="text-gray-400 text-lg">
                Select a crop above to get customized fertilizer recommendations
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Get NPK ratios, application schedule, and cost estimates
              </p>
            </div>
          )}
        </motion.section>

        {/*SOIL INSTINGS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-green-950/50 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-green-500/20"
        >
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text mb-8 text-center">
            🌍 Soil Intelligence
          </h2>

          <div className="flex justify-center mb-8">
            <button
              onClick={fetchSoilInfo}
              disabled={loadingSoil}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loadingSoil ? "⏳ Analyzing..." : "🔄 Analyze Soil Data"}
            </button>
          </div>

          {loadingSoil && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
              <p className="text-green-400 font-medium">
                🌾 Fetching soil insights...
              </p>
            </motion.div>
          )}

          {soilInfo && !loadingSoil && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-5 rounded-xl border border-blue-500/30">
                  <div className="text-3xl mb-2">💧</div>
                  <p className="text-gray-400 text-sm">Soil Moisture</p>
                  <p className="text-2xl font-bold text-white">
                    {soilInfo.soilData.soilMoisture}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-5 rounded-xl border border-orange-500/30">
                  <div className="text-3xl mb-2">🌡️</div>
                  <p className="text-gray-400 text-sm">Temperature</p>
                  <p className="text-2xl font-bold text-white">
                    {soilInfo.soilData.temperature}°C
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-5 rounded-xl border border-purple-500/30">
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-gray-400 text-sm">Humidity</p>
                  <p className="text-2xl font-bold text-white">
                    {soilInfo.soilData.humidity}%
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-green-950/40 p-6 rounded-2xl border border-green-500/20">
                <h3 className="text-green-400 font-bold text-xl mb-4 flex items-center space-x-2">
                  <span>✨</span>
                  <span>Recommendations</span>
                </h3>
                <ul className="space-y-3">
                  {soilInfo.recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="flex items-start space-x-3 text-gray-300"
                    >
                      <span className="text-green-500 text-xl mt-0.5">✓</span>
                      <span className="leading-relaxed">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {!soilInfo && !loadingSoil && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-400 text-lg">
                Click the button above to analyze your soil data
              </p>
            </div>
          )}
        </motion.section>
      </div>
      {/*smart alers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-red-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-red-500/20 mb-16"
      >
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text mb-8 text-center">
          ⚡ Weather Smart Alerts
        </h2>

        <div className="flex justify-center mb-8">
          <button
            onClick={checkWeatherAlerts}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
          >
            🔔 Check Weather Alerts
          </button>
        </div>

        {weatherAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {weatherAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl border ${
                  alert.type === "danger"
                    ? "bg-red-600/20 border-red-500/50"
                    : alert.type === "warning"
                    ? "bg-orange-600/20 border-orange-500/50"
                    : alert.type === "success"
                    ? "bg-green-600/20 border-green-500/50"
                    : "bg-blue-600/20 border-blue-500/50"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">{alert.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">
                      {alert.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          alert.priority === "high"
                            ? "bg-red-500/30 text-red-300"
                            : alert.priority === "medium"
                            ? "bg-yellow-500/30 text-yellow-300"
                            : "bg-gray-500/30 text-gray-300"
                        }`}
                      >
                        {alert.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-gray-400 text-xs">
                        Action: {alert.action}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Crop Rotation Planner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-teal-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-teal-500/20 mb-16"
      >
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text mb-8 text-center">
          🔄 Crop Rotation Planner
        </h2>

        <div className="max-w-md mx-auto mb-8">
          <select
            onChange={(e) =>
              e.target.value && generateRotationPlan(e.target.value)
            }
            className="w-full px-4 py-3 bg-gray-800 border border-teal-500/30 rounded-xl text-white focus:outline-none focus:border-teal-500"
          >
            <option value="">-- Select Your Main Crop --</option>
            <option value="Wheat">🌾 Wheat</option>
            <option value="Rice">🌾 Rice</option>
            <option value="Potato">🥔 Potato</option>
            <option value="Cotton">🌸 Cotton</option>
          </select>
        </div>

        {rotationPlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-4 gap-4">
              {[
                rotationPlan.year1,
                rotationPlan.year2,
                rotationPlan.year3,
                rotationPlan.year4,
              ].map((year, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-teal-600/20 to-green-600/20 p-5 rounded-xl border border-teal-500/40 text-center"
                >
                  <p className="text-teal-400 text-sm font-semibold mb-2">
                    Year {i + 1}
                  </p>
                  <div className="text-4xl mb-2">{year.icon}</div>
                  <h4 className="text-white font-bold mb-2">{year.crop}</h4>
                  <p className="text-gray-400 text-xs mb-2">{year.season}</p>
                  <p className="text-gray-300 text-xs">{year.benefit}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-teal-950/40 p-6 rounded-2xl border border-teal-500/20">
              <h3 className="text-teal-400 font-bold text-lg mb-4 flex items-center space-x-2">
                <span>✨</span>
                <span>Benefits of This Rotation</span>
              </h3>
              <ul className="space-y-2">
                {rotationPlan.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-2 text-gray-300 text-sm"
                  >
                    <span className="text-teal-500 mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-teal-950/40 p-6 rounded-2xl border border-teal-500/20">
              <h3 className="text-teal-400 font-bold text-lg mb-4 flex items-center space-x-2">
                <span>💡</span>
                <span>Expert Tips</span>
              </h3>
              <ul className="space-y-2">
                {rotationPlan.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-2 text-gray-300 text-sm"
                  >
                    <span className="text-teal-500 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {!rotationPlan && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-gray-400 text-lg">
              Select your main crop to generate a 4-year rotation plan
            </p>
          </div>
        )}
      </motion.section>

      {/* Community Knowledge Base */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900/90 via-indigo-950/30 to-gray-900/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-indigo-500/20 mb-16"
      >
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text mb-8 text-center">
          👥 Community Knowledge Base
        </h2>

        <div className="mb-8">
          <input
            type="text"
            value={knowledgeSearch}
            onChange={(e) => setKnowledgeSearch(e.target.value)}
            placeholder="🔍 Search farming tips..."
            className="w-full px-4 py-3 bg-gray-800 border border-indigo-500/30 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredKnowledge.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-5 rounded-xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-indigo-400 text-xs font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <span>❤️</span>
                  <span>{item.likes}</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {item.content}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-400">{item.author}</span>
                <span className="text-gray-500">{item.region}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
