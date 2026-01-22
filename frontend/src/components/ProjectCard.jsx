export default function ProjectCard({ project, onStatusChange, onOpen }) {
  return (
    <div className="card">
      <h4>{project.name}</h4>
      <div>Status: {project.status}</div>
      <div>Priority: {project.priority}</div>
      <div>
        {project.startDate?.slice(0,10)} → {project.endDate?.slice(0,10)}
      </div>

      <select
        value={project.status}
        onChange={(e) => onStatusChange(project._id, e.target.value)}
      >
        <option>ONGOING</option>
        <option>ON_HOLD</option>
        <option>COMPLETED</option>
      </select>

      <button onClick={() => onOpen(project._id)}>
        View Tasks
      </button>
    </div>
  );
}
