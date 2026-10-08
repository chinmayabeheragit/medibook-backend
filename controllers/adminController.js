import adminService from "../services/admin.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import logger from "../utils/logger.js";

// POST /api/admin/login
export const loginAdmin = asyncHandler(async (req, res) => {
  logger.info({ email: req.body.email }, "Admin login attempt");
  const result = await adminService.login(req.body);
  apiResponse.success(res, result, "Login successful");
});

// POST /api/admin/doctors
export const addDoctor = asyncHandler(async (req, res) => {
  logger.info({ body: req.body, hasFile: !!req.file }, "addDoctor called");
  const doctor = await adminService.addDoctor(req.body, req.file);
  apiResponse.created(res, doctor, "Doctor added successfully");
});

// GET /api/admin/doctors
export const getAllDoctors = asyncHandler(async (req, res) => {
  logger.info("getAllDoctors called");
  const doctors = await adminService.getAllDoctors();
  apiResponse.success(res, doctors);
});

// GET /api/admin/appointments
export const getAllAppointments = asyncHandler(async (req, res) => {
  logger.info({ status: req.query.status }, "getAllAppointments called");
  const { status } = req.query;
  const appointments = await adminService.getAllAppointments(status ? { status } : {});
  apiResponse.success(res, appointments);
});

// PUT /api/admin/appointments/:id/cancel
export const cancelAppointment = asyncHandler(async (req, res) => {
  logger.info({ appointmentId: req.params.id }, "cancelAppointment called");
  const appointment = await adminService.cancelAppointment(req.params.id);
  apiResponse.success(res, appointment, "Appointment cancelled");
});

// GET /api/admin/dashboard
export const getAdminDashboard = asyncHandler(async (req, res) => {
  logger.info("getAdminDashboard called");
  const data = await adminService.getDashboard();
  apiResponse.success(res, data);
});

// PUT /api/admin/doctors/:id/availability
export const toggleDoctorAvailability = asyncHandler(async (req, res) => {
  logger.info({ doctorId: req.params.id }, "toggleDoctorAvailability called");
  const doctor = await adminService.toggleDoctorAvailability(req.params.id);
  apiResponse.success(res, doctor, "Availability updated");
});