import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import doctorRepository from "../repositories/doctor.repository.js";
import appointmentRepository from "../repositories/appointment.repository.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const doctorService = {
  login: async ({ email, password }) => {
    if (!email || !password) throw new AppError("Email and password required", 400);

    const doctor = await doctorRepository.findByEmail(email);
    if (!doctor) throw new AppError("Invalid credentials", 401);
    if (!doctor.isActive) throw new AppError("Account deactivated. Contact admin.", 403);

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, doctor: { id: doctor._id, name: doctor.name, speciality: doctor.speciality } };
  },

  getProfile: async (doctorId) => {
    const doctor = await doctorRepository.findById(doctorId);
    if (!doctor) throw new AppError("Doctor not found", 404);
    return doctor;
  },

  updateProfile: async (doctorId, updates) => {
    const { fees, address, available } = updates;
    const updateData = {};
    if (fees !== undefined)      updateData.fees      = Number(fees);
    if (address !== undefined)   updateData.address   = typeof address === "string" ? JSON.parse(address) : address;
    if (available !== undefined) updateData.available = available;

    const doctor = await doctorRepository.updateById(doctorId, updateData);
    if (!doctor) throw new AppError("Doctor not found", 404);
    return doctor;
  },

  getAppointments: async (doctorId) => {
    return appointmentRepository.findByDoctorId(doctorId);
  },

  cancelAppointment: async (doctorId, appointmentId) => {
    const appointment = await appointmentRepository.findByIdRaw(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    // Compare ObjectIds correctly
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      throw new AppError("Unauthorized", 403);
    }
    if (appointment.status === "cancelled") {
      throw new AppError("Appointment already cancelled", 400);
    }

    return appointmentRepository.updateById(appointmentId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });
  },

  completeAppointment: async (doctorId, appointmentId) => {
    const appointment = await appointmentRepository.findByIdRaw(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    if (appointment.doctorId.toString() !== doctorId.toString()) {
      throw new AppError("Unauthorized", 403);
    }
    if (appointment.status !== "confirmed") {
      throw new AppError("Only confirmed appointments can be completed", 400);
    }

    return appointmentRepository.updateById(appointmentId, {
      status: "completed",
      completedAt: new Date(),
    });
  },

  getDashboard: async (doctorId) => {
    const [stats, latestAppointments] = await Promise.all([
      appointmentRepository.getDoctorStats(doctorId),
      appointmentRepository.findByDoctorId(doctorId),
    ]);

    return {
      earnings:           stats.earnings,
      totalAppointments:  stats.totalAppointments,
      totalPatients:      stats.totalPatients,
      latestAppointments: latestAppointments.slice(0, 10),
    };
  },

  getAllDoctors: async (filters = {}) => {
    return doctorRepository.findAll(filters);
  },

  toggleAvailability: async (doctorId) => {
    const doctor = await doctorRepository.toggleAvailability(doctorId);
    if (!doctor) throw new AppError("Doctor not found", 404);
    return doctor;
  },
};

export default doctorService;