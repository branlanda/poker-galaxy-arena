
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
import AdminLayout from '@/pages/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import Users from '@/pages/Admin/Users';
import Tables from '@/pages/Admin/Tables';
import Ledger from '@/pages/Admin/Ledger';

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
  // Admin routes defined directly rather than spreading AdminRoutes component
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'tables',
        element: <Tables />
      },
      {
        path: 'ledger',
        element: <Ledger />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
