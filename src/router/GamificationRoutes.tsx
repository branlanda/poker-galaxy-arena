
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AchievementsPage from '@/pages/Gamification/AchievementsPage';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';

const GamificationRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default GamificationRoutes;
