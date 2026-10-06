import adminService from "../services/admin.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

// POST /api/admin/login
export const loginAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.login(req.body);
  apiResponse.success(res, result, "Login successful");
});

// POST /api/admin/doctors
export const addDoctor = asyncHandler(async (req, res) => {
  const doctor = await adminService.addDoctor(req.body, req.file);
  apiResponse.created(res, doctor, "Doctor added successfully");
});

// GET /api/admin/doctors
export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await adminService.getAllDoctors();
  apiResponse.success(res, doctors);
});

// GET /api/admin/appointments
export const getAllAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const appointments = await adminService.getAllAppointments(status ? { status } : {});
  apiResponse.success(res, appointments);
});

// PUT /api/admin/appointments/:id/cancel
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await adminService.cancelAppointment(req.params.id);
  apiResponse.success(res, appointment, "Appointment cancelled");
});

// GET /api/admin/dashboard
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboard();
  apiResponse.success(res, data);
});

// PUT /api/admin/doctors/:id/availability
export const toggleDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await adminService.toggleDoctorAvailability(req.params.id);
  apiResponse.success(res, doctor, "Availability updated");
});