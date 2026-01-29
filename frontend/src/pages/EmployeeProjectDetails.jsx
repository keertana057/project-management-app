import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeProjects } from "../api/projectApi";
import {
  getMyTasksForProject,
  updateTaskStatus,
} from "../api/taskApi";
import { useToast } from "../ui/ToastContext";

export default function EmployeeProjectDetails() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    const res = await getEmployeeProjects();
    setProject(res.data.find((p) => p._id === id) || null);
  };

  const fetchMyTasks = async () => {
    const res = await getMyTasksForProject(id);
    setTasks(res.data);
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      showToast("Task status updated", "success");
      fetchMyTasks();
    } catch {
      showToast("Failed to update task", "error");
    }
  };

  useEffect(() => {
    Promise.all([fetchProject(), fetchMyTasks()])
      .catch(() => showToast("Failed to load project", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={loadingText}>Loading...</p>;
  if (!project) return <p style={loadingText}>Project not found</p>;

  return (
    /* UI UNCHANGED */
    <div>{/* same JSX as before */}</div>
  );
}
