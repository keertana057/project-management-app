import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  addSubtask,
  addDependency
} from "../controllers/task.controller.js";

const router = express.Router();

// ADMIN: create task
router.post("/", verifyJWT, checkRole(["ADMIN"]), createTask);

// Get tasks for a project
router.get(
  "/project/:projectId",
  verifyJWT,
  getTasksByProject
);

// Update task status (employee / admin)
router.put(
  "/:id/status",
  verifyJWT,
  updateTaskStatus
);

// ADMIN: add subtask
router.post(
  "/:id/subtasks",
  verifyJWT,
  checkRole(["ADMIN"]),
  addSubtask
);

// ADMIN: add dependency
router.post(
  "/:id/dependencies",
  verifyJWT,
  checkRole(["ADMIN"]),
  addDependency
);

export default router; 


