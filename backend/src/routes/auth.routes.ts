import { Router } from "express";
import { login,me,register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/auth/register", register);

router.post("/auth/login", login);


router.get("/auth/me", authenticate, me);
export default router;