import Task from "../models/Task.model.js";

/* ================= PROJECT MANAGER ================= */

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted successfully" });
};

export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignedTo", "name email")
    .populate("dependencies", "title status priority")
    .populate("subtasks.assignedTo", "name email");
  res.json(tasks);
};

/* ================= EMPLOYEE ================= */

export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
};

export const getMyTasksForProject = async (req, res) => {
  const tasks = await Task.find({
    project: req.params.projectId,
    assignedTo: req.user.id,
  });
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = req.body.status;
  await task.save();
  res.json(task);
};
