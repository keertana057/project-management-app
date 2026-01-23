import { useState } from "react";
import api from "../api/axios";

export default function EditProjectModal({ project, onClose, onUpdated }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [priority, setPriority] = useState(project.priority);
  const [status, setStatus] = useState(project.status);
  const [startDate, setStartDate] = useState(
    project.startDate ? project.startDate.slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    project.endDate ? project.endDate.slice(0, 10) : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put(`/projects/${project._id}`, {
        name,
        description,
        priority,
        status,
        startDate,
        endDate,
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={title}>Edit Project</h2>

        <div style={field}>
          <label style={label}>Project Name</label>
          <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={field}>
          <label style={label}>Description</label>
          <textarea
            style={textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={row}>
          <div style={field}>
            <label style={label}>Priority</label>
            <select style={select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div style={field}>
            <label style={label}>Status</label>
            <select style={select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PLANNED">Planned</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div style={row}>
          <div style={field}>
            <label style={label}>Start Date</label>
            <input type="date" style={input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div style={field}>
            <label style={label}>End Date</label>
            <input type="date" style={input} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div style={actions}>
          <button style={secondaryBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button style={primaryBtn} onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
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
  background: "rgba(2,6,23,0.75)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modal = {
  width: 420,
  background: "#f8fafc",
  borderRadius: 14,
  padding: 24,
  boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
};

const title = {
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 20,
  color: "#020617",
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 14,
};

const label = {
  fontSize: 13,
  color: "#475569",
};

const input = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  fontSize: 14,
};

const textarea = {
  ...input,
  resize: "none",
  minHeight: 80,
};

const select = {
  ...input,
  background: "#fff",
};

const row = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 20,
};

const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
};
