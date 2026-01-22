import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { checkRole } from "../middlewares/checkRole.js";
import User from "../models/User.models.js";

const router = express.Router();

// Get all users (ADMIN)
router.get("/", verifyJWT, checkRole(["ADMIN"]), async (req, res) => {
  const users = await User.find({ role: "EMPLOYEE" }).select("-password");
  res.json(users);
});

export default router;
