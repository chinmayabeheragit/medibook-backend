import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
    {
        wardType: {
            type: String,
            enum: ["general", "private", "ICU", "ventilator", "maternity"],
            required: true,
        },
        wardNumber: { type: String, required: true },
        bedNumber: { type: String, required: true, unique: true },
        isOccupied: { type: Boolean, default: false },
        occupiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        admittedAt: { type: Date, default: null },
        dischargedAt: { type: Date, default: null },
        pricePerDay: { type: Number, required: true },
        floor: { type: String, default: "" },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

bedSchema.index({ wardType: 1, isOccupied: 1 });

const bedModel = mongoose.models.bed || mongoose.model("bed", bedSchema);
export default bedModel;