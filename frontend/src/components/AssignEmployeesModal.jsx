import { useState } from "react";

export default function AssignEmployeesModal({
  employees,
  selected,
  onClose,
  onSave,
}) {
  const [selectedEmployees, setSelectedEmployees] = useState(selected);

  const toggle = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Assign Employees</h3>

        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {employees.map((emp) => (
            <label key={emp._id} style={row}>
              <input
                type="checkbox"
                checked={selectedEmployees.includes(emp._id)}
                onChange={() => toggle(emp._id)}
              />
              {emp.name} ({emp.email})
            </label>
          ))}
        </div>

        <div style={actions}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSave(selectedEmployees)}
            style={primary}
          >
            Save
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
  width: 420,
  color: "#e5e7eb",
};

const row = { display: "block", marginBottom: 6 };

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 14,
};

const primary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
};
