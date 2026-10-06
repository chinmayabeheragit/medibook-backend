import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city:  { type: String, default: "" },
    state: { type: String, default: "" },
    zip:   { type: String, default: "" },
  },
  { _id: false }
);

// Each slot: a specific date + time combination
// Instead of storing slots as a dynamic Object (unqueryable),
// we store them as an array of structured documents
const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "2026-10-06"
    time: { type: String, required: true }, // "10:00"
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
    },
    experience: {
      type: Number, // was String — now Number (years)
      required: [true, "Experience is required"],
      min: 0,
    },
    about: {
      type: String,
      required: [true, "About is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees is required"],
      min: 0,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    available: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true, // soft delete
    },
    role: {
      type: String,
      default: "doctor",
      immutable: true, // role can never be changed after creation
    },
    // Replaces the dynamic Object slots_booked
    // Array of structured slot documents — queryable and indexable
    slots: {
      type: [slotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast availability queries
doctorSchema.index({ speciality: 1, available: 1 });

// Never return password in queries
doctorSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;