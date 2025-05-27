
import { Routes, Route } from 'react-router-dom';
import AchievementsPage from '@/pages/Gamification/AchievementsPage';
import LeaderboardsPage from '@/pages/Gamification/LeaderboardsPage';
import { AppLayout } from '@/components/layout/AppLayout';

const GamificationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <AppLayout>
          <AchievementsPage />
        </AppLayout>
      } />
      <Route path="/leaderboards" element={
        <AppLayout>
          <LeaderboardsPage />
        </AppLayout>
      } />
    </Routes>
  );
};

export default GamificationRoutes;
