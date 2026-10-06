import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return apiResponse.error(res, "Not authorized. Login again.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return apiResponse.error(res, "Not authorized.", 401);
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    return apiResponse.error(res, "Invalid or expired token.", 401);
  }
};

export default authUser;