import { getChannel } from "../../config/rabbitmq.js";
import { EVENTS } from "../../constants/index.js";
import logger from "../../utils/logger.js";

const EXCHANGE = "medibook";

// Publish appointment.booked — consumed by Notification Service
export const publishAppointmentBooked = async (appointment) => {
  try {
    const channel = getChannel();
    const payload = {
      appointmentId: appointment._id,
      userId:        appointment.userId,
      doctorId:      appointment.doctorId,
      slotDate:      appointment.slotDate,
      slotTime:      appointment.slotTime,
      amount:        appointment.amount,
      timestamp:     new Date().toISOString(),
    };

    channel.publish(
      EXCHANGE,
      EVENTS.APPOINTMENT_BOOKED,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true } // message survives RabbitMQ restart
    );

    logger.info({ appointmentId: appointment._id }, "Published appointment.booked");
  } catch (error) {
    // Never let RabbitMQ failure break the booking response
    logger.error({ err: error.message }, "Failed to publish appointment.booked");
  }
};

// Publish appointment.cancelled
export const publishAppointmentCancelled = async (appointment) => {
  try {
    const channel = getChannel();
    const payload = {
      appointmentId: appointment._id,
      userId:        appointment.userId,
      doctorId:      appointment.doctorId,
      timestamp:     new Date().toISOString(),
    };

    channel.publish(
      EXCHANGE,
      EVENTS.APPOINTMENT_CANCELLED,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );

    logger.info({ appointmentId: appointment._id }, "Published appointment.cancelled");
  } catch (error) {
    logger.error({ err: error.message }, "Failed to publish appointment.cancelled");
  }
};