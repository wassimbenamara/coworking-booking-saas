import { Router } from "express";

import {
  createCoworkingSpaceController,
  getCoworkingSpace,
  listCoworkingSpaces,
} from "../controllers/coworking-space.controller.js";

const router = Router();

router.get("/", listCoworkingSpaces);
router.get("/:id", getCoworkingSpace);
router.post("/", createCoworkingSpaceController);

export default router;
