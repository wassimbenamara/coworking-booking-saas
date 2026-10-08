import { Router } from "express";
import { createResourceAvailabilityController, listResourceAvailabilities, } from "../controllers/resource-availability.controller.js";
const router = Router();
router.get("/coworking-resources/:resourceId/availabilities", listResourceAvailabilities);
router.post("/resource-availabilities", createResourceAvailabilityController);
export default router;
//# sourceMappingURL=resource-availability.routes.js.map