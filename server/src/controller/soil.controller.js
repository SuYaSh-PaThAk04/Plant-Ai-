export const analyzeSoil = (req, res) => {
  try {
    const { soilMoisture, temperature, humidity } = req.body;

    let advice = [];
    if (soilMoisture < 40) advice.push("Irrigation needed soon 💧");
    if (temperature > 32) advice.push("High temp, consider shade nets 🌡️");
    if (humidity < 50) advice.push("Low humidity, spray water mist ☁️");

    res.json({
      soilData: { soilMoisture, temperature, humidity },
      recommendations:
        advice.length > 0 ? advice : ["Soil conditions are good ✅"],
    });
  } catch (err) {
    res.status(500).json({ error: "Error analyzing soil data" });
  }
};
