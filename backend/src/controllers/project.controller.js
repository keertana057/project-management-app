import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.userId
  });
  res.json(project);
};

export const getProjects = async (req, res) => {
  const projects =
    req.user.role === "ADMIN"
      ? await Project.find()
      : await Project.find({ members: req.user.userId });

  res.json(projects);
};

export const updateProjectStatus = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(project);
};

export const addProjectMembers = async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.members = req.body.members;
  await project.save();
  res.json(project);
};
