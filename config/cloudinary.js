import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  logger.info("Cloudinary configured");
};

// Upload buffer from memoryStorage directly to Cloudinary
// No disk write, no fs.unlinkSync needed
export const uploadToCloudinary = (buffer, folder = "medibook") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export default connectCloudinary;