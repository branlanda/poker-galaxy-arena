import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import LoginPage from './pages/auth/Login';
import DashboardPage from './pages/Index';
import FundsPage from './pages/Funds/FundsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthSync } from './hooks/useAuthSync';
import NotFound from './pages/NotFound';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/funds" element={
          <ProtectedRoute>
            <FundsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
