import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // or <LoadingPage />

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
