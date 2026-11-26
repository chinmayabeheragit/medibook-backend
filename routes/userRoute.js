import express from "express";
import multer from "multer";
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
import { scanPrescription } from "../controllers/ocrController.js";


const router = express.Router();
const memoryUpload = multer({ storage: multer.memoryStorage() });


// Public
router.post("/register", registerUser);
router.post("/login",    loginUser);

// Protected
router.get("/profile",                    authUser, getProfile);
router.put("/profile",                    authUser, upload.single("image"), updateProfile);
router.post("/appointments/book",         authUser, bookAppointment);
router.get("/appointments",               authUser, getMyAppointments);
router.put("/appointments/:id/cancel",    authUser, cancelAppointment);
router.post("/scan-prescription",           authUser, memoryUpload.single("image"), scanPrescription);


export default router;