import type { Request, Response } from "express";
import * as userService from "./users.service.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, skills } = req.body;

    if (!name || !skills || !Array.isArray(skills) || skills.length === 0) {
      res.status(400).json({
        message: "name (string) and skills (non-empty array) are required",
      });
      return;
    }

    const result = await userService.createUser(name, skills);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get users",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await userService.getUserById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get user",
    });
  }
};

export const addUserInterest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { domain } = req.body;

    if (!domain) {
      res.status(400).json({
        message: "Domain name is required",
      });
      return;
    }

    const result = await userService.addUserInterest(id, domain);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add user interest",
    });
  }
};

export const getUserInterests = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await userService.getUserInterests(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get user interests",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await userService.deleteUserById(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

export const deleteAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await userService.deleteAllUsers();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete all users",
    });
  }
};
