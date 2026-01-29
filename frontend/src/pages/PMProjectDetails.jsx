import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPMProjects, assignEmployees, updateProjectStatus } from "../api/projectApi";
import { getEmployees } from "../api/userApi";
import { getTasksByProject, createTask } from "../api/taskApi";
import AssignEmployeesModal from "../components/AssignEmployeesModal";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import { useToast } from "../ui/ToastContext";

export default function PMProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showAssign, setShowAssign] = useState(false);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const load = async () => {
        try {
            const [pRes, eRes, tRes] = await Promise.all([
                getPMProjects(),
                getEmployees(),
                getTasksByProject(id),
            ]);

            const found = pRes.data.find((p) => p._id === id);
            if (!found) {
                showToast("Project not found", "error");
                navigate("/pm");
                return;
            }

            setProject(found);
            setEmployees(eRes.data);
            setTasks(tRes.data);
        } catch {
            showToast("Error loading project details", "error");
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    if (!project) return <p style={loadingText}>Loading...</p>;

    return (
        <div style={page} className="animate-fade-in">
            <div style={header}>
                <button onClick={() => navigate("/pm")} style={backBtn}>
                    ← Back
                </button>
                <h1 style={title}>{project.name}</h1>
            </div>

            <div style={grid}>
                {/* LEFT COLUMN: DETAILS & MEMBERS */}
                <div style={col}>
                    <div style={card} className="glass-panel">
                        <h3>Project Details</h3>
                        <p style={muted}>{project.description}</p>
                        <div style={statRow}>
                            <span>Deadline: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
                            <div style={flexCenter}>
                                <label style={{ fontSize: 12, color: '#94a3b8', marginRight: 8 }}>Status:</label>
                                <select
                                    style={projectStatusSelect(project.status)}
                                    value={project.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value;
                                        // specific logic for status update
                                        try {
                                            await updateProjectStatus(project._id, newStatus);
                                            showToast('Project status updated', 'success');
                                            setProject({ ...project, status: newStatus });
                                        } catch (err) {
                                            showToast('Failed to update status', 'error');
                                        }
                                    }}
                                >
                                    <option value="PLANNED">Planned</option>
                                    <option value="ONGOING">Ongoing</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={card} className="glass-panel">
                        <div style={flexBetween}>
                            <h3>Team Members</h3>
                            <button onClick={() => setShowAssign(true)} style={actionBtn}>
                                + Manage Team
                            </button>
                        </div>

                        {project.members.length === 0 ? (
                            <p style={muted}>No members assigned.</p>
                        ) : (
                            <ul style={memberList}>
                                {project.members.map(m => (
                                    <li key={m._id} style={memberItem}>
                                        <div style={avatar}>{m.name.charAt(0)}</div>
                                        <div>
                                            <div style={memberName}>{m.name}</div>
                                            <div style={memberEmail}>{m.email}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: TASKS */}
                <div style={col}>
                    <div style={card} className="glass-panel">
                        <div style={flexBetween}>
                            <h3>Tasks</h3>
                            <button onClick={() => setShowCreateTask(true)} style={primaryBtn}>
                                + Create Task
                            </button>
                        </div>

                        {tasks.length === 0 ? (
                            <div style={emptyTasks}>
                                No tasks created yet.
                            </div>
                        ) : (
                            <div style={taskList}>
                                {tasks.map(t => (
                                    <div
                                        key={t._id}
                                        style={{ ...taskCard, cursor: 'pointer' }}
                                        className="card-hover"
                                        onClick={() => setSelectedTask(t)}
                                    >
                                        <div style={flexBetween}>
                                            <strong style={taskTitle}>{t.title}</strong>
                                            <span style={priorityBadge(t.priority)}>{t.priority}</span>
                                        </div>
                                        <p style={taskDesc}>{t.description}</p>

                                        <div style={taskMeta}>
                                            <span>Assignee: {t.assignedTo?.name || 'Unassigned'}</span>
                                            <span style={statusText(t.status)}>{t.status}</span>
                                        </div>

                                        {t.subtasks && t.subtasks.length > 0 && (
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                                                Subtasks: {t.subtasks.filter(s => s.status === 'DONE').length}/{t.subtasks.length}
                                            </div>
                                        )}

                                        {t.dependencies && t.dependencies.length > 0 && (
                                            <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>
                                                Depends on: {t.dependencies.length} task{t.dependencies.length !== 1 ? 's' : ''}
                                            </div>
                                        )}

                                        {t.deadline && (
                                            <div style={deadline}>Due: {new Date(t.deadline).toLocaleDateString()}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAssign && (
                <AssignEmployeesModal
                    employees={employees}
                    selected={project.members.map((m) => m._id)}
                    onClose={() => setShowAssign(false)}
                    onSave={async (ids) => {
                        await assignEmployees(id, ids);
                        showToast("Team updated successfully", "success");
                        setShowAssign(false);
                        load();
                    }}
                />
            )}

            {showCreateTask && (
                <CreateTaskModal
                    members={project.members}
                    tasks={tasks}
                    onClose={() => setShowCreateTask(false)}
                    onCreate={async (data) => {
                        await createTask({ ...data, project: id });
                        showToast("Task created successfully", "success");
                        setShowCreateTask(false);
                        load();
                    }}
                />
            )}

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    tasks={tasks}
                    members={project.members}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => {
                        showToast("Task updated", "success");
                        load();
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
}

/* STYLES */
const page = {
    minHeight: "100vh",
    padding: 40,
    color: "#e5e7eb",
};

const header = { marginBottom: 30 };
const title = { fontSize: 32, fontWeight: 700, color: '#fff', marginTop: 10 };
const backBtn = { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14 };

const grid = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 24,
    alignItems: 'start'
};

const col = { display: 'flex', flexDirection: 'column', gap: 24 };

const card = {
    padding: 24,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.05)'
};

const muted = { color: '#94a3b8', lineHeight: 1.6 };

const flexBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 };

const actionBtn = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12
};

const primaryBtn = {
    background: '#3b82f6',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600
};

const statRow = { display: 'flex', gap: 12, marginTop: 16, fontSize: 14 };

const statusBadge = (s) => ({
    padding: '2px 8px',
    borderRadius: 4,
    background: s === 'COMPLETED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
    color: s === 'COMPLETED' ? '#4ade80' : '#fde047',
    fontSize: 12,
    fontWeight: 600
});

const memberList = { listStyle: 'none', padding: 0, margin: 0 };
const memberItem = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.02)' };
const avatar = { width: 32, height: 32, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' };
const memberName = { fontSize: 14, fontWeight: 500 };
const memberEmail = { fontSize: 12, color: '#94a3b8' };

const taskList = { display: 'flex', flexDirection: 'column', gap: 12 };
const taskCard = { background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' };
const taskTitle = { fontSize: 16, display: 'block' };
const taskDesc = { fontSize: 14, color: '#bdbdbd', margin: '8px 0' };
const taskMeta = { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 12 };
const deadline = { fontSize: 12, color: '#f87171', marginTop: 4 };

const loadingText = { padding: 40, color: "#94a3b8" };
const emptyTasks = { textAlign: 'center', padding: 40, color: '#94a3b8', border: '1px dashed #334155', borderRadius: 12 };

const priorityBadge = (p) => ({
    fontSize: 10, padding: '2px 6px', borderRadius: 4,
    background: p === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
    color: p === 'HIGH' ? '#fca5a5' : '#93c5fd'
});

const statusText = (s) => ({
    color: s === 'DONE' ? '#4ade80' : '#cbd5e1'
});

const flexCenter = { display: 'flex', alignItems: 'center' };

const projectStatusSelect = (s) => ({
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: s === 'COMPLETED' ? '#4ade80' : s === 'ONGOING' ? '#fde047' : '#94a3b8',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 12,
    outline: 'none',
    cursor: 'pointer',
    fontWeight: 600
});
