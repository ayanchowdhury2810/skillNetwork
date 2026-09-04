import { Router } from "express";
import * as domainController from "./domains.controller.js";

const router = Router();

router.post("/", domainController.createDomain);
router.get("/", domainController.getDomains);
router.post("/:domainName/skills", domainController.addSkillToDomain);
router.get("/:domainName/skills", domainController.getDomainSkills);

export default router;
