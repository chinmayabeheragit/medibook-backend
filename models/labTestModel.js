import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        testName: { type: String, required: true },
        category: {
            type: String,
            enum: ["blood", "urine", "imaging", "pathology", "cardiology", "other"],
            required: true,
        },
        scheduledDate: { type: String, required: true }, // "YYYY-MM-DD"
        scheduledTime: { type: String, required: true }, // "10:00 AM"
        status: {
            type: String,
            enum: ["booked", "sample_collected", "processing", "completed", "cancelled"],
            default: "booked",
        },
        amount: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid",
        },
        resultUrl: { type: String, default: null },      // Cloudinary PDF URL
        extractedData: { type: mongoose.Schema.Types.Mixed, default: null }, // OCR extracted values
        notes: { type: String, default: "" },
        isHomeCollection: { type: Boolean, default: false },
        address: {
            line1: { type: String, default: "" },
            line2: { type: String, default: "" },
            city: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

labTestSchema.index({ userId: 1, createdAt: -1 });
labTestSchema.index({ status: 1 });

const labTestModel =
    mongoose.models.labTest || mongoose.model("labTest", labTestSchema);
export default labTestModel;