// Every response from Core Service follows this shape:
// { success: true/false, message: "...", data: {...} }

const apiResponse = {
  success: (res, data = null, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, message = "Something went wrong", statusCode = 500, data = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  },

  created: (res, data = null, message = "Created successfully") => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  },
};

export default apiResponse;