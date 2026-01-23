export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p style={{ color: "#94a3b8" }}>No tasks created yet</p>;
  }

  return (
    <div style={list}>
      {tasks.map((task) => (
        <div key={task._id} style={card}>
          <h4 style={title}>{task.title}</h4>

          <p style={text}>
            <b>Status:</b>{" "}
            <span style={{ ...badge, ...statusColors[task.status] }}>
              {task.status}
            </span>
          </p>

          <p style={text}>
            <b>Priority:</b>{" "}
            <span style={{ ...badge, ...priorityColors[task.priority] }}>
              {task.priority}
            </span>
          </p>

          {task.assignedTo && (
            <p style={text}>
              <b>Assigned to:</b>{" "}
              <span style={assignee}>{task.assignedTo.name}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}



const list = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const card = {
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const title = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 10,
  color: "#020617",
};

const text = {
  fontSize: 14,
  color: "#334155",
  marginBottom: 6,
};

const assignee = {
  color: "#020617",
  fontWeight: 500,
};

const badge = {
  marginLeft: 6,
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
};

const statusColors = {
  TODO: { background: "#fee2e2", color: "#991b1b" },
  ONGOING: { background: "#dbeafe", color: "#1d4ed8" },
  DONE: { background: "#dcfce7", color: "#166534" },
};

const priorityColors = {
  LOW: { background: "#e5e7eb", color: "#374151" },
  MEDIUM: { background: "#fef3c7", color: "#92400e" },
  HIGH: { background: "#fee2e2", color: "#7f1d1d" },
};

