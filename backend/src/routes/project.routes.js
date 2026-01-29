import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

import {
  createProject,
  getAllProjects,
  assignProjectManager,
  archiveProject,
  getPMProjects,
  assignEmployees,
  getEmployeeProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

/* ================= ADMIN ================= */
router.post("/", verifyJWT, checkRole(["ADMIN"]), createProject);
router.get("/", verifyJWT, checkRole(["ADMIN"]), getAllProjects);
router.put("/:id/manager", verifyJWT, checkRole(["ADMIN"]), assignProjectManager);
router.put("/:id/archive", verifyJWT, checkRole(["ADMIN"]), archiveProject);

/* ================= PROJECT MANAGER ================= */
router.get("/pm/my", verifyJWT, checkRole(["PROJECT_MANAGER"]), getPMProjects);
router.put("/:id/members", verifyJWT, checkRole(["PROJECT_MANAGER"]), assignEmployees);

/* ================= EMPLOYEE ================= */
router.get("/my", verifyJWT, checkRole(["EMPLOYEE"]), getEmployeeProjects);

export default router;
