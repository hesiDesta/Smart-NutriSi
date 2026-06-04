import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('nutrisi_token') || null);
  const [user,  setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('nutrisi_user')); } catch { return null; }
  });

  /* Panggil setelah login berhasil */
  const login = useCallback((tokenVal, userData) => {
    localStorage.setItem('nutrisi_token', tokenVal);
    localStorage.setItem('nutrisi_user',  JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  }, []);

  /* Panggil setelah personalisasi selesai */
  const updateProfile = useCallback((childProfile, akgTargets, parentName) => {
    const updated = { ...(user || {}), childProfile, akgTargets, ...(parentName ? { parentName } : {}) };
    localStorage.setItem('nutrisi_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  /* Logout */
  const logout = useCallback(() => {
    localStorage.removeItem('nutrisi_token');
    localStorage.removeItem('nutrisi_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

