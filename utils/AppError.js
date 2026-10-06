// Custom error class — thrown in services, caught by errorHandler middleware
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // operational errors vs programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;