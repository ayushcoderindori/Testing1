// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have a refresh token in cookies or access token in localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        // Try to refresh token if no access token
        await refreshToken();
        return;
      }

      // Try to get current user with existing token
      const { data } = await api.get("/users/current-user");
      setUser(data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Authentication check failed:", err.message);
      // Clear any invalid tokens
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await api.post("/users/refresh-token");
      localStorage.setItem('accessToken', data.data.accessToken);
      
      // Get user data after successful refresh
      const userData = await api.get("/users/current-user");
      setUser(userData.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Token refresh failed:", err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/users/login", credentials);
      
      // Store access token
      if (data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
      }
      
      // Fetch user data
      const userData = await api.get("/users/current-user");
      setUser(userData.data.data);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err.message);
      return { 
        success: false, 
        error: err.response?.data?.message || "Login failed" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/users/register", userData);
      return { success: true, data };
    } catch (err) {
      console.error("Registration failed:", err.message);
      return { 
        success: false, 
        error: err.response?.data?.message || "Registration failed" 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.log("Logout API call failed:", err.message);
    } finally {
      // Always clear local state regardless of API success
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
