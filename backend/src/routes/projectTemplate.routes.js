import express from "express";
import {
  createTemplate,
  getTemplates,
  createProjectFromTemplate,
} from "../controllers/projectTemplate.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", verifyJWT, checkRole(["ADMIN"]), createTemplate);
router.get("/", verifyJWT, getTemplates);
router.post("/use", verifyJWT, checkRole(["ADMIN"]), createProjectFromTemplate);

export default router;
