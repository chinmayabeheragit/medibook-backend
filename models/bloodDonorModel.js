import mongoose from "mongoose";

const bloodDonorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true, // one donor profile per user
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        city: { type: String, required: true },
        state: { type: String, default: "" },
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        },
        isAvailable: { type: Boolean, default: true },
        lastDonatedAt: { type: Date, default: null },
        totalDonations: { type: Number, default: 0 },
        contactPhone: { type: String, required: true },
        notificationsEnabled: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Fast lookup by blood group + city for alert matching
bloodDonorSchema.index({ bloodGroup: 1, city: 1, isAvailable: 1 });
bloodDonorSchema.index({ coordinates: "2dsphere" }); // geospatial queries

const bloodDonorModel =
    mongoose.models.bloodDonor || mongoose.model("bloodDonor", bloodDonorSchema);
export default bloodDonorModel;