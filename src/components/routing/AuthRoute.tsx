
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';

interface AuthRouteProps {
  children: JSX.Element;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
