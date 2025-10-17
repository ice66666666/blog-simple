import { createContext, useContext, useMemo, useState } from "react";
import { login as loginSvc, register as registerSvc, logout as logoutSvc } from "../services/authService";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const isAuthenticated = !!user;

  const login = async (credentials) => {
    const data = await loginSvc(credentials);
    setUser(data.user);
    // El token ya se guarda en authService.js
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerSvc(payload);
    // opcional: iniciar sesión tras registro
    return data.user;
  };

  const logout = () => {
    logoutSvc();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
