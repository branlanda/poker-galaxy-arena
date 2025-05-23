
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import NavItem from './NavItem';
import { useAuth } from '@/stores/auth';
import { 
  LayoutDashboard, 
  Users, 
  Table, 
  CreditCard, 
  Shield, 
  BarChart4, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: t('admin.sidebar.dashboard') },
    { to: '/admin/users', icon: <Users size={20} />, label: t('admin.sidebar.users') },
    { to: '/admin/tables', icon: <Table size={20} />, label: t('admin.sidebar.tables') },
    { to: '/admin/ledger', icon: <CreditCard size={20} />, label: t('admin.sidebar.ledger') },
    { to: '/admin/chat', icon: <MessageCircle size={20} />, label: t('admin.sidebar.chat') },
    { to: '/admin/security', icon: <Shield size={20} />, label: t('admin.sidebar.security') },
    { to: '/admin/audit', icon: <FileText size={20} />, label: t('admin.sidebar.audit') },
    { to: '/admin/export', icon: <BarChart4 size={20} />, label: t('admin.sidebar.export') }
  ];

  return (
    <div className={`h-screen transition-all duration-300 ease-in-out bg-navy-dark relative ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-center border-b border-navy">
        <h1 className={`text-white font-bold text-xl ${collapsed ? 'hidden' : 'block'}`}>
          {t('admin.title')}
        </h1>
        {collapsed && <LayoutDashboard className="text-white" size={24} />}
      </div>
      
      <button 
        className="absolute -right-3 top-20 bg-navy-dark p-1 rounded-full border border-navy"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? 
          <ChevronRight size={16} className="text-gray-400" /> : 
          <ChevronLeft size={16} className="text-gray-400" />
        }
      </button>
      
      <div className="py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to || 
                    (item.to !== '/admin' && location.pathname.startsWith(item.to))}
            collapsed={collapsed}
          />
        ))}
      </div>
      
      <div className="absolute bottom-4 w-full px-2">
        <button
          onClick={handleLogout}
          className={`w-full py-2 px-4 flex items-center rounded-lg text-gray-300 hover:bg-navy hover:text-white transition-colors`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">{t('admin.sidebar.logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
