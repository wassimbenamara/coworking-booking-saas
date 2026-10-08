import { z } from "zod";
import { createResourceAvailabilitySchema } from "@coworking/shared";
import { coworkingResourceExists, createResourceAvailability, getResourceAvailabilities, hasOverlappingAvailability, } from "../services/resource-availability.service.js";
export async function listResourceAvailabilities(req, res, next) {
    const resourceId = Number(req.params.resourceId);
    if (!Number.isInteger(resourceId) || resourceId <= 0) {
        return res.status(400).json({
            message: "Invalid resource id",
        });
    }
    try {
        const exists = await coworkingResourceExists(resourceId);
        if (!exists) {
            return res.status(404).json({
                message: "Coworking resource not found",
            });
        }
        const availabilities = await getResourceAvailabilities(resourceId);
        return res.status(200).json({
            availabilities,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function createResourceAvailabilityController(req, res, next) {
    const validation = createResourceAvailabilitySchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: z.flattenError(validation.error),
        });
    }
    const { resourceId, startsAt, endsAt } = validation.data;
    try {
        const exists = await coworkingResourceExists(resourceId);
        if (!exists) {
            return res.status(404).json({
                message: "Coworking resource not found",
            });
        }
        const hasOverlap = await hasOverlappingAvailability(resourceId, startsAt, endsAt);
        if (hasOverlap) {
            return res.status(409).json({
                message: "Availability overlaps an existing time range",
            });
        }
        const availability = await createResourceAvailability(validation.data);
        return res.status(201).json({
            availability,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=resource-availability.controller.js.map