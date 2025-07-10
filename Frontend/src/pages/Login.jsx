import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios.js"; 
import { AuthContext } from "../auth/AuthContext.jsx";
import { initiateGoogleAuth } from "../api/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => api.post("/users/login", form),
    onSuccess: (res) => {
      if (res.data.success) {
        const { accessToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken); 
        setUser(user); 
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    },
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    mutation.mutate();
  };

  const handleGoogleLogin = () => {
    try {
      initiateGoogleAuth();
    } catch (err) {
      setError("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your VideoVault account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
            error={error && !form.email}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
            error={error && !form.password}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Continue with Google
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
