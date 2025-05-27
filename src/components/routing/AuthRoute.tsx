
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';

interface AuthRouteProps {
  children: JSX.Element;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { user } = useAuth();

  // Si el usuario está autenticado, redirigir a la página principal
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar la página de autenticación
  return children;
}
