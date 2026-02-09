import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const mongoOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let handlersRegistered = false;

const registerConnectionHandlers = () => {
  if (handlersRegistered) return;

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  handlersRegistered = true;
};

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      logger.error('❌ MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    registerConnectionHandlers();

    await mongoose.connect(uri, mongoOptions);

    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectMongoDB;