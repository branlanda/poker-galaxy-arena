import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TournamentLobby, TournamentDetail } from '@/pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from '@/pages/Gamification';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import { SitAndGoRoutes } from '@/router/SitAndGoRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/tournaments/*" element={<TournamentRoutes />} />
      
      <Route path="/sit-and-go/*" element={<SitAndGoRoutes />} />
      
    </Routes>
  );
};

export default AppRoutes;
