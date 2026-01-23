import Task from "../models/Task.model.js";

/* ================= ADMIN: CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
};

/* ================= GET TASKS BY PROJECT =================
   ADMIN    → all tasks
   EMPLOYEE → only assigned tasks
*/
export const getTasksByProject = async (req, res) => {
  try {
    const query =
      req.user.role === "ADMIN"
        ? { project: req.params.projectId }
        : {
            project: req.params.projectId,
            assignedTo: req.user.id, // ✅ FIXED
          };

    const tasks = await Task.find(query).populate(
      "assignedTo",
      "name email"
    );

    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ================= EMPLOYEE: GET MY TASKS (ALL PROJECTS) ================= */
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id, // ✅ FIXED
    }).populate("project", "name");

    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ================= EMPLOYEE: GET MY TASKS FOR PROJECT ================= */
export const getMyTasksForProject = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      assignedTo: req.user.id, // ✅ FIXED (THIS WAS BREAKING EVERYTHING)
    });

    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ================= UPDATE TASK STATUS ================= */
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("dependencies");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const blocked = task.dependencies?.some(
      (dep) => dep.status !== "DONE"
    );

    if (blocked && req.body.status === "DONE") {
      return res.status(400).json({
        message: "Task blocked by unfinished dependencies",
      });
    }

    task.status = req.body.status;
    await task.save();

    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
};

/* ================= ADMIN: ADD SUBTASK ================= */
export const addSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.subtasks.push(req.body);
    await task.save();

    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to add subtask" });
  }
};

/* ================= ADMIN: ADD DEPENDENCY ================= */
export const addDependency = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.dependencies.push(req.body.dependencyId);
    await task.save();

    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to add dependency" });
  }
};
