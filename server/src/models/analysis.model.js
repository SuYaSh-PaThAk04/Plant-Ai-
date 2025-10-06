import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    image: { type: String, required: true }, // store base64 for demo
    disease: { type: String, required: true },
    recommendation: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "analyses" }
);

export default mongoose.model("Analysis", analysisSchema);
