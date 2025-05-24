
import { Link } from "react-router-dom";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { LogOut, Home, Users, Trophy, Target, User, Settings, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type MobileNavProps = {
  setOpen: (open: boolean) => void;
};

export function MobileNav({ setOpen }: MobileNavProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-4">
        <h2 className="text-lg font-bold mb-4 text-emerald">Poker Galaxy</h2>
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
            onClick={handleLinkClick}
          >
            <Home className="mr-3 h-5 w-5" />
            {t("common.welcome", "Home")}
          </Link>
          <Link
            to="/lobby"
            className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
            onClick={handleLinkClick}
          >
            <Users className="mr-3 h-5 w-5" />
            {t("lobby.title", "Lobby")}
          </Link>
          <Link
            to="/tournaments"
            className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
            onClick={handleLinkClick}
          >
            <Trophy className="mr-3 h-5 w-5" />
            {t("tournaments.lobby", "Tournaments")}
          </Link>
          <Link
            to="/leaderboards"
            className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
            onClick={handleLinkClick}
          >
            <Target className="mr-3 h-5 w-5" />
            {t("leaderboards.title", "Leaderboards")}
          </Link>
          {user && (
            <Link
              to="/achievements"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
              onClick={handleLinkClick}
            >
              <Trophy className="mr-3 h-5 w-5" />
              {t("achievements.title", "Achievements")}
            </Link>
          )}
        </nav>
      </div>

      {user && (
        <>
          <Separator className="bg-emerald/20" />
          <div className="px-2 py-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider">{t("common.account", "Account")}</h3>
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
                onClick={handleLinkClick}
              >
                <User className="mr-3 h-5 w-5" />
                {t("common.profile", "Profile")}
              </Link>
              <Link
                to="/funds"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
                onClick={handleLinkClick}
              >
                <DollarSign className="mr-3 h-5 w-5" />
                {t("common.chips", "Funds")}
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-emerald/10 hover:text-emerald transition-colors w-full"
                onClick={handleLinkClick}
              >
                <Settings className="mr-3 h-5 w-5" />
                {t("common.settings", "Settings")}
              </Link>
            </nav>
          </div>
        </>
      )}

      <div className="mt-auto px-2 py-4">
        {user ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t("auth.signOut", "Sign Out")}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => {
                setOpen(false);
                window.location.href = '/login';
              }}
            >
              {t("auth.signIn", "Sign In")}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setOpen(false);
                window.location.href = '/signup';
              }}
            >
              {t("auth.signUp", "Sign Up")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
