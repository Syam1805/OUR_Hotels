// src/hooks/useAuth.js
import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { login as apiLogin, getUserProfile } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load stored user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");

    if (token && role && userId) {
      getUserProfile(userId, token)
        .then((profile) => {
          setUser({
            token,
            role,
            userId,
            email,
            name: profile?.name || "",
            phone: profile?.phone || "",
            ...profile,
          });
        })
        .catch(() => {
          // fallback if profile fetch fails
          setUser({ token, role, userId, email });
        });
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await apiLogin({ email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("email", res.email);

      let profile = {};
      try {
        profile = await getUserProfile(res.userId, res.token);
      } catch {
        profile = {};
      }

      setUser({
        token: res.token,
        role: res.role,
        userId: res.userId,
        email: res.email,
        name: profile?.name || "",
        phone: profile?.phone || "",
        ...profile,
      });
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // let UI handle error messages
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    setUser(null);
  };

  // Memoize value so consumers don’t re-render unnecessarily
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
