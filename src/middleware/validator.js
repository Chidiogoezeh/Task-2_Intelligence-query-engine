import { errorResponse } from "../utils/response.util.js";

export const validateProfileInput = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return errorResponse(res, "Missing or empty parameter", 400);
  }

  if (typeof name !== "string") {
    return errorResponse(res, "Invalid parameter type", 422);
  }

  next();
};

export const validateQueryParams = (req, res, next) => {
  const { min_age, max_age, page, limit, min_gender_probability, min_country_probability } = req.query;
  
  const numericFields = { min_age, max_age, page, limit, min_gender_probability, min_country_probability };
  
  for (const [key, val] of Object.entries(numericFields)) {
    if (val !== undefined) {
      if (val === "") return errorResponse(res, "Missing or empty parameter", 400);
      if (isNaN(val)) return errorResponse(res, "Invalid parameter type", 422);
    }
  }

  if (limit && parseInt(limit) > 50) {
    return errorResponse(res, "Invalid parameter type", 422); // Max limit enforcement
  }

  next();
};