import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  return (
    <div className="container">
      <h2>My Projects</h2>
      <button onClick={logout}>Logout</button>

      {projects.map((p) => (
        <div key={p._id} className="card">
          {p.name}
        </div>
      ))}
    </div>
  );
}
