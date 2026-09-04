import type { Request, Response } from "express";
import * as userService from "./users.service.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, skill } = req.body;

    if (!name || !skill) {
      res.status(400).json({
        message: "Both name and skill are required",
      });
      return;
    }

    const result = await userService.createUser(name, skill);

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
