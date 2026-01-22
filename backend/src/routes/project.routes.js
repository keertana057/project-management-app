import express from "express";
import {
  createProject,
  getProjects,
  updateProjectStatus,
  addProjectMembers
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Create project (ADMIN)
router.post("/", verifyJWT, checkRole(["ADMIN"]), createProject);

// Get projects (ADMIN: all, EMPLOYEE: assigned)
router.get("/", verifyJWT, getProjects);

// Update project status (ADMIN)
router.put(
  "/:id/status",
  verifyJWT,
  checkRole(["ADMIN"]),
  updateProjectStatus
);

// Update project members (ADMIN)
router.put(
  "/:id/members",
  verifyJWT,
  checkRole(["ADMIN"]),
  addProjectMembers
);

export default router;
