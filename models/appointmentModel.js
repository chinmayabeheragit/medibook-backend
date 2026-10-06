import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",        // was String — now proper ObjectId ref
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",      // was String — now proper ObjectId ref
      required: true,
    },
    slotDate: {
      type: String,       // keep as "YYYY-MM-DD" string for slot matching
      required: true,
    },
    slotTime: {
      type: String,       // "10:00 AM"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      // Replaces 3 separate booleans (cancelled, payment, isCompleted)
      // Single source of truth for appointment state
      type: String,
      enum: [
        "pending",    // booked, not yet confirmed
        "confirmed",  // doctor confirmed
        "completed",  // appointment done
        "cancelled",  // cancelled by user or admin
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe", "cash"],
      default: "cash",
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true, // only enforces uniqueness on non-null values
    },
    cancelledAt:  { type: Date, default: null },
    completedAt:  { type: Date, default: null },
    cancelReason: { type: String, default: "" },
    // NOTE: userData and docData removed entirely
    // Use .populate("userId", "name email phone")
    // and .populate("doctorId", "name speciality fees image")
    // This means doctor/user updates reflect in all appointments automatically
  },
  {
    timestamps: true, // createdAt = booking time
  }
);

// Indexes for common query patterns
appointmentSchema.index({ userId: 1, createdAt: -1 });   // user's appointment history
appointmentSchema.index({ doctorId: 1, slotDate: 1 });   // doctor's schedule by date
appointmentSchema.index({ status: 1 });                   // filter by status
appointmentSchema.index({ idempotencyKey: 1 });           // fast idempotency check

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;