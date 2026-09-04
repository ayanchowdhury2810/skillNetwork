import type { Request, Response } from "express";
import * as domainService from "./domains.service.js";

export const createDomain = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Domain name required",
      });
      return;
    }

    const data = await domainService.createDomain(name);

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create domain",
    });
  }
};

export const getDomains = async (_req: Request, res: Response) => {
  try {
    const data = await domainService.getDomains();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get domains",
    });
  }
};

export const addSkillToDomain = async (req: Request, res: Response) => {
  try {
    const domainName = req.params.domainName as string;
    const { skill } = req.body;

    if (!skill) {
      res.status(400).json({
        message: "Skill name required",
      });
      return;
    }

    const data = await domainService.addSkillToDomain(domainName, skill);

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add skill to domain",
    });
  }
};

export const getDomainSkills = async (req: Request, res: Response) => {
  try {
    const domainName = req.params.domainName as string;
    const data = await domainService.getDomainSkills(domainName);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get domain skills",
    });
  }
};
