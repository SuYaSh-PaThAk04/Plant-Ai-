import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();


connectDB();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
