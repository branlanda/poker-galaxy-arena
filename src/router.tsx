
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import { NotFound } from '@/pages/NotFound';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import GameRoom from '@/pages/Game/GameRoom';
import LobbyPage from '@/pages/Lobby/LobbyPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import FundsPage from '@/pages/Funds/FundsPage';
import Settings from '@/pages/settings/Settings';
import { TournamentsRoutes } from './router/TournamentsRoutes';
import { AdminRoutes } from './router/AdminRoutes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/game/:id',
    element: <GameRoom />,
  },
  {
    path: '/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/funds',
    element: <FundsPage />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  ...TournamentsRoutes,
  ...AdminRoutes,
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
