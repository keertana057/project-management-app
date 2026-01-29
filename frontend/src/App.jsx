import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PMDashboard from "./pages/PMDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import ProjectDetails from "./pages/ProjectDetails";
import PMProjectDetails from "./pages/PMProjectDetails";
import EmployeeProjectDetails from "./pages/EmployeeProjectDetails";

import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/useAuth"; // ✅ FIXED IMPORT

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ROOT REDIRECT */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.role === "ADMIN" ? (
            <Navigate to="/admin" replace />
          ) : user.role === "PROJECT_MANAGER" ? (
            <Navigate to="/pm" replace />
          ) : (
            <Navigate to="/employee" replace />
          )
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects/:id"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* ============== PROJECT MANAGER ============== */}
      <Route
        path="/pm"
        element={
          <ProtectedRoute roles={["PROJECT_MANAGER"]}>
            <PMDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pm/projects/:id"
        element={
          <ProtectedRoute roles={["PROJECT_MANAGER"]}>
            <PMProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* ================= EMPLOYEE ================= */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute roles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/projects/:id"
        element={
          <ProtectedRoute roles={["EMPLOYEE"]}>
            <EmployeeProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;



