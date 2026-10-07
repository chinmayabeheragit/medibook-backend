import express from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/authUser.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/userController.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login",    loginUser);

// Protected
router.get("/profile",                    authUser, getProfile);
router.put("/profile",                    authUser, upload.single("image"), updateProfile);
router.post("/appointments/book",         authUser, bookAppointment);
router.get("/appointments",               authUser, getMyAppointments);
router.put("/appointments/:id/cancel",    authUser, cancelAppointment);

export default router;