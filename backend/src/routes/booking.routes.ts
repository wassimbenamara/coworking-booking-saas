import { Router } from "express";

import {
  createBookingController,
  listMyBookings,
} from "../controllers/booking.controller.js";
 

const router = Router(); 

router.get(
  "/bookings/me", 
  listMyBookings
);

router.post(
  "/bookings",
  createBookingController
);

export default router;