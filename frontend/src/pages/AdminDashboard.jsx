import { useEffect, useState } from "react";
import {
  createProject,
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
  const [newProject, setNewProject] = useState({ name: "", description: "", endDate: "" });
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



  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) {
      return showToast("Please fill in all fields", "error");
    }

    try {
      await createProject(newProject);
      showToast("Project created successfully", "success");
      setNewProject({ name: "", description: "", endDate: "" }); // Reset form
      fetchData(); // Refresh list
    } catch {
      showToast("Failed to create project", "error");
    }
  };

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
    <div style={page} className="animate-fade-in">
      <h1 style={title}>Admin Dashboard</h1>

      {/* CREATE PROJECT FORM */}
      <div style={formCard} className="glass-panel">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject} style={form}>
          <input
            className="input-focus"
            style={input}
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
          <input
            className="input-focus"
            style={input}
            type="text"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', color: '#cbd5e1', fontSize: '12px', gap: '4px' }}>
            <label>Deadline</label>
            <input
              className="input-focus"
              style={input}
              type="date"
              value={newProject.endDate}
              onChange={(e) =>
                setNewProject({ ...newProject, endDate: e.target.value })
              }
            />
          </div>
          <button type="submit" style={createBtn}>
            Create Project
          </button>
        </form>
      </div>

      {projects.length === 0 ? (
        <p style={muted}>No active projects</p>
      ) : (
        <div style={grid}>
          {projects.map((project, index) => (
            <div
              key={project._id}
              style={{ ...card, animationDelay: `${index * 0.1}s` }}
              className="glass-panel card-hover animate-fade-in"
            >
              <h3>{project.name}</h3>
              <p style={muted}>{project.description}</p>

              <div style={dates}>
                <p style={dateText}>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                {project.endDate && (
                  <p style={dateText}>
                    Deadline: {new Date(project.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

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

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: 40,
  color: "#e5e7eb",
};

const title = {
  fontSize: 28,
  marginBottom: 24,
  fontWeight: 600,
  color: "#fff",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 24,
};

const card = {
  padding: 24,
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  opacity: 0, // start invisible for animation
};

const muted = {
  color: "#94a3b8",
  fontSize: 14,
};

const select = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
  width: "100%",
  marginTop: 8,
};

const archiveBtn = {
  marginTop: 12,
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #dc2626",
  background: "transparent",
  color: "#ef4444",
  cursor: "pointer",
  transition: "all 0.2s",
};

const loadingText = {
  padding: 40,
  color: "#94a3b8",
};

const formCard = {
  padding: 24,
  borderRadius: 12,
  marginBottom: 32,
};

const form = {
  display: "flex",
  gap: 12,
  marginTop: 16,
  flexWrap: "wrap",
};

const input = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(0, 0, 0, 0.3)",
  color: "#fff",
  minWidth: 200,
  flex: 1,
};

const createBtn = {
  padding: "10px 24px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const dates = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 13,
  color: "#94a3b8",
  marginTop: 8,
};

const dateText = {
  margin: 0,
};
