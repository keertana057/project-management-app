import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  getMyProjectById,
  updateProject,
  addProjectMembers,
  archiveProject,
} from "../controllers/project.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", verifyJWT, checkRole(["ADMIN"]), createProject);
router.get("/", verifyJWT, checkRole(["ADMIN"]), getProjects);
router.get("/my", verifyJWT, checkRole(["EMPLOYEE"]), getMyProjects);
router.get("/:id/my", verifyJWT, checkRole(["EMPLOYEE"]), getMyProjectById);
router.get("/:id", verifyJWT, getProjectById);

router.put("/:id", verifyJWT, checkRole(["ADMIN"]), updateProject);
router.put("/:id/members", verifyJWT, checkRole(["ADMIN"]), addProjectMembers);
router.put("/:id/archive", verifyJWT, checkRole(["ADMIN"]), archiveProject);

export default router;
