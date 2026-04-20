import { errorResponse } from "../utils/response.util.js";

export const validateProfileInput = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return errorResponse(res, "Missing or empty name", 400);
  }

  if (typeof name !== "string") {
    return errorResponse(res, "Invalid type", 422);
  }

  next();
};
