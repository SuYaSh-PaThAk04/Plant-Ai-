import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    crop: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    contact: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Buyer", buyerSchema);
