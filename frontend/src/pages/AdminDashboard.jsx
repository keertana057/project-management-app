import { useEffect, useState } from "react";
import {
  createProject,
  getAllProjects,
  assignProjectManager,
  archiveProject,
} from "../api/projectApi";
import { getProjectManagers } from "../api/userApi";
import { useToast } from "../ui/ToastContext";
import EditProjectModal from "../components/EditProjectModal";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [pms, setPMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    endDate: "",
  });
  const [editProject, setEditProject] = useState(null);

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
      showToast("Project created", "success");
      setNewProject({ name: "", description: "", endDate: "" });
      fetchData();
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
    <div style={page}>
      <h1 style={title}>Admin Dashboard</h1>

      {/* CREATE PROJECT */}
      <div style={formCard}>
        <h3>Create Project</h3>
        <form onSubmit={handleCreateProject} style={form}>
          <input
            style={input}
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <input
            type="date"
            style={input}
            value={newProject.endDate}
            onChange={(e) =>
              setNewProject({ ...newProject, endDate: e.target.value })
            }
          />
          <button style={createBtn}>Create</button>
        </form>
      </div>

      {/* PROJECT LIST */}
      <div style={grid}>
        {projects.map((project) => (
          <div key={project._id} style={card}>
            <div>
              <h3>{project.name}</h3>
              <p style={muted}>{project.description}</p>

              <p style={dateText}>
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              {project.endDate && (
                <p style={dateText}>
                  Deadline: {new Date(project.endDate).toLocaleDateString()}
                </p>
              )}

              <p>
                PM: <strong>{project.projectManager?.name || "Unassigned"}</strong>
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
            </div>

            {/* ACTIONS */}
            <div style={actionsRow}>
              <button
                style={editBtn}
                onClick={() => setEditProject(project)}
              >
                Edit
              </button>

              <button
                style={archiveBtn}
                onClick={() => handleArchive(project._id)}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: 40,
  background: "#020617",
  color: "#e5e7eb",
};

const title = {
  fontSize: 28,
  marginBottom: 24,
};

const formCard = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: 24,
  borderRadius: 12,
  marginBottom: 32,
};

const form = {
  display: "grid",
  gridTemplateColumns: "2fr 3fr 1.5fr auto",
  gap: 12,
};

const input = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
};

const createBtn = {
  background: "#2563eb",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  padding: "10px 18px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 24,
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 14,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 16,
};

const actionsRow = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const editBtn = {
  flex: 1,
  background: "#7f1d1d",
  color: "#fee2e2",
  border: "none",
  borderRadius: 8,
  padding: "8px",
  cursor: "pointer",
};

const archiveBtn = {
  flex: 1,
  background: "transparent",
  color: "#ef4444",
  border: "1px solid #dc2626",
  borderRadius: 8,
  padding: "8px",
  cursor: "pointer",
};

const select = {
  width: "100%",
  padding: "8px",
  borderRadius: 6,
  background: "#0f172a",
  color: "#fff",
  border: "1px solid #334155",
  marginTop: 8,
};

const muted = {
  color: "#94a3b8",
  fontSize: 14,
};

const dateText = {
  fontSize: 13,
  color: "#94a3b8",
};

const loadingText = {
  padding: 40,
  color: "#94a3b8",
};

