import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { useAuthSync } from '@/hooks/useAuthSync';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/AppLayout';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import Lobby from '@/pages/Lobby';
import Funds from '@/pages/Funds';
import SettingsPage from '@/pages/SettingsPage';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';
import TournamentsPage from '@/pages/TournamentsPage';
import Table from '@/pages/Table';
import Admin from '@/pages/Admin';
import ProfilePage from '@/pages/profile/ProfilePage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin, session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AuthRoute({ children }: { children: JSX.Element }) {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  useAuthSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <Router>
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-2 z-50">
          You are currently offline. Some features may not be available.
        </div>
      )}
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
      <Toaster />
    </Router>
  );
}

export default App;
