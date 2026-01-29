import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";
import User from "../models/User.models.js";

const router = express.Router();

// Get users with optional role filter
router.get("/", verifyJWT, checkRole(["ADMIN", "PROJECT_MANAGER"]), async (req, res) => {
  const query = {};
  if (req.query.role) {
    query.role = req.query.role;
  }
  const users = await User.find(query).select("-password");
  res.json(users);
});

export default router;
