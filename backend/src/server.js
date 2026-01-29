import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE — before any other imports

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import templateRoutes from "./routes/projectTemplate.routes.js";

await connectDB(); // ✅ wait for DB before starting server

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


