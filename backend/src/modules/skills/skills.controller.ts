import type { Request, Response } from "express";
import * as skillService from "./skills.service.js";

export const addSkill = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { skillName } = req.body;

    const result = await skillService.addSkillToUser(id, skillName);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add skill",
    });
  }
};

export const getUserSkills = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await skillService.getUserSkills(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get user skills",
    });
  }
};
