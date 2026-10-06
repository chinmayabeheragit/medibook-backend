import appointmentModel from "../models/appointment.model.js";

const appointmentRepository = {
  create: (data) =>
    appointmentModel.create(data),

  findById: (id) =>
    appointmentModel
      .findById(id)
      .populate("userId", "name email phone image")
      .populate("doctorId", "name speciality fees image address"),

  findByIdRaw: (id) =>
    appointmentModel.findById(id),

  findByIdempotencyKey: (key) =>
    appointmentModel.findOne({ idempotencyKey: key }),

  findByUserId: (userId) =>
    appointmentModel
      .find({ userId })
      .populate("doctorId", "name speciality fees image")
      .sort({ createdAt: -1 }),

  findByDoctorId: (doctorId, filters = {}) =>
    appointmentModel
      .find({ doctorId, ...filters })
      .populate("userId", "name email phone image")
      .sort({ createdAt: -1 }),

  findAll: (filters = {}) =>
    appointmentModel
      .find(filters)
      .populate("userId", "name email")
      .populate("doctorId", "name speciality")
      .sort({ createdAt: -1 }),

  updateById: (id, updates) =>
    appointmentModel.findByIdAndUpdate(id, updates, { new: true }),

  // Aggregation for doctor dashboard — one DB call instead of JS loops
  getDoctorStats: async (doctorId) => {
    const result = await appointmentModel.aggregate([
      { $match: { doctorId } },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          earnings: {
            $sum: {
              $cond: [
                { $in: ["$status", ["completed"]] },
                "$amount",
                0,
              ],
            },
          },
          uniquePatients: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          totalAppointments: 1,
          earnings: 1,
          totalPatients: { $size: "$uniquePatients" },
        },
      },
    ]);
    return result[0] || { totalAppointments: 0, earnings: 0, totalPatients: 0 };
  },

  // Aggregation for admin dashboard
  getAdminStats: async () => {
    const [appointmentStats] = await appointmentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    return appointmentStats || { total: 0 };
  },

  countAll: () =>
    appointmentModel.countDocuments(),
};

export default appointmentRepository;