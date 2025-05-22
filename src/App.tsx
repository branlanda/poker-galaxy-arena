
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import LoginPage from './pages/auth/Login';
import SignUpPage from './pages/auth/SignUp';
import DashboardPage from './pages/Index';
import FundsPage from './pages/Funds/FundsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthSync } from './hooks/useAuthSync';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import Tables from './pages/Admin/Tables';
import Ledger from './pages/Admin/Ledger';
import { AdminGuard } from './hooks/useAdminGuard';

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
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Public route */}
        <Route path="/" element={<DashboardPage />} />
        
        {/* Protected routes */}
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
  );
}

export default App;
