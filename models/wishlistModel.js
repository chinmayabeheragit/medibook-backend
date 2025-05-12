import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "medicine" }]
});

const wishlistModel = mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);
export default wishlistModel;
