import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import soilRoutes from "./routes/soil.routes.js";
import chatRoutes from "./routes/chatbot.route.js";
import walletRoutes from "./routes/wallet.Routes.js";
const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "https://plant-ai-557c.vercel.app",
  "https://plant-ai-ten.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or same-origin
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) // allow all vercel preview URLs
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api", chatRoutes);
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
