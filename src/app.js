import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "../routes/index.js";
import errorHandler from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { metricsMiddleware, register } from "../middlewares/metrics.middleware.js";
import { correlationIdMiddleware } from "../middlewares/correlationId.middleware.js";


const app = express();

// Security headers
app.use(helmet());
app.use(correlationIdMiddleware);
// Metrics middleware
app.use(metricsMiddleware);

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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
// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      correlationId: req.correlationId,
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      userAgent: req.headers['user-agent'],
    }, 'HTTP Request');
  });
  next();
});

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