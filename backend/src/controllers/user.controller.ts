import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const result = await userService.createUser(name);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};