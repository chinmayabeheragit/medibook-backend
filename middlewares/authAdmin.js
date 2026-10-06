import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return apiResponse.error(res, "Not authorized. Login again.", 401);
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return apiResponse.error(res, "Not authorized.", 401);
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return apiResponse.error(res, "Invalid or expired token.", 401);
  }
};

export default authAdmin;