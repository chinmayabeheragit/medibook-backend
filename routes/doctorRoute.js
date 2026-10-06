import express from "express";
import authDoctor from "../middlewares/authDoctor.js";
import {
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  cancelAppointment,
  completeAppointment,
  getDoctorDashboard,
  getDoctorList,
  toggleAvailability,
} from "../controllers/doctor.controller.js";

const router = express.Router();

// Public
router.post("/login", loginDoctor);
router.get("/list",   getDoctorList); // ?speciality=Cardiologist

// Protected
router.get("/profile",                      authDoctor, getDoctorProfile);
router.put("/profile",                      authDoctor, updateDoctorProfile);
router.get("/appointments",                 authDoctor, getDoctorAppointments);
router.put("/appointments/:id/cancel",      authDoctor, cancelAppointment);
router.put("/appointments/:id/complete",    authDoctor, completeAppointment);
router.get("/dashboard",                    authDoctor, getDoctorDashboard);
router.put("/availability",                 authDoctor, toggleAvailability);

export default router;