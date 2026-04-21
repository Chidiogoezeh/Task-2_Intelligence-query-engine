import * as externalService from "./external.service.js";
import * as profileModel from "../models/profile.model.js";
import { generateUUID } from "../utils/uuid.util.js";

export const createProfile = async (name) => {
  // Check Idempotency
  const existing = await profileModel.findByName(name);
  if (existing) return { data: existing, isNew: false };

  // Aggregate API calls
  const [genderData, ageData, nationalData] = await Promise.all([
    externalService.fetchGenderData(name),
    externalService.fetchAgeData(name),
    externalService.fetchNationalData(name),
  ]);

  const profileData = {
    id: generateUUID(),
    name: name.toLowerCase(),
    ...genderData,
    ...ageData,
    ...nationalData,
    created_at: new Date().toISOString(),
  };

  await profileModel.save(profileData);
  return { data: profileData, isNew: true };
};

export const getProfileById = async (id) => {
  return await profileModel.findById(id);
};

export const listProfiles = async (filters) => {
  return await profileModel.findAll(filters);
};

export const searchProfiles = async (query, pagination) => {
  const filters = { ...pagination };
  const q = query.toLowerCase();
  let interpreted = false;

  // Rule-based parsing: Gender (Removed 'else' to allow combined logic detection)
  if (q.includes("female")) { filters.gender = "female"; interpreted = true; }
  if (q.includes("male") && !q.includes("female")) { filters.gender = "male"; interpreted = true; }

  // Rule-based parsing: "Young" (16-24)
  if (q.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
    interpreted = true;
  }

  // Rule-based parsing: Age Groups
  if (q.includes("teenager")) { filters.age_group = "teenager"; interpreted = true; }
  if (q.includes("adult")) { filters.age_group = "adult"; interpreted = true; }
  if (q.includes("senior")) { filters.age_group = "senior"; interpreted = true; }

  // Rule-based parsing: Dynamic "above X"
  const aboveMatch = q.match(/above (\d+)/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[1]);
    interpreted = true;
  }

  // Rule-based parsing: Countries (Support ISO detection via 'from X')
  const countries = { "nigeria": "NG", "kenya": "KE", "angola": "AO", "benin": "BJ" };
  for (const [name, id] of Object.entries(countries)) {
    if (q.includes(name)) {
      filters.country_id = id;
      interpreted = true;
    }
  }

  if (!interpreted) {
    const error = new Error("Unable to interpret query");
    error.status = 400; 
    throw error;
  }

  return await profileModel.findAll(filters);
};

export const removeProfile = async (id) => {
  return await profileModel.deleteById(id);
};