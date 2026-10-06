import doctorModel from "../models/doctor.model.js";

const doctorRepository = {
  findByEmail: (email) =>
    doctorModel.findOne({ email: email.toLowerCase() }),

  findById: (id) =>
    doctorModel.findById(id).select("-password"),

  findByIdWithPassword: (id) =>
    doctorModel.findById(id),

  create: (data) =>
    doctorModel.create(data),

  updateById: (id, updates) =>
    doctorModel.findByIdAndUpdate(id, updates, { new: true }).select("-password"),

  findAll: (filter = {}) =>
    doctorModel.find({ isActive: true, ...filter }).select("-password -email"),

  findAllForAdmin: () =>
    doctorModel.find({ isActive: true }).select("-password"),

  toggleAvailability: async (id) => {
    const doctor = await doctorModel.findById(id);
    if (!doctor) return null;
    return doctorModel.findByIdAndUpdate(
      id,
      { available: !doctor.available },
      { new: true }
    ).select("-password");
  },

  countAll: () =>
    doctorModel.countDocuments({ isActive: true }),
};

export default doctorRepository;