import doctorRepository from "../repositories/doctor.repository.js";
import appointmentRepository from "../repositories/appointment.repository.js";
import { publishAppointmentBooked, publishAppointmentCancelled } from "../events/publishers/appointment.publisher.js";
import AppError from "../utils/AppError.js";

const appointmentService = {
  book: async ({ userId, doctorId, slotDate, slotTime, idempotencyKey }) => {
    // Idempotency check — same request sent twice returns original result
    if (idempotencyKey) {
      const existing = await appointmentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) return existing;
    }

    const doctor = await doctorRepository.findById(doctorId);
    if (!doctor) throw new AppError("Doctor not found", 404);
    if (!doctor.available) throw new AppError("Doctor is not available", 400);

    // Check if slot is already booked
    const slotTaken = doctor.slots.some(
      (s) => s.date === slotDate && s.time === slotTime && s.isBooked
    );
    if (slotTaken) throw new AppError("Slot not available", 400);

    // Mark slot as booked
    await doctorRepository.updateById(doctorId, {
      $set: {
        "slots.$[slot].isBooked": true,
      },
    }, {
      arrayFilters: [{ "slot.date": slotDate, "slot.time": slotTime }],
    });

    const appointment = await appointmentRepository.create({
      userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees,
      status: "confirmed",
      idempotencyKey,
    });

    // Publish to RabbitMQ — Notification Service will send confirmation
    // Wrapped in try/catch inside publisher — never blocks booking response
    await publishAppointmentBooked(appointment);

    return appointment;
  },

  cancel: async (userId, appointmentId, cancelReason = "") => {
    const appointment = await appointmentRepository.findByIdRaw(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);

    if (appointment.userId.toString() !== userId.toString()) {
      throw new AppError("Unauthorized", 403);
    }
    if (["cancelled", "completed"].includes(appointment.status)) {
      throw new AppError(`Cannot cancel a ${appointment.status} appointment`, 400);
    }

    // Free up the slot
    await doctorRepository.updateById(appointment.doctorId, {
      $set: { "slots.$[slot].isBooked": false },
    }, {
      arrayFilters: [
        { "slot.date": appointment.slotDate, "slot.time": appointment.slotTime }
      ],
    });

    const updated = await appointmentRepository.updateById(appointmentId, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason,
    });

    await publishAppointmentCancelled(updated);
    return updated;
  },

  getUserAppointments: async (userId) => {
    return appointmentRepository.findByUserId(userId);
  },

  getById: async (appointmentId) => {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);
    return appointment;
  },
};

export default appointmentService;