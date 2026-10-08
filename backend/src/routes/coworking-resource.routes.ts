import { Router } from "express";

import {
  createCoworkingResourceController,
  getCoworkingResource,
  listCoworkingResources,
} from "../controllers/coworking-resource.controller.js";

const router = Router();

router.get(
  "/coworking-spaces/:coworkingSpaceId/resources",
  listCoworkingResources,
);

router.get(
  "/coworking-resources/:id",
  getCoworkingResource,
);

router.post(
  "/coworking-resources",
  createCoworkingResourceController,
);

export default router;