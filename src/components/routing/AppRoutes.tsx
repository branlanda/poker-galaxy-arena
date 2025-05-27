
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import NotFound from '@/pages/NotFound';
import { TournamentLobby, TournamentDetail } from '@/pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from '@/pages/Gamification';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import { SitAndGoRoutes } from '@/router/SitAndGoRoutes';
import { TournamentsRoutes } from '@/router/TournamentsRoutes';
import { AuthRoute } from '@/components/routing/AuthRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/tournaments/*" element={<TournamentsRoutes />} />
      <Route path="/sit-and-go/*" element={<SitAndGoRoutes />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      
      {/* Auth routes - only accessible when not logged in */}
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      <Route path="/register" element={
        <AuthRoute>
          <SignUp />
        </AuthRoute>
      } />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
