import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

import {
  createTask,
  getTasksByProject,
  getMyTasks,
  getMyTasksForProject,
  updateTaskStatus,
  addSubtask,
  addDependency,
} from "../controllers/task.controller.js";

const router = express.Router();

/* ================= ADMIN ================= */

// Create task
router.post("/", verifyJWT, checkRole(["ADMIN"]), createTask);

// Add subtask
router.post("/:id/subtasks", verifyJWT, checkRole(["ADMIN"]), addSubtask);

// Add dependency
router.post("/:id/dependencies", verifyJWT, checkRole(["ADMIN"]), addDependency);

/* ================= COMMON ================= */

// Get tasks for a project
// ADMIN → all tasks
// EMPLOYEE → only their tasks
router.get("/project/:projectId", verifyJWT, getTasksByProject);

// Update task status
router.put("/:id/status", verifyJWT, updateTaskStatus);

/* ================= EMPLOYEE ================= */

// Get all my tasks (across projects)
router.get("/my", verifyJWT, checkRole(["EMPLOYEE"]), getMyTasks);

// ✅ Get my tasks for ONE project (THIS IS THE IMPORTANT ONE)
router.get(
  "/project/:projectId/my",
  verifyJWT,
  checkRole(["EMPLOYEE"]),
  getMyTasksForProject
);

export default router;
