import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import bookingRoutes from "./booking.routes.js";
import coworkingResourceRoutes from "./coworking-resource.routes.js";
import coworkingSpaceRoutes from "./coworking-space.routes.js";
import resourceAvailabilityRoutes from "./resource-availability.routes.js";

const router = Router();

router.use(
  [
    "/coworking-spaces",
    "/coworking-resources",
    "/resource-availabilities",
    "/bookings",
  ],
  authenticate,
);

router.use("/coworking-spaces", coworkingSpaceRoutes);
router.use(coworkingResourceRoutes);
router.use(resourceAvailabilityRoutes);
router.use(bookingRoutes);

export default router;