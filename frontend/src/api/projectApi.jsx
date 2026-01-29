import api from "./axios";

/* ================= ADMIN ================= */
export const createProject = (data) => api.post("/projects", data);
export const getAllProjects = () => api.get("/projects");
export const assignProjectManager = (id, projectManagerId) =>
  api.put(`/projects/${id}/manager`, { projectManagerId });
export const archiveProject = (id) =>
  api.put(`/projects/${id}/archive`);

/* ================= PROJECT MANAGER ================= */
export const getPMProjects = () => api.get("/projects/pm/my");
export const assignEmployees = (id, members) =>
  api.put(`/projects/${id}/members`, { members });
export const updateProjectStatus = (id, status) =>
  api.put(`/projects/${id}/status`, { status });

/* ================= EMPLOYEE ================= */
export const getEmployeeProjects = () => api.get("/projects/my");
