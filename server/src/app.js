import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";
import soilRoutes from "./routes/soil.routes.js";
import chatRoutes from "./routes/chatbot.route.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
