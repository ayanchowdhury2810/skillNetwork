import type { Request, Response } from "express";
import * as recommendationService from "../services/recommendation.service.js";
import { validatePagination } from "../recommendation.validation.js";
import type { RecommendationResponse } from "../recommendation.types.js";

export const getRecommendedJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const { params, errors } = validatePagination(
      req.query.page,
      req.query.limit
    );

    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation failed",
        errors,
      });
      return;
    }

    const { jobs, total } =
      await recommendationService.getRecommendations(
        userId,
        params.page,
        params.limit
      );

    const response: RecommendationResponse = {
      success: true,
      data: jobs,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      message: "Failed to get recommendations",
    });
  }
};
