import doctorRepository from "../repositories/doctor.repository.js";
import appointmentRepository from "../repositories/appointment.repository.js";
import { publishAppointmentBooked, publishAppointmentCancelled } from "../events/publishers/appointment.publisher.js";
import AppError from "../utils/AppError.js";
import cache from "../utils/cache.js";

const CACHE_KEYS = {
  doctorList: (speciality) => `doctors:list:${speciality || "all"}`,
  doctorProfile: (id) => `doctors:profile:${id}`,
};

const appointmentService = {
  book: async ({ userId, doctorId, slotDate, slotTime, idempotencyKey }) => {
    if (idempotencyKey) {
      const existing = await appointmentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) return existing;
    }

    const doctor = await doctorRepository.findById(doctorId);
    if (!doctor) throw new AppError("Doctor not found", 404);
    if (!doctor.available) throw new AppError("Doctor is not available", 400);

    const slotTaken = doctor.slots.some(
      (s) => s.date === slotDate && s.time === slotTime && s.isBooked
    );
    if (slotTaken) throw new AppError("Slot not available", 400);

    await doctorRepository.updateSlot(doctorId, {
      $set: { "slots.$[slot].isBooked": true },
    }, [{ "slot.date": slotDate, "slot.time": slotTime }]);

    const appointment = await appointmentRepository.create({
      userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees,
      status: "confirmed",
      idempotencyKey,
    });

    // Slot is now booked — cached doctor profile/list has stale slot data
    await cache.del(
      CACHE_KEYS.doctorProfile(doctorId),
      CACHE_KEYS.doctorList(),
      CACHE_KEYS.doctorList(doctor.speciality)
    );

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

    // Fetch doctor before freeing slot (need speciality for cache key)
    const doctor = await doctorRepository.findById(appointment.doctorId);

    await doctorRepository.updateSlot(appointment.doctorId, {
      $set: { "slots.$[slot].isBooked": false },
    }, [{ "slot.date": appointment.slotDate, "slot.time": appointment.slotTime }]);

    const updated = await appointmentRepository.updateById(appointmentId, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason,
    });

    // Slot is now free — invalidate so list reflects updated availability
    await cache.del(
      CACHE_KEYS.doctorProfile(appointment.doctorId),
      CACHE_KEYS.doctorList(),
      CACHE_KEYS.doctorList(doctor?.speciality)
    );

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