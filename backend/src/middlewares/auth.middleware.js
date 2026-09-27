import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";
export function authenticate(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Invalid authorization header",
        });
    }
    try {
        const payload = jwt.verify(token, authConfig.jwtSecret);
        req.user = {
            id: Number(payload.sub),
            email: payload.email,
        };
        next();
    }
    catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map