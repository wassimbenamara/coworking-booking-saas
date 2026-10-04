import { Router } from "express";
import { createBookingController, listMyBookings, } from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/bookings/me", listMyBookings);
router.post("/bookings", createBookingController);
export default router;
//# sourceMappingURL=booking.routes.js.map