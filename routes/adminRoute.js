import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  loginAdmin,
  addDoctor,
  getAllDoctors,
  getAllAppointments,
  cancelAppointment,
  getAdminDashboard,
  toggleDoctorAvailability,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public
router.post("/login", loginAdmin);

// Protected
router.post("/doctors",                         authAdmin, upload.single("image"), addDoctor);
router.get("/doctors",                          authAdmin, getAllDoctors);
router.put("/doctors/:id/availability",         authAdmin, toggleDoctorAvailability);
router.get("/appointments",                     authAdmin, getAllAppointments); // ?status=pending
router.put("/appointments/:id/cancel",          authAdmin, cancelAppointment);
router.get("/dashboard",                        authAdmin, getAdminDashboard);

export default router;