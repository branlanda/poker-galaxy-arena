
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import GameRoom from "@/pages/Game/GameRoom";
import { TournamentLobby } from "@/pages/Tournaments";
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
    element: <AppLayout>
      <div>Home Page</div>
    </AppLayout>,
  },
  {
    path: "/tables",
    element: <AppLayout>
      <LobbyPage />
    </AppLayout>,
  },
  {
    path: "/profile",
    element: <AppLayout>
      <ProfilePage />
    </AppLayout>,
  },
  {
    path: "/settings",
    element: <AppLayout>
      <Settings />
    </AppLayout>,
  },
  {
    path: "/tournaments",
    element: <AppLayout>
      <TournamentLobby />
    </AppLayout>,
  },
  {
    path: "/tournaments/:id", 
    element: <AppLayout>
      <div>Tournament Details</div>
    </AppLayout>,
  },
  {
    path: "/game/:tableId",
    element: <GameRoom />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <SignUp />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
