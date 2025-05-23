
import { Link } from "react-router-dom";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { LogOut } from "lucide-react";
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
        <h2 className="text-lg font-bold mb-2">Menu</h2>
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
            onClick={handleLinkClick}
          >
            {t("home")}
          </Link>
          <Link
            to="/tables"
            className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
            onClick={handleLinkClick}
          >
            {t("tables")}
          </Link>
          <Link
            to="/tournaments"
            className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
            onClick={handleLinkClick}
          >
            {t("tournaments")}
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
            onClick={handleLinkClick}
          >
            {t("leaderboard")}
          </Link>
        </nav>
      </div>

      {user && (
        <>
          <Separator />
          <div className="px-2 py-4">
            <h2 className="text-lg font-bold mb-2">{t("account")}</h2>
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
                onClick={handleLinkClick}
              >
                {t("profile")}
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-muted w-full"
                onClick={handleLinkClick}
              >
                {t("settings")}
              </Link>
            </nav>
          </div>
        </>
      )}

      <div className="mt-auto px-2 py-4">
        {user ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => {
                setOpen(false);
                window.location.href = '/auth/login';
              }}
            >
              {t("signIn")}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setOpen(false);
                window.location.href = '/auth/register';
              }}
            >
              {t("signUp")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
