
import React, { useState } from 'react';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { useAuth } from '@/stores/auth';
import { useTranslation } from '@/hooks/useTranslation';
import { Bell, UserCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [notificationCount] = useState(3); // Mock notification count
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-navy border-b border-emerald/10 h-16 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{t('admin.dashboard.title')}</h1>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 flex items-center justify-center p-0" 
                  variant="destructive"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>{t('admin.notifications.title')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">{t('admin.notifications.newWithdrawal')}</div>
                <div className="text-xs text-muted-foreground">{t('admin.notifications.justNow')}</div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">{t('admin.notifications.newUser')}</div>
                <div className="text-xs text-muted-foreground">15 minutes ago</div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">{t('admin.notifications.serverAlert')}</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </DropdownMenuItem>
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium text-emerald">
              {t('admin.notifications.viewAll')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <LanguageSelector />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex gap-2 items-center" size="sm">
              <UserCircle className="h-5 w-5" />
              <span className="text-sm text-emerald hidden md:inline-block">
                {user?.alias || user?.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('admin.account.title')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="h-4 w-4 mr-2" />
              {t('admin.account.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              {t('admin.account.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {t('admin.account.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
