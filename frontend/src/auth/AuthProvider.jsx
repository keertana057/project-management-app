import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./auth.context";

const initAuthState = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem("user");
    }
  }

  return {
    token,
    user,
  };
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initAuthState);

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [auth.token]);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        isAuthenticated: !!auth.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
