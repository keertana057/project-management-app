import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../ui/ToastContext";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/register", form);
            showToast("Registration successful! Please login.", "success");
            navigate("/login");
        } catch (err) {
            showToast(err.response?.data?.message || "Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={page} className="animate-fade-in">
            <form style={card} className="glass-panel" onSubmit={handleRegister}>
                <h1 style={title}>Create Account</h1>
                <p style={subtitle}>Join as an Employee or Manager</p>

                <div style={field}>
                    <label style={label}>Full Name</label>
                    <input
                        style={input}
                        placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div style={field}>
                    <label style={label}>Email</label>
                    <input
                        style={input}
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>

                <div style={field}>
                    <label style={label}>Password</label>
                    <input
                        style={input}
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                </div>

                <div style={field}>
                    <label style={label}>Role</label>
                    <select
                        style={input}
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="PROJECT_MANAGER">Project Manager</option>
                        {/* Admin typically created manually, but could be added if needed */}
                    </select>
                </div>

                <button style={button} disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
                </p>
            </form>
        </div>
    );
}

/* ===== styles ===== */
const page = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" };
const card = { width: 380, padding: "36px 32px", borderRadius: 12 };
const title = { color: "#fff", marginBottom: 4 };
const subtitle = { color: "#94a3b8", marginBottom: 20, fontSize: 14 };
const field = { display: "flex", flexDirection: "column", marginBottom: 16 };
const label = { color: "#cbd5f5", fontSize: 13, marginBottom: 6 };
const input = { padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0, 0, 0, 0.3)", color: "#fff", outline: "none", fontSize: 14 };
const button = { marginTop: 12, padding: "12px", width: "100%", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" };
