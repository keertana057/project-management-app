import Project from "../models/project.model.js";

/* ================= ADMIN ================= */

// Create project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Get all projects (ADMIN)
export const getAllProjects = async (req, res) => {
  const projects = await Project.find({ status: { $ne: "ARCHIVED" } })
    .populate("projectManager", "name email")
    .populate("members", "name role");

  res.json(projects);
};

// Assign Project Manager
export const assignProjectManager = async (req, res) => {
  const { projectManagerId } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { projectManager: projectManagerId },
    { new: true }
  ).populate("projectManager", "name email");

  res.json(project);
};

// Archive project
export const archiveProject = async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "ARCHIVED" });
  res.json({ message: "Project archived" });
};

/* ================= PROJECT MANAGER ================= */

// Get projects assigned to PM
export const getPMProjects = async (req, res) => {
  const projects = await Project.find({
    projectManager: req.user.id,
    status: { $ne: "ARCHIVED" },
  }).populate("members", "name role");

  res.json(projects);
};

// Assign employees to project
export const assignEmployees = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { members: req.body.members },
    { new: true }
  ).populate("members", "name role");

  res.json(project);
};

// Update Project Status
export const updateProjectStatus = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(project);
};

/* ================= EMPLOYEE ================= */

// Get employee projects
export const getEmployeeProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
    status: { $ne: "ARCHIVED" },
  });

  res.json(projects);
};
