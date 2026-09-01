import { Router } from "express";
import { getRecommendedJobs } from "./recommendations.controller.js";
import {
  authenticate,
  authorize,
} from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/jobs",
  authenticate,
  authorize("CANDIDATE"),
  getRecommendedJobs
);

export default router;
