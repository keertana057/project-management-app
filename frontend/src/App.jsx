import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProjectTasks from "./pages/ProjectTasks";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
         <Route
           path="/projects/:id"
           element={
             <ProtectedRoute allowedRole="ADMIN">
              <ProjectTasks />
            </ProtectedRoute>
          }          />

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
