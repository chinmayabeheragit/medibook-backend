import logger from "../utils/logger.js";

// Global error handler — catches all errors thrown in controllers/services
// Must have 4 params for Express to recognize it as error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.isOperational ? err.message : "Internal server error";

  logger.error({
    err: {
      message: err.message,
      stack:   err.stack,
      statusCode,
    },
    req: {
      method: req.method,
      url:    req.originalUrl,
      body:   req.body,
    },
  }, "Request error");

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;