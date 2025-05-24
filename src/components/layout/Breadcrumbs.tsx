
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, Users, Trophy, Target, User, Settings, DollarSign, Gamepad2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const routeNames: Record<string, string> = {
  '/': 'common.welcome',
  '/lobby': 'lobby.title',
  '/tournaments': 'tournaments.lobby',
  '/profile': 'common.profile',
  '/settings': 'common.settings',
  '/funds': 'common.chips',
  '/achievements': 'achievements.title',
  '/leaderboards': 'leaderboards.title',
  '/admin': 'admin',
};

const routeIcons: Record<string, any> = {
  '/': Home,
  '/lobby': Users,
  '/tournaments': Trophy,
  '/profile': User,
  '/settings': Settings,
  '/funds': DollarSign,
  '/achievements': Trophy,
  '/leaderboards': Target,
  '/admin': Gamepad2,
};

export function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }
  
  const breadcrumbs = [
    { name: t('common.welcome', 'Home'), path: '/', icon: Home }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const routeName = routeNames[currentPath] || segment;
    const IconComponent = routeIcons[currentPath];
    
    breadcrumbs.push({
      name: t(routeName, segment.charAt(0).toUpperCase() + segment.slice(1)),
      path: currentPath,
      icon: IconComponent
    });
  });
  
  return (
    <nav className="bg-navy/30 border-b border-emerald/10 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-500 mx-2" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-emerald font-medium flex items-center">
                  {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-2" />}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-400 hover:text-emerald transition-colors flex items-center"
                >
                  {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-2" />}
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
