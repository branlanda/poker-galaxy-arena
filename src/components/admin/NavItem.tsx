
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, active, collapsed }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 my-1 rounded-lg transition-colors ${
        active 
          ? 'bg-emerald/10 text-emerald hover:bg-emerald/20' 
          : 'text-gray-400 hover:bg-navy hover:text-white'
      }`}
    >
      <div className="flex items-center">
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
      </div>
    </Link>
  );
};

export default NavItem;
