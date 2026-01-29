import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeProjects } from "../api/projectApi";
import { getMyTasksForProject, updateTaskStatus } from "../api/taskApi";
import { useToast } from "../ui/ToastContext";

export default function EmployeeProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        getEmployeeProjects(),
        getMyTasksForProject(id)
      ]);

      const found = pRes.data.find(p => p._id === id);
      if (!found) {
        showToast("Project not found or access denied", "error");
        navigate("/employee");
        return;
      }

      setProject(found);
      setTasks(tRes.data);
    } catch (err) {
      showToast("Failed to load project details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      showToast("Status updated", "success");

      // Optimistic update
      setTasks(prev => prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  if (loading) return <p style={loadingText}>Loading...</p>;
  if (!project) return null;

  return (
    <div style={page} className="animate-fade-in">
      <button onClick={() => navigate("/employee")} style={backBtn}>
        ← Back to Dashboard
      </button>

      {/* PROJECT HEADER */}
      <div style={card} className="glass-panel">
        <div style={header}>
          <h1 style={title}>{project.name}</h1>
          <span style={statusBadge(project.status)}>{project.status}</span>
        </div>
        <p style={desc}>{project.description || 'No description provided.'}</p>

        <div style={metaRow}>
          <div style={metaItem}>
            <span style={label}>Start Date</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div style={metaItem}>
            <span style={label}>Deadline</span>
            <span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div style={metaItem}>
            <span style={label}>My Tasks</span>
            <span>{tasks.length}</span>
          </div>
        </div>
      </div>

      {/* MY TASKS LIST */}
      <h2 style={sectionTitle}>My Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <div style={empty}>You have no tasks assigned in this project yet.</div>
      ) : (
        <div style={grid}>
          {tasks.map(t => (
            <div key={t._id} style={taskCard} className="glass-panel card-hover">
              <div style={flexBetween}>
                <strong style={taskTitle}>{t.title}</strong>
                <span style={priorityBadge(t.priority)}>{t.priority}</span>
              </div>

              <p style={taskDesc}>{t.description || "No description."}</p>

              {t.deadline && (
                <div style={deadline}>Due: {new Date(t.deadline).toLocaleDateString()}</div>
              )}

              <div style={controlRow}>
                <label style={statusLabel}>Status:</label>
                <select
                  style={statusSelect(t.status)}
                  value={t.status}
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">Ongoing</option>
                  <option value="DONE">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */
const page = { padding: "40px", color: "#e5e7eb", maxWidth: 1000, margin: "0 auto" };
const loadingText = { padding: 40, textAlign: "center", color: "#94a3b8" };
const backBtn = { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: 20, fontSize: 14 };

const card = { padding: 30, borderRadius: 16, marginBottom: 40 };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 };
const title = { fontSize: '2rem', margin: 0, color: '#fff' };
const desc = { color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 };

const metaRow = { display: 'flex', gap: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 };
const metaItem = { display: 'flex', flexDirection: 'column', gap: 4 };
const label = { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 };

const sectionTitle = { fontSize: '1.5rem', fontWeight: 600, marginBottom: 20, color: '#fff' };
const empty = { padding: 40, textAlign: 'center', color: '#64748b', border: '1px dashed #334155', borderRadius: 16 };

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 };

/* Task Card */
const taskCard = { padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 };
const flexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const taskTitle = { fontSize: '1.1rem', color: '#fff' };
const taskDesc = { fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, flex: 1 };
const deadline = { fontSize: 12, color: '#f87171' };

const controlRow = { display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' };
const statusLabel = { fontSize: 13, color: '#cbd5e1' };

/* Badges */
const statusBadge = (s) => ({
  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
  background: s === 'COMPLETED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
  color: s === 'COMPLETED' ? '#4ade80' : '#fde047'
});

const priorityBadge = (p) => ({
  fontSize: 10, padding: '2px 8px', borderRadius: 4,
  background: p === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : p === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
  color: p === 'HIGH' ? '#fca5a5' : p === 'MEDIUM' ? '#fcd34d' : '#93c5fd'
});

const statusSelect = (s) => ({
  background: s === 'DONE' ? 'rgba(34, 197, 94, 0.2)' : s === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
  color: s === 'DONE' ? '#4ade80' : s === 'IN_PROGRESS' ? '#93c5fd' : '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 13,
  outline: 'none',
  cursor: 'pointer',
  flex: 1
});
