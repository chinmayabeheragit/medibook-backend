import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import ocrService from "../services/ocr.service.js";
import AppError from "../utils/AppError.js";

export const scanPrescription = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("No image uploaded", 400);
  
  const result = await ocrService.extractText(req.file.buffer, req.file.mimetype);
  if (!result.success) throw new AppError(result.error || "OCR extraction failed", 500);

  // Wire to commerce service for each medicine
  const medicineResults = await Promise.allSettled(
    result.medicines.map(name =>
      fetch(`${process.env.COMMERCE_SERVICE_URL}/api/medicines/search/ocr?text=${encodeURIComponent(name)}`)
        .then(r => r.json())
    )
  );

  const products = medicineResults
    .filter(r => r.status === "fulfilled")
    .map(r => r.value?.data || [])
    .flat();

  apiResponse.success(res, {
    rawText: result.raw_text,
    medicines: result.medicines,
    products,
  });
});

