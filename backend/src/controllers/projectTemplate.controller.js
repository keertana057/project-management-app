import ProjectTemplate from "../models/projectTemplate.model.js";
import Project from "../models/project.model.js";
import Task from "../models/Task.model.js";

/* ================= CREATE TEMPLATE ================= */
export const createTemplate = async (req, res) => {
  try {
    const template = await ProjectTemplate.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(template);
  } catch {
    res.status(500).json({ message: "Failed to create template" });
  }
};

/* ================= GET TEMPLATES ================= */
export const getTemplates = async (req, res) => {
  try {
    const templates = await ProjectTemplate.find();
    res.json(templates);
  } catch {
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};

/* ================= CREATE PROJECT FROM TEMPLATE ================= */
export const createProjectFromTemplate = async (req, res) => {
  try {
    const { templateId, startDate, endDate } = req.body;

    const template = await ProjectTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Create project
    const project = await Project.create({
      name: template.name,
      description: template.description,
      priority: template.priority,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    // Create tasks
    const tasks = template.tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      project: project._id,
    }));

    if (tasks.length) {
      await Task.insertMany(tasks);
    }

    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Failed to create project from template" });
  }
};
