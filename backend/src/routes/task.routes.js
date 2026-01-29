import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";

import {
  createTask,
  updateTask,
  getTasksByProject,
  getMyTasks,
  getMyTasksForProject,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

/* ================= PROJECT MANAGER ================= */
router.post("/", verifyJWT, checkRole(["PROJECT_MANAGER"]), createTask);
router.put("/:id", verifyJWT, checkRole(["PROJECT_MANAGER"]), updateTask);
router.delete("/:id", verifyJWT, checkRole(["PROJECT_MANAGER"]), deleteTask);
router.get("/project/:projectId", verifyJWT, checkRole(["PROJECT_MANAGER"]), getTasksByProject);

/* ================= EMPLOYEE ================= */
router.get("/my", verifyJWT, checkRole(["EMPLOYEE"]), getMyTasks);
router.get("/project/:projectId/my", verifyJWT, checkRole(["EMPLOYEE"]), getMyTasksForProject);
router.put("/:id/status", verifyJWT, checkRole(["EMPLOYEE"]), updateTaskStatus);

export default router;
