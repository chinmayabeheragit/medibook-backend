import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city:  { type: String, default: "" },
    state: { type: String, default: "" },
    zip:   { type: String, default: "" },
  },
  { _id: false } // embedded subdocument, no separate _id needed
);

const userSchema = new mongoose.Schema(
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
      minlength: [8, "Password must be at least 8 characters"],
    },
    phone: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "", // empty string — frontend serves default avatar
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Selected"],
      default: "Not Selected",
    },
    dob: {
      type: Date, // was String — now proper Date
      default: null,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true, // soft delete — never hard delete users
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Never return password in queries unless explicitly selected
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;