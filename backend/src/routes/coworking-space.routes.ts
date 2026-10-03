import { Router } from "express";

import {
  createCoworkingSpaceController,
  getCoworkingSpace,
  listCoworkingSpaces,
} from "../controllers/coworking-space.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", listCoworkingSpaces);
router.get("/:id", getCoworkingSpace);
router.post("/", createCoworkingSpaceController);

export default router;
