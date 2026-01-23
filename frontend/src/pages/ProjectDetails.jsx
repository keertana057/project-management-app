import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import AssignMembersModal from "../components/AssignMembersModal";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";
import EditProjectModal from "../components/EditProjectModal";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAssign, setShowAssign] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  /* fetch project */
  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data);
  };

  /* fetch tasks */
  const fetchTasks = async () => {
    const res = await api.get(`/tasks/project/${id}`);
    setTasks(res.data);
  };

  const archiveProject = async () => {
    if (!window.confirm("Archive this project?")) return;
    await api.put(`/projects/${id}/archive`);
    navigate("/admin");
  };

  useEffect(() => {
    Promise.all([fetchProject(), fetchTasks()])
      .catch(() => alert("Failed to load project data"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={loadingText}>Loading...</p>;
  if (!project) return <p style={loadingText}>Project not found</p>;

  const isArchived = project.status === "ARCHIVED";

  return (
    <div style={page}>
      {/* HEADER */}
      <header style={header}>
        <div>
          <h1 style={title}>{project.name}</h1>
          <p style={description}>{project.description}</p>

          {/* ARCHIVED BANNER */}
          {isArchived && (
            <p style={archivedBanner}>
              This project is archived. Editing and task creation are disabled.
            </p>
          )}

          {/* DATES */}
          <div style={dates}>
            <span>
              <b>Start:</b>{" "}
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "—"}
            </span>
            <span>
              <b>End:</b>{" "}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : "—"}
            </span>
          </div>

          {/* STATUS / PRIORITY */}
          <div style={metaRow}>
            <span style={statusBadge(project.status)}>
              {project.status}
            </span>
            <span style={priorityBadge(project.priority)}>
              {project.priority}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={actions}>
          <button
            style={secondaryBtn}
            disabled={isArchived}
            onClick={() => setShowAssign(true)}
          >
            Assign Members
          </button>

          <button
            style={secondaryBtn}
            disabled={isArchived}
            onClick={() => setShowEdit(true)}
          >
            Edit Project
          </button>

          {!isArchived && (
            <button
              style={{ ...secondaryBtn, borderColor: "#7f1d1d", color: "#fecaca" }}
              onClick={archiveProject}
            >
              Archive
            </button>
          )}

          <button
            style={primaryBtn}
            disabled={isArchived}
            onClick={() => setShowTaskModal(true)}
          >
            Create Task
          </button>
        </div>
      </header>

      {/* CONTENT GRID */}
      <div style={grid}>
        {/* MEMBERS */}
        <section style={card}>
          <h3 style={cardTitle}>Members</h3>

          {project.members?.length === 0 ? (
            <p style={muted}>No members assigned</p>
          ) : (
            <ul style={list}>
              {project.members.map((m) => (
                <li key={m._id} style={listItem}>
                  <span>{m.name}</span>
                  <span style={role}>{m.role}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* TASKS */}
        <section style={card}>
          <h3 style={cardTitle}>Tasks</h3>
          <TaskList tasks={tasks} />
        </section>
      </div>

      {/* MODALS */}
      {showAssign && !isArchived && (
        <AssignMembersModal
          projectId={id}
          onClose={() => setShowAssign(false)}
          onUpdated={fetchProject}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
          projectId={id}
          projectStatus={project.status}   
          onClose={() => setShowTaskModal(false)}
          onCreated={fetchTasks}
        />
      )}

      {showEdit && !isArchived && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEdit(false)}
          onUpdated={fetchProject}
        />
      )}
    </div>
  );
}

/* ================== STYLES ================== */

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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 32,
};

const title = {
  fontSize: 30,
  fontWeight: 600,
  marginBottom: 6,
};

const description = {
  color: "#94a3b8",
  maxWidth: 520,
};

const archivedBanner = {
  marginTop: 10,
  padding: "8px 12px",
  background: "#1f2933",
  borderLeft: "4px solid #6b7280",
  color: "#d1d5db",
  borderRadius: 6,
  fontSize: 13,
};

const dates = {
  marginTop: 8,
  fontSize: 14,
  color: "#94a3b8",
  display: "flex",
  gap: 14,
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
      : status === "ARCHIVED"
      ? "#4b5563"
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

const actions = {
  display: "flex",
  gap: 12,
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#1e293b",
  color: "#e5e7eb",
  border: "1px solid #334155",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: 24,
};

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

const muted = {
  color: "#94a3b8",
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #1e293b",
};

const role = {
  fontSize: 12,
  color: "#94a3b8",
};
