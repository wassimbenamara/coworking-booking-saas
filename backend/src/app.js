import express from "express";
import { corsMiddleware, securityHeaders, } from "./middlewares/security.middleware.js";
import { errorHandler, notFoundHandler, } from "./middlewares/error.middleware.js";
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
// Must stay after all application routes
app.use(notFoundHandler);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map