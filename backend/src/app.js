import express from "express";
import { corsMiddleware, securityHeaders, } from "./middlewares/security.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
const app = express();
app.use(securityHeaders);
app.use(corsMiddleware);
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
app.use("/api", protectedRoutes);
export default app;
//# sourceMappingURL=app.js.map