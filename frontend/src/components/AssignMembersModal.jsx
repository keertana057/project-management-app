import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AssignMembersModal({ projectId, onClose, onUpdated }) {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/users")
      .then(res => {
        const emps = res.data.filter(u => u.role === "EMPLOYEE");
        setEmployees(emps);
      })
      .catch(() => alert("Failed to load users"));
  }, []);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const submit = async () => {
    try {
      setLoading(true);
      await api.put(`/projects/${projectId}/members`, {
        members: selected,
      });
      onUpdated();
      onClose();
    } catch {
      alert("Failed to assign members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={title}>Assign Members</h3>

        <div style={list}>
          {employees.map(e => (
            <label key={e._id} style={row}>
              <input
                type="checkbox"
                checked={selected.includes(e._id)}
                onChange={() => toggle(e._id)}
                style={checkbox}
              />
              <span>
                {e.name}
                <span style={email}> ({e.email})</span>
              </span>
            </label>
          ))}
        </div>

        <div style={actions}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={{
              ...saveBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}


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
  borderRadius: 12,
  width: 420,
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
};

const title = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
};

const list = {
  maxHeight: 240,
  overflowY: "auto",
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
  fontSize: 14,
  cursor: "pointer",
  color: "#020617",
};

const checkbox = {
  width: 16,
  height: 16,
  cursor: "pointer",
};

const email = {
  color: "#64748b",
  fontSize: 12,
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const cancelBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  background: "#f8fafc",
  cursor: "pointer",
};

const saveBtn = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
};
