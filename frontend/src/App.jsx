import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PMDashboard from "./pages/PMDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import ProjectDetails from "./pages/ProjectDetails";
import PMProjectDetails from "./pages/PMProjectDetails";
import EmployeeProjectDetails from "./pages/EmployeeProjectDetails";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          user ? (
            user.role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : user.role === "PROJECT_MANAGER" ? (
              <Navigate to="/pm" />
            ) : (
              <Navigate to="/employee" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects/:id"
        element={
          <ProtectedRoute role="ADMIN">
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* PROJECT MANAGER */}
      <Route
        path="/pm"
        element={
          <ProtectedRoute role="PROJECT_MANAGER">
            <PMDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pm/projects/:id"
        element={
          <ProtectedRoute role="PROJECT_MANAGER">
            <PMProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE */}
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


