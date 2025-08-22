import React, { createContext, useState, useEffect } from 'react';
import { login as authLogin, register } from '../api/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // Mock user data; ideally, fetch user profile from backend
      setUser({ userId: 1, role: localStorage.getItem('role') || 'USER' });
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await authLogin({ email, password });
    setToken(response.token);
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role || 'USER');
    setUser({ userId: 1, role: response.role || 'USER' }); // Adjust based on backend response
  };

  const registerUser = async (userData) => {
    await register(userData);
    await login(userData.email, userData.password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register: registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}