
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import LoginPage from './pages/auth/Login';
import DashboardPage from './pages/Index';
import FundsPage from './pages/Funds/FundsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth((s) => s.user);

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const [loading, setLoading] = useState(true);
  const setUser = useAuth((s) => s.setUser);

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
      </Routes>
    </Router>
  );
}

export default App;
