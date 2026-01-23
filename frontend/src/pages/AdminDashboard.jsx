import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={page}>
      <div style={container}>
        <header style={header}>
          <h1 style={title}>Admin Dashboard</h1>

          <button style={primaryBtn} onClick={() => setShowModal(true)}>
            ➕ Create Project
          </button>
        </header>

        {loading && <p style={muted}>Loading projects…</p>}

        {!loading && projects.length === 0 && (
          <p style={muted}>No projects yet</p>
        )}

        <div style={grid}>
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>

        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onCreated={fetchProjects}
          />
        )}
      </div>
    </div>
  );
}

/* ================= styles ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #0f172a)",
  padding: "40px 0",
};

const container = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32,
};

const title = {
  color: "#f8fafc",
  fontSize: 28,
  fontWeight: 600,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 24,
};

const primaryBtn = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 14,
};

const muted = {
  color: "#94a3b8",
};
