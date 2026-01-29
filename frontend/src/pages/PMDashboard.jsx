import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPMProjects } from "../api/projectApi";
import { useToast } from "../ui/ToastContext";

export default function PMDashboard() {
    const [projects, setProjects] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        async function load() {
            try {
                const res = await getPMProjects();
                setProjects(res.data);
            } catch (err) {
                showToast("Failed to load projects", "error");
            }
        }
        load();
    }, []);

    return (
        <div style={page} className="animate-fade-in">
            <h1 style={header}>Project Manager Dashboard</h1>

            {projects.length === 0 ? (
                <div style={empty}>
                    <p>You have no assigned projects yet.</p>
                </div>
            ) : (
                <div style={grid}>
                    {projects.map((p, i) => (
                        <div
                            key={p._id}
                            style={{ ...card, animationDelay: `${i * 0.1}s` }}
                            className="glass-panel animate-fade-in card-hover"
                        >
                            <div style={cardHeader}>
                                <h3 style={title}>{p.name}</h3>
                                <span style={statusBadge(p.status)}>{p.status}</span>
                            </div>

                            <p style={desc}>{p.description || "No description provided."}</p>

                            <div style={meta}>
                                <div>Created: {new Date(p.createdAt).toLocaleDateString()}</div>
                                {p.endDate && <div>Deadline: {new Date(p.endDate).toLocaleDateString()}</div>}
                            </div>

                            <div style={footer}>
                                <div style={members}>
                                    <span style={memberCount}>{p.members.length} Members</span>
                                </div>
                                <Link to={`/pm/projects/${p._id}`}>
                                    <button style={btn}>Manage Project →</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* Styles */
const page = { padding: "40px", color: "#fff", maxWidth: 1200, margin: "0 auto" };
const header = { fontSize: "2rem", marginBottom: "30px", fontWeight: "700" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" };

const card = {
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "220px",
    opacity: 0, // for fade-in
};

const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" };
const title = { fontSize: "1.25rem", fontWeight: "600", margin: 0, color: "#fff" };
const desc = { color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px", flex: 1 };

const meta = { fontSize: "0.8rem", color: "#64748b", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "4px" };

const footer = { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" };

const btn = {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "background 0.2s"
};

const statusBadge = (status) => ({
    fontSize: "0.7rem",
    padding: "4px 8px",
    borderRadius: "12px",
    fontWeight: "600",
    background: status === 'COMPLETED' ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)",
    color: status === 'COMPLETED' ? "#4ade80" : "#fde047",
});

const empty = { textAlign: "center", padding: "60px", color: "#64748b", border: "1px dashed #334155", borderRadius: "16px" };
const members = { display: 'flex', alignItems: 'center' };
const memberCount = { fontSize: '0.8rem', color: '#94a3b8' };
