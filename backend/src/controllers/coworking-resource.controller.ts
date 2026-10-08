import type { NextFunction, Request, Response } from "express";
import z from "zod";

import { createCoworkingResourceSchema } from "@coworking/shared";

import {
  coworkingSpaceExists,
  createCoworkingResource,
  getCoworkingResourceById,
  getCoworkingResourcesBySpaceId,
} from "../services/coworking-resource.service.js";

export async function listCoworkingResources(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const coworkingSpaceId = Number(req.params.coworkingSpaceId);

  if (!Number.isInteger(coworkingSpaceId) || coworkingSpaceId <= 0) {
    return res.status(400).json({
      message: "Invalid coworking space id",
    });
  }

  try {
    const resources = await getCoworkingResourcesBySpaceId(coworkingSpaceId);

    return res.status(200).json({
      resources,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCoworkingResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid resource id",
    });
  }

  try {
    const resource = await getCoworkingResourceById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Coworking resource not found",
      });
    }

    return res.status(200).json({
      resource,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCoworkingResourceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validation = createCoworkingResourceSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: z.flattenError(validation.error),
    });
  }

  try {
    const exists = await coworkingSpaceExists(validation.data.coworkingSpaceId);

    if (!exists) {
      return res.status(404).json({
        message: "Coworking space not found",
      });
    }

    const resource = await createCoworkingResource(validation.data);

    return res.status(201).json({
      resource,
    });
  } catch (error) {
    next(error);
  }
}
