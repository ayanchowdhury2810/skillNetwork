import { Router } from "express";
import * as skillRelationsController from "./skillRelations.controller.js";

const router = Router();

router.post("/related", skillRelationsController.relateSkills);
router.get("/:skillName/related", skillRelationsController.getRelatedSkills);

export default router;
