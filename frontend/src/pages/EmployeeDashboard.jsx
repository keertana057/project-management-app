import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployeeProjects } from "../api/projectApi";
import { getMyTasks, updateTaskStatus } from "../api/taskApi";
import { useToast } from "../ui/ToastContext";

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        getEmployeeProjects(),
        getMyTasks()
      ]);
      setProjects(pRes.data);
      setTasks(tRes.data);
    } catch (err) {
      showToast("Failed to load dashboard data", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      showToast("Task status updated", "success");

      // Optimistic update
      setTasks(prev => prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const activeTasks = tasks.filter(t => t.status !== 'DONE');
  const completedTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div style={page} className="animate-fade-in">
      <h1 style={header}>My Dashboard</h1>

      {/* MY TASKS SECTION */}
      <section style={section}>
        <h2 style={sectionTitle}>My Active Tasks ({activeTasks.length})</h2>
        {activeTasks.length === 0 ? (
          <div style={empty}>No active tasks. You're all caught up!</div>
        ) : (
          <div style={taskGrid}>
            {activeTasks.map(t => (
              <div key={t._id} style={taskCard} className="glass-panel card-hover">
                <div style={flexBetween}>
                  <h3 style={taskTitle}>{t.title}</h3>
                  <span style={priorityBadge(t.priority)}>{t.priority}</span>
                </div>
                <p style={taskDesc}>{t.description || 'No description'}</p>

                <div style={flexBetween}>
                  <div style={meta}>
                    Due: {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                  <select
                    style={statusSelect(t.status)}
                    value={t.status}
                    onChange={(e) => handleStatusChange(t._id, e.target.value)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MY PROJECTS SECTION */}
      <section style={section}>
        <h2 style={sectionTitle}>My Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <div style={empty}>You are not assigned to any projects.</div>
        ) : (
          <div style={grid}>
            {projects.map(p => (
              <div key={p._id} style={projectCard} className="glass-panel card-hover">
                <div style={flexBetween}>
                  <h3 style={projectTitle}>{p.name}</h3>
                  <span style={statusBadge(p.status)}>{p.status}</span>
                </div>
                <p style={projectDesc}>{p.description}</p>
                <div style={flexBetween}>
                  <span style={meta}>Deadline: {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A'}</span>
                  {/* Placeholder for future detailed view link */}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* STYLES */
const page = { padding: "40px", color: "#e5e7eb", maxWidth: 1200, margin: "0 auto" };
const header = { fontSize: "2rem", marginBottom: "40px", fontWeight: "700", color: "#fff" };

const section = { marginBottom: 60 };
const sectionTitle = { fontSize: "1.5rem", marginBottom: 20, color: "#cbd5e1", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 };

const empty = { padding: 40, textAlign: 'center', color: '#64748b', border: '1px dashed #334155', borderRadius: 16 };

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 };
const taskGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 };

const flexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

/* Task Card */
const taskCard = { padding: 20, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 };
const taskTitle = { fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 };
const taskDesc = { fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, flex: 1 };
const meta = { fontSize: '0.8rem', color: '#64748b' };

/* Project Card */
const projectCard = { padding: 24, borderRadius: 16 };
const projectTitle = { fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 };
const projectDesc = { fontSize: '0.9rem', color: '#94a3b8', margin: "12px 0 20px 0" };

/* Badges & Inputs */
const priorityBadge = (p) => ({
  fontSize: 10, padding: '2px 8px', borderRadius: 4,
  background: p === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : p === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
  color: p === 'HIGH' ? '#fca5a5' : p === 'MEDIUM' ? '#fcd34d' : '#93c5fd',
  fontWeight: 600
});

const statusBadge = (s) => ({
  fontSize: 10, padding: '2px 8px', borderRadius: 4,
  background: s === 'COMPLETED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
  color: s === 'COMPLETED' ? '#4ade80' : '#fde047',
  fontWeight: 600
});

const statusSelect = (s) => ({
  background: s === 'DONE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
  color: s === 'DONE' ? '#4ade80' : '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '4px 8px',
  fontSize: 12,
  outline: 'none',
  cursor: 'pointer'
});
