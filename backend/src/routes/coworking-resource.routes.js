import { Router } from "express";
import { createCoworkingResourceController, getCoworkingResource, listCoworkingResources, } from "../controllers/coworking-resource.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authenticate);
router.get("/coworking-spaces/:coworkingSpaceId/resources", listCoworkingResources);
router.get("/coworking-resources/:id", getCoworkingResource);
router.post("/coworking-resources", createCoworkingResourceController);
export default router;
//# sourceMappingURL=coworking-resource.routes.js.map