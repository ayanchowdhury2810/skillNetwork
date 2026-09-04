import type { Request, Response } from "express";
import * as skillRelationsService from "./skillRelations.service.js";

export const relateSkills = async (req: Request, res: Response) => {
  try {
    const { sourceSkill, targetSkill } = req.body;

    if (!sourceSkill || !targetSkill) {
      res.status(400).json({
        message: "Both sourceSkill and targetSkill are required",
      });
      return;
    }

    const data = await skillRelationsService.relateSkills(sourceSkill, targetSkill);

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create skill relation",
    });
  }
};

export const getRelatedSkills = async (req: Request, res: Response) => {
  try {
    const skillName = req.params.skillName as string;
    const data = await skillRelationsService.getRelatedSkills(skillName);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get related skills",
    });
  }
};
