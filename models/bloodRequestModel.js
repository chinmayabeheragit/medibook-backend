import mongoose from "mongoose";

// Separate from donor — this is the urgent request that triggers alerts
const bloodRequestSchema = new mongoose.Schema(
    {
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        patientName: { type: String, required: true },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        unitsRequired: { type: Number, required: true, min: 1 },
        hospital: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
        contactPhone: { type: String, required: true },
        urgency: {
            type: String,
            enum: ["critical", "urgent", "normal"],
            default: "urgent",
        },
        status: {
            type: String,
            enum: ["open", "fulfilled", "expired", "cancelled"],
            default: "open",
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        },
        respondedDonors: [
            {
                donorId: { type: mongoose.Schema.Types.ObjectId, ref: "bloodDonor" },
                respondedAt: { type: Date, default: Date.now },
            },
        ],
        notifiedDonorsCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

bloodRequestSchema.index({ bloodGroup: 1, city: 1, status: 1 });
bloodRequestSchema.index({ status: 1, expiresAt: 1 });
bloodRequestSchema.index({ coordinates: "2dsphere" });

const bloodRequestModel =
    mongoose.models.bloodRequest ||
    mongoose.model("bloodRequest", bloodRequestSchema);
export default bloodRequestModel;