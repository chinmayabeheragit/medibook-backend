// Wraps async route handlers — no try/catch needed in controllers
// Any thrown error is passed to Express error handler automatically
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;