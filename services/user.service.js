import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const userService = {
  register: async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }
    if (!validator.isEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }
    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  },

  login: async ({ email, password }) => {
    if (!email || !password) throw new AppError("Email and password required", 400);

    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);
    if (!user.isActive) throw new AppError("Account deactivated. Contact support.", 403);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  },

  getProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },

  updateProfile: async (userId, updates, imageFile) => {
    const { name, phone, address, dob, gender } = updates;

    const updateData = {};
    if (name)    updateData.name    = name;
    if (phone)   updateData.phone   = phone;
    if (address) updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    if (dob)     updateData.dob     = new Date(dob);
    if (gender)  updateData.gender  = gender;

    if (imageFile) {
      const result = await uploadToCloudinary(imageFile.buffer, "medibook/users");
      updateData.image = result.secure_url;
    }

    const user = await userRepository.updateById(userId, updateData);
    if (!user) throw new AppError("User not found", 404);
    return user;
  },
};

export default userService;