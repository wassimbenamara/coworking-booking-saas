import cors from "cors";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
export const securityHeaders = helmet();
export const corsMiddleware = cors({
    origin(origin, callback) {
        // Allows requests without Origin header:
        // Supertest, curl, Postman, server-to-server requests.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
});
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts. Please try again later.",
    },
});
//# sourceMappingURL=security.middleware.js.map