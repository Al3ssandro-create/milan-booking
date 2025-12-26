import { useState } from 'react';

const STORAGE_KEY = 'magellano3_auth';
const SECRET_PHRASE = 'sofa così comodo'; // The shared password

function getInitialAuth(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const isLoading = false; // No async loading needed

  const login = (phrase: string): boolean => {
    if (phrase.toLowerCase().trim() === SECRET_PHRASE.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
