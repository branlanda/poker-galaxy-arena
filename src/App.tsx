import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import LoginPage from './pages/auth/Login';
import SignUpPage from './pages/auth/SignUp';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import DashboardPage from './pages/Index';
import FundsPage from './pages/Funds/FundsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/Settings';
import LobbyPage from './pages/Lobby/LobbyPage';
import GameRoom from './pages/Game/GameRoom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthSync } from './hooks/useAuthSync';
import NotFound from './pages/NotFound';
import AdminRoutes from './router/AdminRoutes';
import { Web3Provider } from './providers/Web3Provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from './components/layout/AppLayout';
import { TournamentLobby, TournamentDetail } from './pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from './pages/Gamification';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();

  // Use the AuthSync hook to keep authentication state in sync
  useAuthSync();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-navy">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <Router>
          <Routes>
            {/* Auth routes - No layout wrapper */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Game room has its own specific layout */}
            <Route path="/game/:tableId" element={
              <ProtectedRoute>
                <GameRoom />
              </ProtectedRoute>
            } />
            
            {/* Admin routes with admin layout */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Redirect /users to /admin/users */}
            <Route path="/users" element={<Navigate to="/admin/users" replace />} />
            
            {/* All other routes with standard layout and consistent breadcrumbs */}
            <Route path="/" element={
              <AppLayout showBreadcrumbs={false}>
                <DashboardPage />
              </AppLayout>
            } />
            
            <Route path="/lobby" element={
              <AppLayout>
                <LobbyPage />
              </AppLayout>
            } />
            
            <Route path="/profile" element={
              <AppLayout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </AppLayout>
            } />
            
            <Route path="/settings" element={
              <AppLayout>
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              </AppLayout>
            } />
            
            <Route path="/funds" element={
              <AppLayout>
                <ProtectedRoute>
                  <FundsPage />
                </ProtectedRoute>
              </AppLayout>
            } />
            
            {/* Tournament routes */}
            <Route path="/tournaments" element={
              <AppLayout>
                <TournamentLobby />
              </AppLayout>
            } />
            
            <Route path="/tournaments/:id" element={
              <AppLayout>
                <TournamentDetail />
              </AppLayout>
            } />
            
            {/* Gamification routes */}
            <Route path="/achievements" element={
              <AppLayout>
                <ProtectedRoute>
                  <AchievementsPage />
                </ProtectedRoute>
              </AppLayout>
            } />
            
            <Route path="/leaderboards" element={
              <AppLayout>
                <LeaderboardsPage />
              </AppLayout>
            } />
            
            {/* 404 route */}
            <Route path="*" element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            } />
          </Routes>
        </Router>
        <Toaster />
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
