import { useState } from "react";

export default function AssignEmployeesModal({
  employees,
  selected,
  onClose,
  onSave,
}) {
  const [selectedEmployees, setSelectedEmployees] = useState(selected);
  const [search, setSearch] = useState("");

  const toggle = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={overlay}>
      <div style={modal} className="glass-panel animate-fade-in">
        <h3 style={{ marginBottom: 20 }}>Manage Team Members</h3>

        <input
          style={searchInput}
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-focus"
        />

        <div style={listContainer}>
          {filtered.map((emp) => {
            const isSelected = selectedEmployees.includes(emp._id);
            return (
              <div
                key={emp._id}
                style={{ ...row, background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)' }}
                onClick={() => toggle(emp._id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => { }} // handled by div click
                  style={{ accentColor: '#3b82f6' }}
                />
                <div>
                  <div style={name}>{emp.name}</div>
                  <div style={email}>{emp.email}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={actions}>
          <div style={count}>{selectedEmployees.length} selected</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={cancelBtn}>Cancel</button>
            <button
              onClick={() => onSave(selectedEmployees)}
              style={primary}
            >
              Save
            </button>
          </div>
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
  padding: 30,
  borderRadius: 16,
  width: 500,
  color: "#e5e7eb",
  maxHeight: "90vh",
  display: 'flex',
  flexDirection: 'column'
};

const searchInput = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#fff',
  marginBottom: 16,
  outline: 'none'
};

const listContainer = {
  flex: 1,
  overflowY: "auto",
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minHeight: 200,
  maxHeight: 400
};

const row = {
  display: "flex",
  alignItems: 'center',
  gap: 12,
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const name = { fontSize: 14, fontWeight: 500 };
const email = { fontSize: 12, color: '#94a3b8' };

const actions = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: 'center',
  marginTop: 20,
  paddingTop: 20,
  borderTop: '1px solid rgba(255,255,255,0.1)'
};

const count = { fontSize: 13, color: '#94a3b8' };

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
  padding: "8px 24px",
  borderRadius: 8,
  fontWeight: 600,
  cursor: 'pointer'
};
