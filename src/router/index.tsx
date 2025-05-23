
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GameRoom } from "@/pages/Game/GameRoom";
import Tournaments from "@/pages/Tournaments";
import { TournamentLobby } from "@/pages/Tournaments/TournamentLobby";
import LobbyPage from "@/pages/Lobby/LobbyPage";
import { NotFound } from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ProfilePage from "@/pages/profile/ProfilePage";
import Settings from "@/pages/settings/Settings";

// Create routes configuration
const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <div>Home Page</div> },
      { path: "/tables", element: <LobbyPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/settings", element: <Settings /> },
      { path: "/tournaments", element: <Tournaments /> },
      { path: "/tournaments/lobby", element: <TournamentLobby /> },
      { path: "/tournaments/:id", element: <div>Tournament Details</div> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/game/:tableId",
    element: <GameRoom />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <SignUp /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },
      { path: "/auth/reset-password", element: <ResetPassword /> },
    ],
  },
]);

export default routes;
