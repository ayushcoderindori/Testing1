import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import api from "../api/axios";
import useAuth from "./useAuth";

export default function OAuthHandler() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Check if there's an error from OAuth provider
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError("Authentication was cancelled or failed");
          setLoading(false);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Try to get user data after OAuth callback
        const { data } = await api.get("/users/current-user");
        
        if (data.success && data.data) {
          setUser(data.data);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          throw new Error("Failed to get user data");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err.response?.data?.message || "Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, setUser, setIsAuthenticated, searchParams]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Completing your sign in...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: 2,
          px: 2
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Redirecting to login page...
        </Typography>
      </Box>
    );
  }

  return null;
}
