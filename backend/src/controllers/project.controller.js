import Project from "../models/project.model.js";

/* ===================== CREATE PROJECT (ADMIN) ===================== */
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      priority,
      status,
      startDate,
      endDate,
    } = req.body;

    const project = await Project.create({
      name,
      description,
      priority,
      status,
      startDate,
      endDate,
      createdBy: req.user.id, // ✅ correct
    });

    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* ===================== GET ALL PROJECTS (ADMIN) ===================== */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: { $ne: "ARCHIVED" },
    })
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ===================== GET MY PROJECTS (EMPLOYEE) ===================== */
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id, // ✅ FIXED
      status: { $ne: "ARCHIVED" },
    });

    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch user projects" });
  }
};

/* ===================== GET PROJECT BY ID ===================== */
/* ADMIN → any project
   EMPLOYEE → only if member */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ADMIN → full access
    if (req.user.role === "ADMIN") {
      return res.json(project);
    }

    // EMPLOYEE → must be a member
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id // ✅ FIXED
    );

    if (!isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

/* ===================== GET MY PROJECT BY ID (EMPLOYEE SAFE) ===================== */
export const getMyProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      members: req.user.id, // ✅ FIXED
      status: { $ne: "ARCHIVED" },
    }).populate("members", "name role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

/* ===================== UPDATE PROJECT (ADMIN) ===================== */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
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

/* ===================== ADD PROJECT MEMBERS (ADMIN) ===================== */
export const addProjectMembers = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { members: req.body.members },
      { new: true }
    ).populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Failed to update members" });
  }
};

/* ===================== ARCHIVE PROJECT (ADMIN) ===================== */
export const archiveProject = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, {
      status: "ARCHIVED",
    });

    res.json({ message: "Project archived" });
  } catch {
    res.status(500).json({ message: "Failed to archive project" });
  }
};
