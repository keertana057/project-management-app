import { useEffect, useState } from "react";
import api from "../api/axios";
import EmployeeProjectCard from "../components/EmployeeProjectCard";

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    try {
      const res = await api.get("/projects/my");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  if (loading) return <p style={loadingText}>Loading projects...</p>;

  return (
    <div style={page}>
      <header style={header}>
        <h1 style={title}>My Projects</h1>
        <p style={subtitle}>Projects you are assigned to</p>
      </header>

      {projects.length === 0 ? (
        <p style={muted}>You are not assigned to any projects</p>
      ) : (
        <div style={grid}>
          {projects.map((project) => (
            <EmployeeProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
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

const header = {
  marginBottom: 32,
};

const title = {
  fontSize: 28,
  fontWeight: 600,
};

const subtitle = {
  color: "#94a3b8",
  marginTop: 4,
};

const muted = {
  color: "#94a3b8",
};

const loadingText = {
  padding: 40,
  color: "#94a3b8",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 20,
};
