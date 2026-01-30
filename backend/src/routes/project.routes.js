import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  assignProjectManager,
  archiveProject,
  getPMProjects,
  assignEmployees,
  updateProjectStatus,
  getEmployeeProjects,
  getEmployeeProjectById,
} from "../controllers/project.controller.js";

const router = express.Router();

/* ================= ADMIN ================= */
router.post("/", verifyJWT, checkRole(["ADMIN"]), createProject);
router.get("/", verifyJWT, checkRole(["ADMIN"]), getAllProjects);
router.get("/:id", verifyJWT, checkRole(["ADMIN", "PROJECT_MANAGER"]), getProjectById);
router.put("/:id", verifyJWT, checkRole(["ADMIN"]), updateProject);
router.put("/:id/manager", verifyJWT, checkRole(["ADMIN"]), assignProjectManager);
router.put("/:id/archive", verifyJWT, checkRole(["ADMIN"]), archiveProject);

/* ================= PROJECT MANAGER ================= */
router.get("/pm/my", verifyJWT, checkRole(["PROJECT_MANAGER"]), getPMProjects);
router.put("/:id/members", verifyJWT, checkRole(["PROJECT_MANAGER"]), assignEmployees);
router.put("/:id/status", verifyJWT, checkRole(["PROJECT_MANAGER"]), updateProjectStatus);

/* ================= EMPLOYEE ================= */
router.get("/my", verifyJWT, checkRole(["EMPLOYEE"]), getEmployeeProjects);
router.get("/:id/my", verifyJWT, checkRole(["EMPLOYEE"]), getEmployeeProjectById);

export default router;
