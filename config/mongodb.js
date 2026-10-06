import mongoose from "mongoose";
import logger from "../utils/logger.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (retryCount = 0) => {
  try {
    mongoose.connection.on("connected", () => {
      logger.info({ db: mongoose.connection.name }, "[Core Service] MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "[Core Service] MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("[Core Service] MongoDB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error(
      { attempt: retryCount + 1, maxRetries: MAX_RETRIES, err: error.message },
      "[Core Service] MongoDB connection failed"
    );

    if (retryCount < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }

    logger.error("Max MongoDB retries reached. Exiting.");
    process.exit(1);
  }
};

export default connectDB;