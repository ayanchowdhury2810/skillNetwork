import { Router } from "express";
import * as userController from "./users.controller.js";
import * as skillController from "../skills/skills.controller.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/:id/skills", skillController.addSkill);
router.get("/:id/skills", skillController.getUserSkills);

export default router;
