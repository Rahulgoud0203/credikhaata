import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('credikhaata_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('credikhaata_user'); }
    }
  }, []);

  const signup = (email, password, name) => {
    if (!email || !password || !name) return { success: false, message: 'All fields are required' };
    if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters' };

    const users = JSON.parse(localStorage.getItem('credikhaata_users') || '[]');
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    users.push({ email, password, name });
    localStorage.setItem('credikhaata_users', JSON.stringify(users));

    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('credikhaata_user', JSON.stringify(userData));
    return { success: true, message: 'Account created successfully' };
  };

  const login = (email, password) => {
    if (!email || !password) return { success: false, message: 'Email and password are required' };

    const users = JSON.parse(localStorage.getItem('credikhaata_users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password' };

    const userData = { email: found.email, name: found.name };
    setUser(userData);
    localStorage.setItem('credikhaata_user', JSON.stringify(userData));
    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('credikhaata_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
