import { z } from "zod";
import { createBookingSchema } from "@coworking/shared";
import { coworkingResourceExists, createBooking, getUserBookings, hasOverlappingBooking, isBookingInsideAvailability, } from "../services/booking.service.js";
export async function listMyBookings(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    try {
        const bookings = await getUserBookings(req.user.id);
        return res.status(200).json({
            bookings,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function createBookingController(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    const validation = createBookingSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: z.flattenError(validation.error),
        });
    }
    const { resourceId, startsAt, endsAt } = validation.data;
    try {
        const resourceExists = await coworkingResourceExists(resourceId);
        if (!resourceExists) {
            return res.status(404).json({
                message: "Coworking resource not found",
            });
        }
        const isAvailable = await isBookingInsideAvailability(resourceId, startsAt, endsAt);
        if (!isAvailable) {
            return res.status(409).json({
                message: "Booking is outside the resource availability",
            });
        }
        const hasConflict = await hasOverlappingBooking(resourceId, startsAt, endsAt);
        if (hasConflict) {
            return res.status(409).json({
                message: "Booking overlaps an existing booking",
            });
        }
        const booking = await createBooking(req.user.id, validation.data);
        return res.status(201).json({
            booking,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=booking.controller.js.map