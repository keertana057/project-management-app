import { useState } from "react";

export default function CreateTaskModal({
    members,
    tasks = [], 
    onClose,
    onCreate,
}) {
    const [activeTab, setActiveTab] = useState("details"); 
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        deadline: "",
        assignedTo: "",
        subtasks: [],
        dependencies: []
    });

    /* FORM UPDATES */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* SUBTASKS LOGIC */
    const [newSubtask, setNewSubtask] = useState({ title: "", assignedTo: "" });

    const addSubtask = () => {
        if (!newSubtask.title) return;
        setForm(prev => ({
            ...prev,
            subtasks: [
                ...prev.subtasks,
                { ...newSubtask, status: 'TODO', priority: 'MEDIUM' }
            ]
        }));
        setNewSubtask({ title: "", assignedTo: "" });
    };

    const removeSubtask = (index) => {
        const next = [...form.subtasks];
        next.splice(index, 1);
        setForm({ ...form, subtasks: next });
    };

    /* DEPENDENCIES LOGIC */
    const toggleDependency = (id) => {
        setForm(prev => {
            const exists = prev.dependencies.includes(id);
            return {
                ...prev,
                dependencies: exists
                    ? prev.dependencies.filter(d => d !== id)
                    : [...prev.dependencies, id]
            };
        });
    };

    /* SUBMIT */
    const submit = () => {
        if (!form.title || !form.assignedTo) return;
        onCreate(form);
    };

    return (
        <div style={overlay}>
            <div style={modal} className="glass-panel animate-fade-in">
                <div style={header}>
                    <h3>Create New Task</h3>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>

                <div style={tabs}>
                    <button
                        style={activeTab === 'details' ? activeTabBtn : tabBtn}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        style={activeTab === 'subtasks' ? activeTabBtn : tabBtn}
                        onClick={() => setActiveTab('subtasks')}
                    >
                        Subtasks ({form.subtasks.length})
                    </button>
                    <button
                        style={activeTab === 'dependencies' ? activeTabBtn : tabBtn}
                        onClick={() => setActiveTab('dependencies')}
                    >
                        Dependencies ({form.dependencies.length})
                    </button>
                </div>

                <div style={content}>
                    {activeTab === 'details' && (
                        <>
                            <label style={label}>Title</label>
                            <input
                                style={input}
                                name="title"
                                placeholder="Task title"
                                value={form.title}
                                onChange={handleChange}
                                className="input-focus"
                            />

                            <label style={label}>Description</label>
                            <textarea
                                style={{ ...input, height: 80, resize: 'none' }}
                                name="description"
                                placeholder="Task description..."
                                value={form.description}
                                onChange={handleChange}
                                className="input-focus"
                            />

                            <div style={row}>
                                <div style={{ flex: 1 }}>
                                    <label style={label}>Priority</label>
                                    <select
                                        style={input}
                                        name="priority"
                                        value={form.priority}
                                        onChange={handleChange}
                                        className="input-focus"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={label}>Deadline</label>
                                    <input
                                        type="date"
                                        style={input}
                                        name="deadline"
                                        value={form.deadline}
                                        onChange={handleChange}
                                        className="input-focus"
                                    />
                                </div>
                            </div>

                            <label style={label}>Assign To</label>
                            <select
                                style={input}
                                name="assignedTo"
                                value={form.assignedTo}
                                onChange={handleChange}
                                className="input-focus"
                            >
                                <option value="">Select Employee</option>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {activeTab === 'subtasks' && (
                        <div>
                            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
                                Add subtasks to break down this task.
                            </p>

                            <div style={subtaskInputRow}>
                                <input
                                    style={{ ...input, marginBottom: 0 }}
                                    placeholder="New subtask title"
                                    value={newSubtask.title}
                                    onChange={e => setNewSubtask({ ...newSubtask, title: e.target.value })}
                                />
                                <select
                                    style={{ ...input, marginBottom: 0, width: 140 }}
                                    value={newSubtask.assignedTo}
                                    onChange={e => setNewSubtask({ ...newSubtask, assignedTo: e.target.value })}
                                >
                                    <option value="">Assignee</option>
                                    {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                                </select>
                                <button onClick={addSubtask} style={addBtn}>+</button>
                            </div>

                            <div style={list}>
                                {form.subtasks.map((st, i) => (
                                    <div key={i} style={listItem}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500 }}>{st.title}</div>
                                            <div style={subText}>
                                                {members.find(m => m._id === st.assignedTo)?.name || 'Unassigned'}
                                            </div>
                                        </div>
                                        <button onClick={() => removeSubtask(i)} style={removeBtn}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'dependencies' && (
                        <div>
                            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
                                Select tasks that must be completed BEFORE this task.
                            </p>
                            {tasks.length === 0 ? (
                                <p style={{ color: '#64748b', fontStyle: 'italic' }}>No other tasks available.</p>
                            ) : (
                                <div style={list}>
                                    {tasks.map(t => {
                                        const isDep = form.dependencies.includes(t._id);
                                        return (
                                            <div
                                                key={t._id}
                                                style={{
                                                    ...listItem,
                                                    background: isDep ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)'
                                                }}
                                                onClick={() => toggleDependency(t._id)}
                                            >
                                                <input type="checkbox" checked={isDep} readOnly style={{ marginRight: 10, accentColor: '#3b82f6' }} />
                                                <span>{t.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={footer}>
                    <button onClick={onClose} style={cancelBtn}>Cancel</button>
                    <button onClick={submit} style={primary}>
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}

/* styles */
const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modal = {
    padding: 0,
    borderRadius: 16,
    width: 600,
    color: "#e5e7eb",
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: "90vh"
};

const header = { padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" };
const closeBtn = { background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" };

const tabs = { display: "flex", background: "rgba(0,0,0,0.2)", padding: "0 24px" };
const tabBtn = { background: "transparent", border: "none", color: "#94a3b8", padding: "12px 16px", cursor: "pointer", borderBottom: "2px solid transparent" };
const activeTabBtn = { ...tabBtn, color: "#fff", borderBottom: "2px solid #3b82f6" };

const content = { padding: 24, overflowY: "auto", flex: 1 };

const footer = { padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "right", background: "rgba(0,0,0,0.2)", display: 'flex', justifyContent: 'flex-end', gap: 12 };


const label = { display: 'block', fontSize: 12, marginBottom: 6, color: '#94a3b8' };

const input = {
    width: "100%",
    marginBottom: 16,
    padding: "10px 12px",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 14,
    outline: 'none'
};

const row = { display: 'flex', gap: 16 };

const cancelBtn = {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#cbd5e1',
    padding: "8px 16px",
    borderRadius: 8,
    cursor: 'pointer'
};

const primary = {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer'
};

const subtaskInputRow = { display: 'flex', gap: 8, marginBottom: 16 };
const addBtn = { background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, width: 40, cursor: 'pointer', fontSize: 18 };

const list = { display: 'flex', flexDirection: 'column', gap: 8 };
const listItem = { display: 'flex', alignItems: 'center', padding: "8px 12px", background: 'rgba(255,255,255,0.02)', borderRadius: 8, cursor: 'pointer' };
const subText = { fontSize: 11, color: '#94a3b8' };
const removeBtn = { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18 };
