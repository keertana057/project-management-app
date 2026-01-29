import { useState } from "react";

export default function CreateTaskModal({
  members,
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const submit = () => {
    if (!title || !assignedTo) return;
    onCreate({ title, assignedTo });
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Create Task</h3>

        <input
          style={input}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={input}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to employee</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <div style={actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} style={primary}>
            Create
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
  background: "rgba(0,0,0,.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 10,
  padding: 20,
  width: 400,
  color: "#e5e7eb",
};

const input = {
  width: "100%",
  marginBottom: 10,
  padding: 8,
  background: "#020617",
  color: "#e5e7eb",
  border: "1px solid #334155",
  borderRadius: 6,
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const primary = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
};


