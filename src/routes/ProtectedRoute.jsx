// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePharmacistAuth } from '../hooks/usePharmacistAuth';

export default function ProtectedRoute() {
  const { getUser } = usePharmacistAuth();
  
  // Directly check storage to avoid any flash of unauthenticated state
  if (!getUser()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
