import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={container}>
        {toasts.map((t) => (
          <div key={t.id} style={toast(t.type)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

/* styles */
const container = {
  position: "fixed",
  top: 20,
  right: 20,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const toast = (type) => ({
  padding: "10px 14px",
  borderRadius: 8,
  color: "#fff",
  background:
    type === "success"
      ? "#16a34a"
      : type === "error"
      ? "#dc2626"
      : "#334155",
  boxShadow: "0 10px 25px rgba(0,0,0,.3)",
});
