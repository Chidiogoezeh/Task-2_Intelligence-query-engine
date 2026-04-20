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
  const { min_age, max_age, page, limit, gender_probability, country_probability } = req.query;
  
  // 1. Check for invalid types (must be numeric strings)
  const numericFields = { min_age, max_age, page, limit, gender_probability, country_probability };
  
  for (const [key, val] of Object.entries(numericFields)) {
    if (val !== undefined && isNaN(val)) {
      return errorResponse(res, "Invalid parameter type", 422);
    }
  }

  // 2. Validate Constraints (Max limit: 50)
  if (limit && parseInt(limit) > 50) {
    return errorResponse(res, "Limit cannot exceed 50", 422);
  }

  // 3. Optional: Validate logical ranges (e.g., probability between 0 and 1)
  if ((gender_probability && (gender_probability < 0 || gender_probability > 1)) ||
      (country_probability && (country_probability < 0 || country_probability > 1))) {
    return errorResponse(res, "Probability must be between 0 and 1", 422);
  }

  next();
};