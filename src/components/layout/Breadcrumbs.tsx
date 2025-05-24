
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const routeNames: Record<string, string> = {
  '/': 'home',
  '/lobby': 'lobby',
  '/tournaments': 'tournaments',
  '/profile': 'profile',
  '/settings': 'settings',
  '/funds': 'funds',
  '/achievements': 'achievements',
  '/leaderboards': 'leaderboards',
  '/admin': 'admin',
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
    { name: t('home', 'Home'), path: '/', icon: Home }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const routeName = routeNames[currentPath] || segment;
    breadcrumbs.push({
      name: t(routeName, segment.charAt(0).toUpperCase() + segment.slice(1)),
      path: currentPath,
      icon: undefined
    });
  });
  
  return (
    <nav className="bg-navy/50 border-b border-emerald/20 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-emerald font-medium flex items-center">
                  {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
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
