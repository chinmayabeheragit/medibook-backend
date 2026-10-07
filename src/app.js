import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "../routes/index.js";
import errorHandler from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "atoken", "dtoken", "idempotency-key"],
}));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many requests. Try again later." },
});
app.use("/api/users/login",    authLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/admin/login",    authLimiter);
app.use("/api/doctors/login",  authLimiter);

// HTTP request logging
app.use(morgan("combined", {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, service: "medibook-core-service", status: "healthy" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;