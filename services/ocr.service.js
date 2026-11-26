import { getOcrClient } from "../config/grpc.js";
import logger from "../utils/logger.js";

const ocrService = {
  extractText: (imageBuffer, mimeType = "image/jpeg") => {
    return new Promise((resolve, reject) => {
      const client = getOcrClient();

      client.ExtractText(
        { image: imageBuffer, mime_type: mimeType },
        (err, response) => {
          if (err) {
            logger.error({ err }, "gRPC ExtractText failed");
            return reject(err);
          }
          resolve(response);
        }
      );
    });
  },
};

export default ocrService;