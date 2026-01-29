import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <nav style={nav}>
            <div style={logo}>Project Management</div>
            <div style={actions}>
                <div style={userInfo}>
                    <span style={roleBadge(user.role)}>{user.role}</span>
                    <span style={userName}>{user.name}</span>
                </div>
                <button onClick={handleLogout} style={logoutBtn}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

/* Styles */
const nav = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 50
};

const logo = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "0.5px"
};

const actions = {
    display: "flex",
    alignItems: "center",
    gap: "24px"
};

const userInfo = {
    display: 'flex',
    alignItems: 'center',
    gap: 12
};

const userName = {
    fontSize: 14,
    color: '#e2e8f0'
};

const roleBadge = (role) => ({
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 4,
    background: '#334155',
    color: '#94a3b8',
    fontWeight: 600
});

const logoutBtn = {
    background: "rgba(220, 38, 38, 0.2)",
    border: "1px solid rgba(220, 38, 38, 0.5)",
    color: "#fca5a5",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s"
};
