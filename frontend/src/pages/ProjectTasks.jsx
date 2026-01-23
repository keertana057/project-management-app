import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProjectTasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/tasks/project/${id}`).then((res) => setTasks(res.data));
  }, [id]);

  return (
    <div>
      <h2>Project Tasks</h2>

      {tasks.map((t) => (
        <div key={t._id}>
          {t.title} – {t.status}
        </div>
      ))}
    </div>
  );
}
