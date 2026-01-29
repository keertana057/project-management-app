import api from "./axios";

/* ================= PROJECT MANAGER ================= */
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTasksByProject = (projectId) =>
  api.get(`/tasks/project/${projectId}`);

/* ================= EMPLOYEE ================= */
export const getMyTasks = () => api.get("/tasks/my");
export const getMyTasksForProject = (projectId) =>
  api.get(`/tasks/project/${projectId}/my`);
export const updateTaskStatus = (id, status) =>
  api.put(`/tasks/${id}/status`, { status });
