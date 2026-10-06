import express from "express";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import coworkingResourceRoutes from "./routes/coworking-resource.routes.js";
import coworkingSpaceRoutes from "./routes/coworking-space.routes.js";
import resourceAvailabilityRoutes from "./routes/resource-availability.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Coworking Booking API",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "coworking-booking-api",
  });
});

app.use("/api", authRoutes);
app.use("/api", coworkingSpaceRoutes);
app.use("/api", coworkingResourceRoutes);
app.use("/api", resourceAvailabilityRoutes);
app.use("/api", bookingRoutes);

export default app;