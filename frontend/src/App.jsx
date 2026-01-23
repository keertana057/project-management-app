import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import ProjectDetails from "./pages/ProjectDetails";
import EmployeeProjectDetails from "./pages/EmployeeProjectDetails";


function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate to={user.role === "ADMIN" ? "/admin" : "/employee"} />
            : <Navigate to="/login" />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />

      <Route
        path="/admin/projects/:id"
        element={
          <ProtectedRoute role="ADMIN">
            <ProjectDetails />
          </ProtectedRoute>
        }
      />


      <Route
        path="/employee"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/projects/:id"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeProjectDetails />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}

export default App;

