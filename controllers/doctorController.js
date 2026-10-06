import doctorService from "../services/doctor.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

// POST /api/doctors/login
export const loginDoctor = asyncHandler(async (req, res) => {
  const result = await doctorService.login(req.body);
  apiResponse.success(res, result, "Login successful");
});

// GET /api/doctors/profile
export const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getProfile(req.body.docId);
  apiResponse.success(res, doctor);
});

// PUT /api/doctors/profile
export const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateProfile(req.body.docId, req.body);
  apiResponse.success(res, doctor, "Profile updated");
});

// GET /api/doctors/appointments
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await doctorService.getAppointments(req.body.docId);
  apiResponse.success(res, appointments);
});

// PUT /api/doctors/appointments/:id/cancel
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await doctorService.cancelAppointment(req.body.docId, req.params.id);
  apiResponse.success(res, appointment, "Appointment cancelled");
});

// PUT /api/doctors/appointments/:id/complete
export const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await doctorService.completeAppointment(req.body.docId, req.params.id);
  apiResponse.success(res, appointment, "Appointment completed");
});

// GET /api/doctors/dashboard
export const getDoctorDashboard = asyncHandler(async (req, res) => {
  const data = await doctorService.getDashboard(req.body.docId);
  apiResponse.success(res, data);
});

// GET /api/doctors/list  [public]
export const getDoctorList = asyncHandler(async (req, res) => {
  const { speciality } = req.query;
  const filters = speciality ? { speciality } : {};
  const doctors = await doctorService.getAllDoctors(filters);
  apiResponse.success(res, doctors);
});

// PUT /api/doctors/availability
export const toggleAvailability = asyncHandler(async (req, res) => {
  const doctor = await doctorService.toggleAvailability(req.body.docId);
  apiResponse.success(res, doctor, "Availability updated");
});