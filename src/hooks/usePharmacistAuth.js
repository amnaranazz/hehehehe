// src/hooks/usePharmacistAuth.js
import { useState } from 'react';

export function usePharmacistAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password, rememberMe) => {
    setIsLoading(true);
    // Mock
    setTimeout(() => setIsLoading(false), 1000);
  };

  const logout = () => {
    setUser(null);
  }

  return { login, logout, isLoading, user };
}
