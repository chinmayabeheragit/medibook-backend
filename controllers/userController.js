import userService from "../services/user.service.js";
import appointmentService from "../services/appointment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";

// POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const result = await userService.register(req.body);
  apiResponse.created(res, result, "Registration successful");
});

// POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const result = await userService.login(req.body);
  apiResponse.success(res, result, "Login successful");
});

// GET /api/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.body.userId);
  apiResponse.success(res, user);
});

// PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.body.userId, req.body, req.file);
  apiResponse.success(res, user, "Profile updated");
});

// POST /api/users/appointments/book
export const bookAppointment = asyncHandler(async (req, res) => {
  const { userId, doctorId, slotDate, slotTime } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  const appointment = await appointmentService.book({
    userId,
    doctorId,
    slotDate,
    slotTime,
    idempotencyKey,
  });

  apiResponse.created(res, appointment, "Appointment booked successfully");
});

// GET /api/users/appointments
export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getUserAppointments(req.body.userId);
  apiResponse.success(res, appointments);
});

// PUT /api/users/appointments/:id/cancel
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancel(
    req.body.userId,
    req.params.id,
    req.body.cancelReason
  );
  apiResponse.success(res, appointment, "Appointment cancelled");
});