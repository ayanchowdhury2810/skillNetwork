import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import * as skillController from "../controllers/skill.controller.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/:id/skills", skillController.addSkill);
router.get("/:id/skills", skillController.getUserSkills);

export default router;