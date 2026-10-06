import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
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
// All business routes below this point require authentication
app.use("/api", protectedRoutes);
export default app;
//# sourceMappingURL=app.js.map