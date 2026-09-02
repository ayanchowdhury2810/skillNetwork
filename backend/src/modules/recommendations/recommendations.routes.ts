import { Router } from "express";
import { getRecommendations } from "./recommendations.controller.js";

const router = Router();

router.get("/:id/recommendations", getRecommendations);

export default router;
