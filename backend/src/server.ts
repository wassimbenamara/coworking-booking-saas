import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import coworkingSpaceRoutes from "./routes/coworking-space.routes.js";
import coworkingResourceRoutes from "./routes/coworking-resource.routes.js";
import resourceAvailabilityRoutes from "./routes/resource-availability.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "Coworking Booking API",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "coworking-booking-api",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/coworking-spaces", coworkingSpaceRoutes);
app.use("/api", coworkingResourceRoutes);

app.use("/api", resourceAvailabilityRoutes);
app.use("/api", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
