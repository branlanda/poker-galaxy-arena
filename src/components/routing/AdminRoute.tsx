
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';

interface AdminRouteProps {
  children: JSX.Element;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
