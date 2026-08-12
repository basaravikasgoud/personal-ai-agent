import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('agent_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('agent_token', res.data.token);
        }
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('agent_token', res.data.token);
        }
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('agent_token');
      setUser(null);
    }
  };

  const updatePreferences = async (newPrefs) => {
    try {
      const res = await API.patch('/users/preferences', newPrefs);
      if (res.data.success) {
        setUser((prev) => (prev ? { ...prev, preferences: res.data.preferences } : null));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updatePreferences,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
