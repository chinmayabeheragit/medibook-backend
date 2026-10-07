import express from "express";
import userRoutes from "../routes/userRoute.js";
import doctorRoutes from "../routes/doctorRoute.js";
import adminRoutes from "../routes/adminRoute.js";

const router = express.Router();

router.use("/users",   userRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admin",   adminRoutes);

export default router;