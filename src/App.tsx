
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
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import Tables from './pages/Admin/Tables';
import Ledger from './pages/Admin/Ledger';
import { AdminGuard } from './hooks/useAdminGuard';
import { Web3Provider } from './providers/Web3Provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

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
  const setUser = useAuth((s) => s.setUser);

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
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Public routes */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lobby" element={<LobbyPage />} />
            
            {/* Protected routes */}
            <Route path="/game/:tableId" element={
              <ProtectedRoute>
                <GameRoom />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/funds" element={
              <ProtectedRoute>
                <FundsPage />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="tables" element={<Tables />} />
              <Route path="ledger" element={<Ledger />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
