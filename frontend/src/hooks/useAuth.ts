import { useState, useCallback, useMemo } from 'react';
import api from '../utils/api';

interface User {
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  });

  const setAuth = useCallback((user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ user, token });
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ user: null, token: null });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.user, response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [setAuth]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, username });
      setAuth(response.data.user, response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return useMemo(() => ({
    user: authState.user,
    token: authState.token,
    login,
    register,
    logout,
  }), [authState.user, authState.token, login, register, logout]);
};