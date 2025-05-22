
import { useState } from 'react';
import NavItem from './NavItem';
import { PieChart, Users, Table2, Wallet, ChevronLeft, ChevronRight, BarChart4, Shield, Settings } from 'lucide-react';
import Logo from '@/assets/Logo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslation } from '@/hooks/useTranslation';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  
  const links = [
    { to: '/admin', label: t('admin.sidebar.dashboard'), icon: <PieChart size={18} /> },
    { to: '/admin/users', label: t('admin.sidebar.users'), icon: <Users size={18} /> },
    { to: '/admin/tables', label: t('admin.sidebar.tables'), icon: <Table2 size={18} /> },
    { to: '/admin/ledger', label: t('admin.sidebar.ledger'), icon: <Wallet size={18} /> },
  ];

  // These links would be implemented in a real application
  const secondaryLinks = [
    { to: '/admin/reports', label: t('admin.sidebar.reports'), icon: <BarChart4 size={18} /> },
    { to: '/admin/security', label: t('admin.sidebar.security'), icon: <Shield size={18} /> },
    { to: '/admin/settings', label: t('admin.sidebar.settings'), icon: <Settings size={18} /> },
  ];

  return (
    <aside 
      className={`bg-[#081624] border-r border-emerald/10 flex flex-col h-full transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center p-4 border-b border-emerald/10">
        {!collapsed && (
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
            <div className="ml-2">
              <div className="text-emerald text-lg font-bold">PokerP2P</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <Logo size="sm" />
          </Link>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6 space-y-1 px-2">
          {links.map(link => (
            <NavItem 
              key={link.to} 
              to={link.to} 
              icon={link.icon} 
              label={link.label} 
              collapsed={collapsed}
            />
          ))}

          <div className="pt-4 mt-4 border-t border-emerald/10">
            <p className={`px-3 text-xs uppercase text-gray-500 mb-2 ${collapsed ? 'sr-only' : ''}`}>
              {t('admin.sidebar.more')}
            </p>
            
            {secondaryLinks.map(link => (
              <NavItem 
                key={link.to} 
                to={link.to} 
                icon={link.icon} 
                label={link.label} 
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-emerald/10 flex justify-between items-center">
        <Link 
          to="/" 
          className={`text-sm text-gray-400 hover:text-emerald ${collapsed ? 'sr-only' : 'flex items-center'}`}
        >
          <span className="mr-2">←</span>
          <span>{t('admin.sidebar.backToSite')}</span>
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
