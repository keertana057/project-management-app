import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function EmployeeProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROJECT (EMPLOYEE SAFE) ================= */
  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}/my`);
    setProject(res.data);
  };

  /* ================= FETCH ONLY MY TASKS ================= */
  const fetchMyTasks = async () => {
    const res = await api.get(`/tasks/project/${id}/my`);
    setTasks(res.data);
  };

  /* ================= UPDATE TASK STATUS ================= */
  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      fetchMyTasks(); // refresh list
    } catch {
      alert("Failed to update task status");
    }
  };

  useEffect(() => {
    Promise.all([fetchProject(), fetchMyTasks()])
      .catch(() => alert("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={loadingText}>Loading...</p>;
  if (!project) return <p style={loadingText}>Project not found</p>;

  return (
    <div style={page}>
      {/* ================= HEADER ================= */}
      <header style={header}>
        <div>
          <h1 style={title}>{project.name}</h1>
          <p style={description}>{project.description}</p>

          <p style={dateText}>
            📅 {formatDate(project.startDate)} → {formatDate(project.endDate)}
          </p>

          <div style={metaRow}>
            <span style={statusBadge(project.status)}>
              {project.status}
            </span>
            <span style={priorityBadge(project.priority)}>
              {project.priority}
            </span>
          </div>
        </div>
      </header>

      {/* ================= TASKS ================= */}
      <section style={card}>
        <h3 style={cardTitle}>My Tasks</h3>

        {tasks.length === 0 ? (
          <p style={muted}>No tasks assigned to you</p>
        ) : (
          <div style={taskGrid}>
            {tasks.map((task) => (
              <div key={task._id} style={taskCard}>
                <h4 style={taskTitle}>{task.title}</h4>

                <div style={taskMeta}>
                  <span style={priorityBadge(task.priority)}>
                    {task.priority}
                  </span>

                  <select
                    value={task.status}
                    style={statusSelect}
                    onChange={(e) =>
                      updateTaskStatus(task._id, e.target.value)
                    }
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "#020617",
  padding: 40,
  color: "#e5e7eb",
};

const loadingText = {
  padding: 40,
  color: "#94a3b8",
};

const header = {
  marginBottom: 32,
};

const title = {
  fontSize: 28,
  fontWeight: 600,
};

const description = {
  color: "#94a3b8",
  maxWidth: 600,
};

const dateText = {
  color: "#cbd5f5",
  marginTop: 6,
  fontSize: 14,
};

const metaRow = {
  display: "flex",
  gap: 10,
  marginTop: 14,
};

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  background:
    status === "COMPLETED"
      ? "#14532d"
      : status === "ONGOING"
      ? "#1e3a8a"
      : "#334155",
});

const priorityBadge = (priority) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  background:
    priority === "HIGH"
      ? "#7f1d1d"
      : priority === "MEDIUM"
      ? "#78350f"
      : "#365314",
});

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 12,
  padding: 20,
};

const cardTitle = {
  fontSize: 18,
  marginBottom: 14,
};

const taskGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const taskCard = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 10,
  padding: 16,
};

const taskTitle = {
  fontSize: 16,
  marginBottom: 10,
};

const taskMeta = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const statusSelect = {
  background: "#020617",
  color: "#e5e7eb",
  border: "1px solid #334155",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 12,
  cursor: "pointer",
};

const muted = {
  color: "#94a3b8",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
