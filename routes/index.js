import express from "express";
import userRoutes from "./user.routes.js";
import doctorRoutes from "./doctor.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/users",   userRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admin",   adminRoutes);

export default router;