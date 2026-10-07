// No magic strings anywhere in the codebase

export const ROLES = {
  USER:   "user",
  DOCTOR: "doctor",
  ADMIN:  "admin",
};

export const APPOINTMENT_STATUS = {
  PENDING:   "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  UNPAID:   "unpaid",
  PAID:     "paid",
  REFUNDED: "refunded",
};

export const EVENTS = {
  APPOINTMENT_BOOKED:    "appointment.booked",
  APPOINTMENT_CANCELLED: "appointment.cancelled",
  APPOINTMENT_COMPLETED: "appointment.completed",
};

export const HTTP = {
  OK:           200,
  CREATED:      201,
  BAD_REQUEST:  400,
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  CONFLICT:     409,
  SERVER_ERROR: 500,
};