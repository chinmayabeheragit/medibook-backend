import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null, // null for anonymous SOS
        },
        contactName: { type: String, required: true },
        contactPhone: { type: String, required: true },
        pickupAddress: {
            line1: { type: String, required: true },
            city: { type: String, required: true },
            coordinates: {
                lat: { type: Number, default: null },
                lng: { type: Number, default: null },
            },
        },
        emergencyType: {
            type: String,
            enum: ["accident", "cardiac", "maternity", "general", "other"],
            default: "general",
        },
        status: {
            type: String,
            enum: ["requested", "dispatched", "arrived", "completed", "cancelled"],
            default: "requested",
        },
        ambulanceNumber: { type: String, default: null },
        driverName: { type: String, default: null },
        driverPhone: { type: String, default: null },
        dispatchedAt: { type: Date, default: null },
        arrivedAt: { type: Date, default: null },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

ambulanceRequestSchema.index({ status: 1, createdAt: -1 });
ambulanceRequestSchema.index({ userId: 1 });

const ambulanceModel =
    mongoose.models.ambulanceRequest ||
    mongoose.model("ambulanceRequest", ambulanceRequestSchema);
export default ambulanceModel;