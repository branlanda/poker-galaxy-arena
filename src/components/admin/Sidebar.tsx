
import NavItem from './NavItem';
import { PieChart, Users, Table2, Wallet } from 'lucide-react';
import Logo from '@/assets/Logo';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: <PieChart size={18} /> },
    { to: '/admin/users', label: 'Usuarios', icon: <Users size={18} /> },
    { to: '/admin/tables', label: 'Mesas', icon: <Table2 size={18} /> },
    { to: '/admin/ledger', label: 'Ledger', icon: <Wallet size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#081624] border-r border-emerald/10 flex flex-col h-full">
      <Link to="/" className="flex items-center p-4 border-b border-emerald/10">
        <Logo size="sm" />
        <div className="ml-2">
          <div className="text-emerald text-lg font-bold">PokerP2P</div>
          <div className="text-xs text-gray-400">Admin Panel</div>
        </div>
      </Link>
      
      <nav className="mt-6 space-y-1 px-2 flex-1">
        {links.map(link => (
          <NavItem 
            key={link.to} 
            to={link.to} 
            icon={link.icon} 
            label={link.label} 
          />
        ))}
      </nav>
      
      <div className="p-4 border-t border-emerald/10">
        <Link 
          to="/" 
          className="flex items-center text-sm text-gray-400 hover:text-emerald"
        >
          <span className="mr-2">←</span>
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
