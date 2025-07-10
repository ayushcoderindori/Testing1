// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Check for authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setConnectionError(false);
      // Check if we have a refresh token in cookies or access token in localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        // Try to refresh token if no access token
        await refreshToken();
        return;
      }

      // Try to get current user with existing token
      const { data } = await api.get("/users/current-user");
      if (data.success && data.data) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (err) {
      console.log("Authentication check failed:", err.message);
      
      // Check if it's a connection error
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setConnectionError(true);
        console.error("❌ Backend server is not running. Please start the backend server.");
      }
      
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
      setConnectionError(false);
      const { data } = await api.post("/users/refresh-token");
      
      if (data.success && data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        
        // Get user data after successful refresh
        const userData = await api.get("/users/current-user");
        if (userData.data.success && userData.data.data) {
          setUser(userData.data.data);
          setIsAuthenticated(true);
        }
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (err) {
      console.log("Token refresh failed:", err.message);
      
      // Check if it's a connection error
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setConnectionError(true);
        console.error("❌ Backend server is not running. Please start the backend server.");
      }
      
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setConnectionError(false);
      const { data } = await api.post("/users/login", credentials);
      
      if (data.success && data.data) {
        // Store access token
        if (data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        
        // Set user data
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.message || "Login failed" 
        };
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      
      // Check if it's a connection error
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setConnectionError(true);
        return { 
          success: false, 
          error: "Cannot connect to server. Please ensure the backend is running." 
        };
      }
      
      return { 
        success: false, 
        error: err.response?.data?.message || "Login failed. Please try again." 
      };
    }
  };

  const register = async (userData) => {
    try {
      setConnectionError(false);
      const { data } = await api.post("/users/register", userData);
      
      if (data.success && data.data) {
        return { success: true, data: data.data };
      } else {
        return { 
          success: false, 
          error: data.message || "Registration failed" 
        };
      }
    } catch (err) {
      console.error("Registration failed:", err.message);
      
      // Check if it's a connection error
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setConnectionError(true);
        return { 
          success: false, 
          error: "Cannot connect to server. Please ensure the backend is running." 
        };
      }
      
      return { 
        success: false, 
        error: err.response?.data?.message || "Registration failed. Please try again." 
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
    connectionError,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    setUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
