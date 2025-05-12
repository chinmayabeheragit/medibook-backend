import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "medicine" },
      quantity: { type: Number, default: 1 }
    }
  ]
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);
export default cartModel;
