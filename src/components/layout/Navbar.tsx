import { useState } from "react"
import { Link } from "react-router-dom"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useAuth } from "@/stores/auth"
import { useTranslation } from "@/hooks/useTranslation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Moon, Sun, Menu, User } from "lucide-react"
import { useTheme } from "@/components/providers"

export function Navbar() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { user, session, signOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <div className="border-b">
      <div className="container flex items-center gap-6 h-16">
        <Link className="flex items-center font-semibold" to="/">
          <span className="text-2xl">{siteConfig.name}</span>
        </Link>
        <NavigationMenu className="hidden lg:flex gap-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("lobby.title", "Lobby")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li>
                    <NavigationMenuLink>
                      {t("lobby.joinTable", "Join an existing table")}
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("tournaments.lobby", "Tournaments")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li>
                    <NavigationMenuLink>
                      {t("tournaments.description", "Compete for prizes")}</NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                {t("funds.title", "Funds")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li>
                    <NavigationMenuLink>
                      {t("funds.deposit", "Deposit funds")}</NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/profile" className={navigationMenuTriggerStyle()}>
                <User className="h-4 w-4 mr-1" />
                {t('common.profile', 'Profile')}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
          {!session ? (
            <>
              <Link to="/login">
                <Button size="sm" variant="outline">
                  {t("auth.signIn", "Sign In")}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t("auth.signUp", "Sign Up")}</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl} alt={user?.alias || user?.email} />
                    <AvatarFallback>{(user?.alias || user?.email)?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-secondary border">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/funds">Funds</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {showMobileMenu && (
        <MobileMenu
          t={t}
          theme={theme}
          setTheme={setTheme}
          user={user}
          session={session}
          signOut={signOut}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
    </div>
  )
}

interface MobileMenuProps {
  t: any
  theme: string
  setTheme: (theme: string) => void
  user: any
  session: any
  signOut: () => void
  toggleMobileMenu: () => void
}

function MobileMenu({
  t,
  theme,
  setTheme,
  user,
  session,
  signOut,
  toggleMobileMenu,
}: MobileMenuProps) {
  return (
    <div className="border-b lg:hidden">
      <div className="container flex flex-col gap-4 p-4">
        <Button
          size="sm"
          variant="ghost"
          className="justify-start"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon /> : <Sun />}
          <span className="ml-2">{t("theme", "Theme")}</span>
        </Button>
        <Link to="/lobby">
          <Button size="sm" variant="ghost" className="justify-start">
            {t("lobby.title", "Lobby")}
          </Button>
        </Link>
        <Link to="/tournaments">
          <Button size="sm" variant="ghost" className="justify-start">
            {t("tournaments.lobby", "Tournaments")}
          </Button>
        </Link>
        <Link to="/funds">
          <Button size="sm" variant="ghost" className="justify-start">
            {t("funds.title", "Funds")}
          </Button>
        </Link>
        <Link to="/profile">
          <Button size="sm" variant="ghost" className="justify-start">
            {t("common.profile", "Profile")}
          </Button>
        </Link>
        {!session ? (
          <>
            <Link to="/login">
              <Button size="sm" variant="outline" className="justify-start">
                {t("auth.signIn", "Sign In")}
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="justify-start">
                {t("auth.signUp", "Sign Up")}
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="justify-start"
              onClick={() => signOut()}
            >
              {t("auth.signOut", "Sign Out")}
            </Button>
          </>
        )}
        <Button size="sm" variant="ghost" onClick={toggleMobileMenu}>
          {t("common.close", "Close")}
        </Button>
      </div>
    </div>
  )
}
