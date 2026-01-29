import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPMProjects, assignEmployees } from "../api/projectApi";
import { getEmployees } from "../api/userApi";
import { getTasksByProject, createTask } from "../api/taskApi";
import AssignEmployeesModal from "../components/AssignEmployeesModal";
import CreateTaskModal from "../components/CreateTaskModal";
import { useToast } from "../ui/ToastContext";

export default function PMProjectDetails() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const load = async () => {
    const [pRes, eRes, tRes] = await Promise.all([
      getPMProjects(),
      getEmployees(),
      getTasksByProject(id),
    ]);

    const found = pRes.data.find((p) => p._id === id);
    setProject(found);
    setEmployees(eRes.data);
    setTasks(tRes.data);
  };

  useEffect(() => {
    load().catch(() =>
      showToast("Failed to load project", "error")
    );
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <button onClick={() => setShowAssign(true)}>
        Assign Employees
      </button>

      <button onClick={() => setShowCreateTask(true)}>
        Create Task
      </button>

      <h3 style={{ marginTop: 20 }}>Tasks</h3>
      {tasks.map((t) => (
        <div key={t._id}>
          <strong>{t.title}</strong> – {t.status}
        </div>
      ))}

      {showAssign && (
        <AssignEmployeesModal
          employees={employees}
          selected={project.members.map((m) => m._id)}
          onClose={() => setShowAssign(false)}
          onSave={async (ids) => {
            await assignEmployees(id, ids);
            showToast("Employees updated", "success");
            setShowAssign(false);
            load();
          }}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          members={project.members}
          onClose={() => setShowCreateTask(false)}
          onCreate={async (data) => {
            await createTask({ ...data, project: id });
            showToast("Task created", "success");
            setShowCreateTask(false);
            load();
          }}
        />
      )}
    </div>
  );
}
