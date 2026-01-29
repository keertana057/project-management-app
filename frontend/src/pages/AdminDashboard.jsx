import { useEffect, useState } from "react";
import {
  getAllProjects,
  assignProjectManager,
  archiveProject,
} from "../api/projectApi";
import { getProjectManagers } from "../api/userApi";
import { useToast } from "../ui/ToastContext";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [pms, setPMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    const [projectsRes, pmRes] = await Promise.all([
      getAllProjects(),
      getProjectManagers(),
    ]);

    setProjects(projectsRes.data);
    setPMs(pmRes.data);
    setLoading(false);
  };

  useEffect(() => {
     showToast("Toast system working", "success");
  }, []);

  useEffect(() => {
    fetchData().catch(() =>
      showToast("Failed to load admin data", "error")
    );
  }, []);

  const handleAssignPM = async (projectId, pmId) => {
    try {
      await assignProjectManager(projectId, pmId);
      showToast("Project Manager assigned", "success");
      fetchData();
    } catch {
      showToast("Failed to assign PM", "error");
    }
  };

  const handleArchive = async (projectId) => {
    if (!window.confirm("Archive this project?")) return;

    try {
      await archiveProject(projectId);
      showToast("Project archived", "success");
      fetchData();
    } catch {
      showToast("Failed to archive project", "error");
    }
  };

  if (loading) return <p style={loadingText}>Loading...</p>;

  return (
    <div style={page}>
      <h1 style={title}>Admin Dashboard</h1>

      {projects.length === 0 ? (
        <p style={muted}>No active projects</p>
      ) : (
        <div style={grid}>
          {projects.map((project) => (
            <div key={project._id} style={card}>
              <h3>{project.name}</h3>
              <p style={muted}>{project.description}</p>

              <p>
                PM:{" "}
                <strong>
                  {project.projectManager?.name || "Unassigned"}
                </strong>
              </p>

              <select
                style={select}
                value={project.projectManager?._id || ""}
                onChange={(e) =>
                  handleAssignPM(project._id, e.target.value)
                }
              >
                <option value="">Assign Project Manager</option>
                {pms.map((pm) => (
                  <option key={pm._id} value={pm._id}>
                    {pm.name}
                  </option>
                ))}
              </select>

              <button
                style={archiveBtn}
                onClick={() => handleArchive(project._id)}
              >
                Archive Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* styles unchanged */

const loadingText = {
  padding: 40,
  color: "#94a3b8",
};

