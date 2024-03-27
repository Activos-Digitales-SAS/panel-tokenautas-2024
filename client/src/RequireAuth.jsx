// RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
  // Aquí verificamos si el usuario está 'logueado' según el estado en el almacenamiento local.
  return localStorage.getItem('isLoggedIn') === 'true';
};

export default function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Redirigir al usuario al login si no está autenticado
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
