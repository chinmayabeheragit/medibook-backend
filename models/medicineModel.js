import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String },
  category: { type: String },
  pharmacyLocation: {
    latitude: Number,
    longitude: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const medicineModel = mongoose.models.medicine || mongoose.model("medicine", medicineSchema);
export default medicineModel;
