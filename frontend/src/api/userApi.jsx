import api from "./axios";

export const getEmployees = () =>
  api.get("/users?role=EMPLOYEE");

export const getProjectManagers = () =>
  api.get("/users?role=PROJECT_MANAGER");
