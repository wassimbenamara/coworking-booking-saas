import { createCoworkingSpaceSchema } from "@coworking/shared";
import { createCoworkingSpace, getCoworkingSpaceById, getCoworkingSpaces, } from "../services/coworking-space.service.js";
export async function listCoworkingSpaces(_req, res, next) {
    try {
        const coworkingSpaces = await getCoworkingSpaces();
        return res.status(200).json({
            coworkingSpaces,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function getCoworkingSpace(req, res, next) {
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
    }
    catch (error) {
        next(error);
    }
}
export async function createCoworkingSpaceController(req, res, next) {
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
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=coworking-space.controller.js.map