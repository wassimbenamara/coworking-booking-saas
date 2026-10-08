import type { NextFunction, Request, Response } from "express";
import { createCoworkingSpaceSchema } from "@coworking/shared";
import {
  createCoworkingSpace,
  getCoworkingSpaceById,
  getCoworkingSpaces,
} from "../services/coworking-space.service.js";

export async function listCoworkingSpaces(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const coworkingSpaces = await getCoworkingSpaces();

    return res.status(200).json({
      coworkingSpaces,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCoworkingSpace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid coworking space id",
    });
  }

  try {
    const coworkingSpace = await getCoworkingSpaceById(id);

    if (!coworkingSpace) {
      return res.status(404).json({
        message: "Coworking space not found",
      });
    }

    return res.status(200).json({
      coworkingSpace,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCoworkingSpaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validation = createCoworkingSpaceSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: validation.error.flatten(),
    });
  }

  try {
    const coworkingSpace = await createCoworkingSpace(validation.data);

    return res.status(201).json({
      coworkingSpace,
    });
  } catch (error) {
    next(error);
  }
}
