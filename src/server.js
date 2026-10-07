import "dotenv/config";
import app from "./app.js";
import connectDB from "../config/mongodb.js";
import connectCloudinary from "../config/cloudinary.js";
import connectRabbitMQ from "../config/rabbitmq.js";
import logger from "../utils/logger.js";

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    // Connect all external services before starting HTTP server
    await connectDB();
    connectCloudinary();
    await connectRabbitMQ();

    app.listen(PORT, () => {
      logger.info(`[Core Service] Running on PORT: ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error.message }, "Failed to start Core Service");
    process.exit(1);
  }
};

// Handle uncaught errors gracefully
process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled rejection — shutting down");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception — shutting down");
  process.exit(1);
});

startServer();