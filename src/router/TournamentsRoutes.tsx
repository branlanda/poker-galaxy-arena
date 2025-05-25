
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TournamentLobby, TournamentDetail } from '@/pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from '@/pages/Gamification';

export const TournamentsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TournamentLobby />} />
      <Route path="/:id" element={<TournamentDetail />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/leaderboards" element={<LeaderboardsPage />} />
    </Routes>
  );
};

export default TournamentsRoutes;
