import { useNavigate } from "react-router-dom";

export default function EmployeeProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      style={card}
      onClick={() => navigate(`/employee/projects/${project._id}`)}
    >
      <h3 style={name}>{project.name}</h3>
      <p style={desc}>{project.description}</p>

      <div style={badges}>
        <span style={status(project.status)}>{project.status}</span>
        <span style={priority(project.priority)}>{project.priority}</span>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 14,
  padding: 20,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

card[":hover"] = {};

const name = {
  fontSize: 18,
  marginBottom: 6,
};

const desc = {
  fontSize: 14,
  color: "#94a3b8",
  marginBottom: 14,
};

const badges = {
  display: "flex",
  gap: 10,
};

const status = (s) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  background:
    s === "COMPLETED"
      ? "#14532d"
      : s === "ONGOING"
      ? "#1e3a8a"
      : "#334155",
});

const priority = (p) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  background:
    p === "HIGH"
      ? "#7f1d1d"
      : p === "MEDIUM"
      ? "#78350f"
      : "#365314",
});
