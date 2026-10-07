import userModel from "../models/userModel.js";

// All MongoDB queries for users live here
// Services never touch userModel directly

const userRepository = {
  findByEmail: (email) =>
    userModel.findOne({ email: email.toLowerCase() }),

  findById: (id) =>
    userModel.findById(id).select("-password"),

  findByIdWithPassword: (id) =>
    userModel.findById(id),

  create: (data) =>
    userModel.create(data),

  updateById: (id, updates) =>
    userModel.findByIdAndUpdate(id, updates, { new: true }).select("-password"),

  findAll: () =>
    userModel.find({ isActive: true }).select("-password"),

  deactivate: (id) =>
    userModel.findByIdAndUpdate(id, { isActive: false }, { new: true }),
};

export default userRepository;