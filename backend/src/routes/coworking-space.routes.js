import { Router } from "express";
import { createCoworkingSpaceController, getCoworkingSpace, listCoworkingSpaces, } from "../controllers/coworking-space.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", listCoworkingSpaces);
router.get("/:id", getCoworkingSpace);
router.post("/", authenticate, createCoworkingSpaceController);
export default router;
//# sourceMappingURL=coworking-space.routes.js.map