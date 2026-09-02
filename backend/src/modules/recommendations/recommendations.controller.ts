import type { Request, Response } from "express";
import * as recommendationService from "./recommendations.service.js";

export const getRecommendations = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const { found, data } =
      await recommendationService.getRecommendations(id);

    if (!found) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
    });
  }
};
