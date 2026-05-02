// src/hooks/usePharmacistAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_KEY = 'medsense_auth_user';

export function usePharmacistAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Read current user from storage
  const getUser = () => {
    try {
      const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getUser);

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 900));

    // Demo: accept any valid-looking credentials
    if (!email || password.length < 6) {
      setIsLoading(false);
      throw new Error('Invalid credentials. Password must be at least 6 characters.');
    }

    const userData = {
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: 'pharmacist',
      loginAt: new Date().toISOString(),
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return { login, logout, isLoading, user, isAuthenticated, getUser };
}
