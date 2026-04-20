import * as profileService from "../services/profile.service.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

export const postProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { data, isNew } = await profileService.createProfile(name);

    if (!isNew) {
      return successResponse(res, data, 200, {
        message: "Profile already exists",
      });
    }
    return successResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileById(req.params.id);
    if (!profile) return errorResponse(res, "Profile not found", 404);
    return successResponse(res, profile);
  } catch (error) {
    next(error);
  }
};

export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await profileService.listProfiles(req.query);
    return successResponse(res, profiles, 200, { count: profiles.length });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const deleted = await profileService.removeProfile(req.params.id);
    if (!deleted) return errorResponse(res, "Profile not found", 404);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
