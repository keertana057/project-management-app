import api from "../api/axios";

export default function TaskCard({ task, reload }) {
  const update = async (status) => {
    await api.put(`/tasks/${task._id}/status`, { status });
    reload();
  };

  return (
    <div className="card">
      <b>{task.title}</b>
      <div>Status: {task.status}</div>
      <div>Priority: {task.priority}</div>
      <div>Assigned: {task.assignedTo?.name}</div>

      {task.dependencies?.length > 0 && (
        <div style={{ color: "red" }}>
          Blocked by dependencies
        </div>
      )}

      <select onChange={(e) => update(e.target.value)}>
        <option>TODO</option>
        <option>IN_PROGRESS</option>
        <option>DONE</option>
      </select>
    </div>
  );
}
