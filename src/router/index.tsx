import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Index from "@/pages";
import Room from "@/pages/Room";
import ProfilePage from "@/pages/Profile";
import EditProfile from "@/pages/Profile/EditProfile";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GameRoom } from "@/pages/Game/GameRoom";
import Tournaments from "@/pages/Tournaments";
import { TournamentLobby } from "@/pages/Tournaments/TournamentLobby";
import { TournamentDetails } from "@/pages/Tournaments/TournamentDetails";
import LobbyPage from "@/pages/Lobby/LobbyPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/tables", element: <LobbyPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/edit", element: <EditProfile /> },
      { path: "/room/:id", element: <Room /> },
      { path: "/game/:tableId", element: <GameRoom /> },
      { path: "/tournaments", element: <Tournaments() /> },
      { path: "/tournaments/lobby", element: <TournamentLobby /> },
      { path: "/tournaments/:id", element: <TournamentDetails /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },
      { path: "/auth/reset-password", element: <ResetPassword /> },
    ],
  },
]);

export default routes;
