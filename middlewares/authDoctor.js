import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";

const authDoctor = (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return apiResponse.error(res, "Not authorized. Login again.", 401);
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    if (decoded.role !== "doctor") {
      return apiResponse.error(res, "Not authorized.", 401);
    }

    req.body.docId = decoded.id;
    next();
  } catch (error) {
    return apiResponse.error(res, "Invalid or expired token.", 401);
  }
};

export default authDoctor;