export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignedTo", "name")
    .populate("dependencies", "title status");
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id).populate("dependencies");

  const blocked = task.dependencies.some(
    (dep) => dep.status !== "DONE"
  );

  if (blocked && req.body.status === "DONE") {
    return res.status(400).json({
      message: "Task blocked by unfinished dependencies"
    });
  }

  task.status = req.body.status;
  await task.save();
  res.json(task);
};

export const addSubtask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.subtasks.push(req.body);
  await task.save();
  res.json(task);
};

export const addDependency = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.dependencies.push(req.body.dependencyId);
  await task.save();
  res.json(task);
};


