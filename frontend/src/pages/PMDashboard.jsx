import { useEffect, useState } from "react";
import { getPMProjects } from "../api/projectApi";
import { useNavigate } from "react-router-dom";

const PMDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getPMProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Project Manager Dashboard</h2>

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>Employees Assigned: {project.members.length}</p>

          <button
            onClick={() => navigate(`/pm/projects/${project._id}`)}
          >
            Manage Project
          </button>
        </div>
      ))}
    </div>
  );
};

export default PMDashboard;
