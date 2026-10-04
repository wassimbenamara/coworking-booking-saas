import { Router } from "express";
import { createResourceAvailabilityController, listResourceAvailabilities, } from "../controllers/resource-availability.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/coworking-resources/:resourceId/availabilities", listResourceAvailabilities);
router.post("/resource-availabilities", createResourceAvailabilityController);
export default router;
//# sourceMappingURL=resource-availability.routes.js.map