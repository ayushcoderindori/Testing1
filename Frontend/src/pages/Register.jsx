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

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => api.post("/users/register", form),
    onSuccess: (res) => {
      if (res.data.success) {
        const { accessToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken); 
        setUser(user); 
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    },
    onError: (err) => {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    },
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    mutation.mutate();
  };

  const handleGoogleLogin = () => {
    try {
      initiateGoogleAuth();
    } catch (err) {
      setError("Failed to initiate Google registration. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Join VideoVault
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account and start sharing
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
            name="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="name"
            error={error && !form.fullName}
          />
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="username"
            error={error && !form.username}
          />
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
            autoComplete="new-password"
            error={error && !form.password}
            helperText="Minimum 6 characters"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating Account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
