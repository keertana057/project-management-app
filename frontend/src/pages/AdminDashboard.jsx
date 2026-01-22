import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const loadProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/projects/${id}/status`, { status });
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container">
      <h2>Projects</h2>

      {projects.map((p) => (
        <ProjectCard
          key={p._id}
          project={p}
          onStatusChange={updateStatus}
          onOpen={(id) => navigate(`/projects/${id}`)}
        />
      ))}
    </div>
  );
}
