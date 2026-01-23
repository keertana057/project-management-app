import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CreateTaskModal({
  projectId,
  projectStatus, // 👈 NEW
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users").then((res) => {
      setEmployees(res.data.filter((u) => u.role === "EMPLOYEE"));
    });
  }, []);

  const createTask = async () => {
    if (projectStatus === "ARCHIVED") return;

    if (!title.trim()) return alert("Task title required");

    try {
      setLoading(true);
      await api.post("/tasks", {
        title,
        priority,
        project: projectId,
        assignedTo: assignedTo || null,
      });
      onCreated();
      onClose();
    } catch {
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const isArchived = projectStatus === "ARCHIVED";

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={titleStyle}>Create Task</h3>

        {isArchived && (
          <p style={archivedNote}>
            This project is archived. You can’t add new tasks.
          </p>
        )}

        {/* Task title */}
        <div style={field}>
          <label style={label}>Task title</label>
          <input
            placeholder="e.g. Implement authentication API"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
            disabled={isArchived}
          />
        </div>

        {/* Priority */}
        <div style={field}>
          <label style={label}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={select}
            disabled={isArchived}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Assign member */}
        <div style={field}>
          <label style={label}>Assign to</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={select}
            disabled={isArchived}
          >
            <option value="">Unassigned</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={actions}>
          <button style={cancelBtn} onClick={onClose}>
            Close
          </button>

          <button
            style={{
              ...createBtn,
              opacity: loading || isArchived ? 0.5 : 1,
              cursor:
                loading || isArchived ? "not-allowed" : "pointer",
            }}
            onClick={createTask}
            disabled={loading || isArchived}
          >
            {isArchived ? "Archived" : loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#ffffff",
  color: "#020617",
  padding: 24,
  borderRadius: 14,
  width: 420,
  boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
};

const titleStyle = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
};

const archivedNote = {
  fontSize: 13,
  color: "#7f1d1d",
  background: "#fee2e2",
  padding: "8px 10px",
  borderRadius: 8,
  marginBottom: 12,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 14,
};

const label = {
  fontSize: 13,
  fontWeight: 500,
  color: "#334155",
};

const input = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  fontSize: 14,
  outline: "none",
};

const select = {
  ...input,
  background: "#ffffff",
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 22,
};

const cancelBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  background: "#f8fafc",
  cursor: "pointer",
};

const createBtn = {
  padding: "6px 16px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
};
