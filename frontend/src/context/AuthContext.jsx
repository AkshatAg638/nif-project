import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.twoFactorRequired) {
        return { success: true, twoFactorRequired: true, tempToken: res.data.tempToken };
      }
      if (res.data.success) {
        setUser(res.data.user);
        // Save token to header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('token', res.data.token);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const login2FA = async (token, code) => {
    try {
      const res = await axios.post('/api/auth/verify-2fa', { token, code });
      if (res.data.success) {
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('token', res.data.token);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      throw error.response?.data?.message || 'Invalid 2FA code';
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('token', res.data.token);
        return { success: true };
      }
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Restore token from localStorage on initialization if it exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user && ['super-admin', 'admin'].includes(user.role),
        isEditor: user && ['super-admin', 'admin', 'editor'].includes(user.role),
        login,
        login2FA,
        register,
        logout,
        checkUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
