import type { Request, Response } from "express";
import * as aiSearchService from "./aiSearch.service.js";

export const search = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || !query.trim()) {
      res.status(400).json({
        success: false,
        message: "Query is required",
      });
      return;
    }

    const response = await aiSearchService.search(query.trim());

    res.status(200).json(response);
  } catch (error) {
    console.error("AI Search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process search query",
    });
  }
};
