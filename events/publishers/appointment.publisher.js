import { getChannel } from "../../config/rabbitmq.js";
import { EVENTS } from "../../constants/index.js";
import logger from "../../utils/logger.js";
import doctorRepository from "../../repositories/doctor.repository.js";
import userRepository from "../../repositories/user.repository.js";

const EXCHANGE = "medibook";

export const publishAppointmentBooked = async (appointment) => {
  try {
    const channel = getChannel();

    const [doctor, user] = await Promise.all([
      doctorRepository.findById(appointment.doctorId),
      userRepository.findById(appointment.userId),
    ]);

    const payload = {
      appointmentId: appointment._id,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
      amount: appointment.amount,
      patientName: user?.name || "Patient",
      patientEmail: user?.email,
      doctorName: doctor?.name || "Doctor",
      timestamp: new Date().toISOString(),
    };

    const message = {
      pattern: EVENTS.APPOINTMENT_BOOKED,
      data: payload,
    };

    channel.publish(
      EXCHANGE,
      EVENTS.APPOINTMENT_BOOKED,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    logger.info({ appointmentId: appointment._id }, "Published appointment.booked");
  } catch (error) {
    logger.error({ err: error.message }, "Failed to publish appointment.booked");
  }
};

export const publishAppointmentCancelled = async (appointment) => {
  try {
    const channel = getChannel();

    const [doctor, user] = await Promise.all([
      doctorRepository.findById(appointment.doctorId),
      userRepository.findById(appointment.userId),
    ]);

    const payload = {
      appointmentId: appointment._id,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
      patientName: user?.name || "Patient",
      patientEmail: user?.email,
      doctorName: doctor?.name || "Doctor",
      timestamp: new Date().toISOString(),
    };

    const message = {
      pattern: EVENTS.APPOINTMENT_CANCELLED,
      data: payload,
    };

    channel.publish(
      EXCHANGE,
      EVENTS.APPOINTMENT_CANCELLED,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    logger.info({ appointmentId: appointment._id }, "Published appointment.cancelled");
  } catch (error) {
    logger.error({ err: error.message }, "Failed to publish appointment.cancelled");
  }
};