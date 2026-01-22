import { useState } from "react";
import api from "../api/axios";

export default function TaskForm({ projectId, users, reload }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/tasks", {
      title,
      project: projectId,
      priority,
      assignedTo
    });
    setTitle("");
    reload();
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">Assign</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      <select onChange={(e) => setPriority(e.target.value)}>
        <option>LOW</option>
        <option>MEDIUM</option>
        <option>HIGH</option>
      </select>

      <button>Create Task</button>
    </form>
  );
}

