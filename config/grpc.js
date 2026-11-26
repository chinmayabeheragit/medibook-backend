import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageDef = protoLoader.loadSync(
  join(__dirname, "../proto/ocr.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const ocrProto = grpc.loadPackageDefinition(packageDef).ocr;

let ocrClient = null;

export const connectOcrService = () => {
  try {
    ocrClient = new ocrProto.OcrService(
      process.env.OCR_SERVICE_URL || "localhost:50051",
      grpc.credentials.createInsecure()
    );
    logger.info("gRPC OCR client initialized");
  } catch (err) {
    logger.error({ err }, "Failed to initialize gRPC OCR client");
  }
};

export const getOcrClient = () => {
  if (!ocrClient) throw new Error("gRPC OCR client not initialized");
  return ocrClient;
};