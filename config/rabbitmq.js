import amqplib from "amqplib";
import logger from "../utils/logger.js";

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Durable exchange — survives RabbitMQ restart
    await channel.assertExchange("medibook", "topic", { durable: true });

    logger.info("RabbitMQ connected — exchange: medibook");

    connection.on("error", (err) => {
      logger.error({ err }, "RabbitMQ connection error");
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed — reconnecting in 5s");
      setTimeout(connectRabbitMQ, 5000);
    });
  } catch (error) {
    logger.error({ err: error.message }, "RabbitMQ connection failed — retrying in 5s");
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const getChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};

export default connectRabbitMQ;