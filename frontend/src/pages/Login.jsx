import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data);
      showToast("Login successful", "success");

      if (res.data.role === "ADMIN") navigate("/admin");
      else if (res.data.role === "PROJECT_MANAGER") navigate("/pm");
      else navigate("/employee");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Login failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={handleLogin}>
        <h1 style={title}>Project Management</h1>
        <p style={subtitle}>Sign in to continue</p>

        <div style={field}>
          <label style={label}>Email</label>
          <input
            style={input}
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={field}>
          <label style={label}>Password</label>
          <input
            style={input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={button} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

/* ===== styles ===== */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #020617, #0f172a)",
};

const card = {
  width: 380,
  background: "#020617",
  padding: "36px 32px",
  borderRadius: 12,
  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
};

const title = {
  color: "#fff",
  marginBottom: 4,
};

const subtitle = {
  color: "#94a3b8",
  marginBottom: 28,
  fontSize: 14,
};

const field = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 18,
};

const label = {
  color: "#cbd5f5",
  fontSize: 13,
  marginBottom: 6,
};

const input = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#fff",
  outline: "none",
  fontSize: 14,
};

const button = {
  marginTop: 12,
  padding: "12px",
  width: "100%",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
};
