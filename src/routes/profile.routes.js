import { Router } from "express";
import * as controller from "../controllers/profile.controller.js";
import { validateProfileInput } from "../middleware/validator.js";

const router = Router();

router.post("/", validateProfileInput, controller.postProfile);
router.get("/", controller.getProfiles);
router.get("/:id", controller.getProfile);
router.delete("/:id", controller.deleteProfile);

export default router;