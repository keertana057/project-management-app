import Project from "../models/project.model.js";

/* ================= ADMIN ================= */

// CREATE PROJECT
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

// GET ALL PROJECTS (ADMIN)
export const getAllProjects = async (req, res) => {
  const projects = await Project.find({ status: { $ne: "ARCHIVED" } })
    .populate("projectManager", "name email")
    .populate("members", "name role");

  res.json(projects);
};

// GET PROJECT BY ID (ADMIN / PM)
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("projectManager", "name email")
    .populate("members", "name role");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

// UPDATE PROJECT (ADMIN)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Failed to update project" });
  }
};

// ASSIGN PROJECT MANAGER
export const assignProjectManager = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { projectManager: req.body.projectManagerId },
    { new: true }
  ).populate("projectManager", "name email");

  res.json(project);
};

// ARCHIVE PROJECT
export const archiveProject = async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { status: "ARCHIVED" });
  res.json({ message: "Project archived" });
};

/* ================= PROJECT MANAGER ================= */

// GET PM PROJECTS
export const getPMProjects = async (req, res) => {
  const projects = await Project.find({
    projectManager: req.user.id,
    status: { $ne: "ARCHIVED" },
  }).populate("members", "name role");

  res.json(projects);
};

// ASSIGN EMPLOYEES
export const assignEmployees = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { members: req.body.members },
    { new: true }
  ).populate("members", "name role");

  res.json(project);
};

// UPDATE PROJECT STATUS
export const updateProjectStatus = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(project);
};

/* ================= EMPLOYEE ================= */

// GET EMPLOYEE PROJECTS
export const getEmployeeProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
    status: { $ne: "ARCHIVED" },
  });

  res.json(projects);
};

// GET EMPLOYEE PROJECT BY ID
export const getEmployeeProjectById = async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    members: req.user.id,
    status: { $ne: "ARCHIVED" },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};
