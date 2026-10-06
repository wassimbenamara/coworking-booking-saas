import { Router } from "express";

import {
  createCoworkingResourceController,
  getCoworkingResource,
  listCoworkingResources,
} from "../controllers/coworking-resource.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get(
  "/coworking-spaces/:coworkingSpaceId/resources",
  authenticate,
  listCoworkingResources
);

router.get(
  "/coworking-resources/:id",
  authenticate,
  getCoworkingResource
);

router.post(
  "/coworking-resources",
  createCoworkingResourceController
);

export default router;