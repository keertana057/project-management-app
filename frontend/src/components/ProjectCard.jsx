import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      style={card}
      onClick={() => navigate(`/admin/projects/${project._id}`)}
    >
      <h3 style={name}>{project.name}</h3>

      <p style={desc}>{project.description}</p>

      <div style={meta}>
        <span style={{ ...badge, ...statusColors[project.status] }}>
          {project.status}
        </span>

        <span style={{ ...badge, ...priorityColors[project.priority] }}>
          {project.priority}
        </span>
      </div>
    </div>
  );
}


const card = {
  background: "rgba(2, 6, 23, 0.9)",
  borderRadius: 16,
  padding: 20,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
};

const name = {
  color: "#f8fafc",
  marginBottom: 6,
  fontSize: 18,
};

const desc = {
  color: "#94a3b8",
  fontSize: 14,
  marginBottom: 16,
};

const meta = {
  display: "flex",
  gap: 10,
};

const badge = {
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
};

/* ===== badge colors ===== */

const statusColors = {
  PLANNED: { background: "#334155", color: "#e5e7eb" },
  ONGOING: { background: "#1d4ed8", color: "#dbeafe" },
  COMPLETED: { background: "#166534", color: "#dcfce7" },
};

const priorityColors = {
  LOW: { background: "#1e293b", color: "#cbd5f5" },
  MEDIUM: { background: "#854d0e", color: "#fef3c7" },
  HIGH: { background: "#7f1d1d", color: "#fee2e2" },
};
