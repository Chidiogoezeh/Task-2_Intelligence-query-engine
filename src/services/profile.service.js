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

export const removeProfile = async (id) => {
  return await profileModel.deleteById(id);
};
