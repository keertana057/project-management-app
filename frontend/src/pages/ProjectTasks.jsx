import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

export default function ProjectTasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const t = await api.get(`/tasks/project/${id}`);
    const u = await api.get("/users");
    setTasks(t.data);
    setUsers(u.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h2>Tasks</h2>

      <TaskForm projectId={id} users={users} reload={load} />

      {tasks.map((t) => (
        <TaskCard key={t._id} task={t} reload={load} />
      ))}
    </div>
  );
}
