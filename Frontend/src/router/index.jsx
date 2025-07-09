import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import UploadVideo from "../pages/UploadVideo.jsx";
import VideoPlayer from "../pages/VideoPlayer.jsx";
import Profile from "../pages/Profile.jsx";

import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import useAuth from "../auth/useAuth.js";

export default function Router() {
  const { loading } = useAuth();

  // Show loading screen while authentication is being checked
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
          Loading BarterSkills...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-videos" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
