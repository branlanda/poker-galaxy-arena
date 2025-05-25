
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthSync } from '@/hooks/useAuthSync';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import AccountRecoveryPage from '@/pages/auth/AccountRecoveryPage';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import FundsPage from '@/pages/Funds/FundsPage';
import GameRoom from '@/pages/Game/GameRoom';
import ProfilePage from '@/pages/profile/ProfilePage';
import Settings from '@/pages/settings/Settings';
import SecuritySettingsPage from '@/pages/settings/SecuritySettings';
import NotFound from '@/pages/NotFound';

// Gamification Pages
import AchievementsPage from '@/pages/Gamification/AchievementsPage';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';

// Admin Routes
import AdminRoutes from '@/router/AdminRoutes';
import { TournamentsRoutes } from '@/router/TournamentsRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  useAuthSync();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/recovery" element={<AccountRecoveryPage />} />

        {/* Protected routes */}
        <Route path="/lobby" element={
          <ProtectedRoute>
            <AppLayout>
              <LobbyPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/funds" element={
          <ProtectedRoute>
            <AppLayout>
              <FundsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/game/:gameId" element={
          <ProtectedRoute>
            <GameRoom />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings/security" element={
          <ProtectedRoute>
            <AppLayout>
              <SecuritySettingsPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Gamification Routes */}
        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        } />

        <Route path="/leaderboards" element={
          <ProtectedRoute>
            <LeaderboardsPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Tournament Routes */}
        <Route path="/tournaments/*" element={<TournamentsRoutes />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
