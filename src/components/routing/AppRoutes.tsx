
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AuthRoute } from './AuthRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import Lobby from '@/pages/Lobby/LobbyPage';
import Funds from '@/pages/Funds/FundsPage';
import SettingsPage from '@/pages/settings/Settings';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';
import TournamentsPage from '@/pages/Tournaments';
import Table from '@/pages/Game/GameRoom';
import Admin from '@/pages/Admin/Dashboard';
import ProfilePage from '@/pages/profile/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Index /></AppLayout>} />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        }
      />
      <Route
        path="/lobby"
        element={
          <ProtectedRoute>
            <AppLayout><Lobby /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/funds"
        element={
          <ProtectedRoute>
            <AppLayout><Funds /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout><SettingsPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <AppLayout><LeaderboardsPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournaments"
        element={
          <ProtectedRoute>
            <AppLayout><TournamentsPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/table/:id"
        element={
          <ProtectedRoute>
            <AppLayout><Table /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/:id"
        element={
          <ProtectedRoute>
            <AppLayout><Table /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppLayout><Admin /></AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
