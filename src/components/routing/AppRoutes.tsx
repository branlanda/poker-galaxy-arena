
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TournamentLobby, TournamentDetail } from '@/pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from '@/pages/Gamification';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import { SitAndGoRoutes } from '@/router/SitAndGoRoutes';
import { TournamentsRoutes } from '@/router/TournamentsRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/tournaments/*" element={<TournamentsRoutes />} />
      <Route path="/sit-and-go/*" element={<SitAndGoRoutes />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
    </Routes>
  );
};

export default AppRoutes;
