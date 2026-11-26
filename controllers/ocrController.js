import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import ocrService from "../services/ocr.service.js";
import AppError from "../utils/AppError.js";

export const scanPrescription = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No image uploaded", 400);

  const imageBuffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  const result = await ocrService.extractText(imageBuffer, mimeType);

  if (!result.success) {
    throw new AppError(result.error || "OCR extraction failed", 500);
  }

  apiResponse.success(res, {
    rawText: result.raw_text,
    medicines: result.medicines,
  });
});