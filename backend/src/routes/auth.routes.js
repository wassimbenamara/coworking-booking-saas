import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/security.middleware.js";
const router = Router();
router.post("/auth/register", authRateLimiter, register);
router.post("/auth/login", authRateLimiter, login);
router.get("/auth/me", authenticate, me);
export default router;
//# sourceMappingURL=auth.routes.js.map