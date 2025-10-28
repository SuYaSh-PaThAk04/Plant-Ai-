import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import soilRoutes from "./routes/soil.routes.js";
import chatRoutes from "./routes/chatbot.route.js";
import walletRoutes from "./routes/wallet.Routes.js";
const app = express();


const allowedOrigins = [
  "http://localhost:3000",              // Local dev
  "https://plant-ai-557c.vercel.app/", 
  "https://plant-ai-1sxv.onrender.com/api/ai/analyze",// Deployed (example)
  "https://vercel.com/suyash-pathak04s-projects/plant-ai-557c/Acy8bRQBPhC2QUJGsNGgiktqG7uC"   // If you have multiple deployments
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ If using cookies or Authorization headers
  })
);
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api", chatRoutes);
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
