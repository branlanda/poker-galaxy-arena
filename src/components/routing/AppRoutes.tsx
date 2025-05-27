
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/SignUp';
import HomePage from '@/pages/Index';
import ProfilePage from '@/pages/profile/ProfilePage';
import GameRoom from '@/pages/Game/GameRoom';
import AdminPage from '@/pages/Admin/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthRoute } from './AuthRoute';
import { AdminRoute } from './AdminRoute';
import HandHistoryPage from '@/pages/HandHistoryPage';
import { SharedHandPage } from '@/pages/SharedHandPage';
import { TermsOfServicePage } from '@/pages/TermsOfServicePage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import HowToPlayPage from '@/pages/HowToPlay/HowToPlayPage';
import TournamentsRoutes from '@/router/TournamentsRoutes';
import AchievementsPage from '@/pages/Gamification/AchievementsPage';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';
import StatisticsPage from '@/pages/profile/StatisticsPage';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import FundsPage from '@/pages/Funds/FundsPage';
import SettingsPage from '@/pages/settings/Settings';
import { AppLayout } from '@/components/layout/AppLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        }
      />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/how-to-play" element={<HowToPlayPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lobby"
        element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
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
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/:tableId"
        element={
          <ProtectedRoute>
            <GameRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournaments/*"
        element={
          <ProtectedRoute>
            <TournamentsRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AchievementsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LeaderboardsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/funds"
        element={
          <ProtectedRoute>
            <FundsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route
        path="/hand-history"
        element={
          <ProtectedRoute>
            <HandHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/shared-hand/:shareCode" element={<SharedHandPage />} />
    </Routes>
  );
}
