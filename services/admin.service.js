import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import doctorRepository from "../repositories/doctor.repository.js";
import userRepository from "../repositories/user.repository.js";
import appointmentRepository from "../repositories/appointment.repository.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const adminService = {
  login: async ({ email, password }) => {
    if (!email || !password) throw new AppError("Email and password required", 400);

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  },

  addDoctor: async (doctorData, imageFile) => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = doctorData;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
      throw new AppError("All fields are required", 400);
    }
    if (!validator.isEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }
    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const existing = await doctorRepository.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    let imageUrl = "";
    if (imageFile) {
      const result = await uploadToCloudinary(imageFile.buffer, "medibook/doctors");
      imageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await doctorRepository.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience: Number(experience),
      about,
      fees: Number(fees),
      address: typeof address === "string" ? JSON.parse(address) : address,
    });

    return { id: doctor._id, name: doctor.name, speciality: doctor.speciality };
  },

  getAllDoctors: async () => {
    return doctorRepository.findAllForAdmin();
  },

  getAllAppointments: async (filters = {}) => {
    return appointmentRepository.findAll(filters);
  },

  cancelAppointment: async (appointmentId) => {
    const appointment = await appointmentRepository.findByIdRaw(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    return appointmentRepository.updateById(appointmentId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });
  },

  getDashboard: async () => {
    // Parallel DB calls — faster than sequential
    const [doctorCount, userCount, appointmentStats] = await Promise.all([
      doctorRepository.countAll(),
      userRepository.findAll().then((u) => u.length),
      appointmentRepository.getAdminStats(),
    ]);

    const latestAppointments = await appointmentRepository.findAll({});

    return {
      doctors:             doctorCount,
      patients:            userCount,
      appointments:        appointmentStats.total || 0,
      latestAppointments:  latestAppointments.slice(0, 10),
    };
  },

  toggleDoctorAvailability: async (doctorId) => {
    return doctorRepository.toggleAvailability(doctorId);
  },
};

export default adminService;