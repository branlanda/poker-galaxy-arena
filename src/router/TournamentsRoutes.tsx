
import { RouteObject } from 'react-router-dom';
import { TournamentLobby, TournamentDetail } from '@/pages/Tournaments';
import { AchievementsPage, LeaderboardsPage } from '@/pages/Gamification';

export const TournamentsRoutes: RouteObject[] = [
  {
    path: '/tournaments',
    element: <TournamentLobby />
  },
  {
    path: '/tournaments/:id',
    element: <TournamentDetail />
  },
  {
    path: '/achievements',
    element: <AchievementsPage />
  },
  {
    path: '/leaderboards',
    element: <LeaderboardsPage />
  }
];
