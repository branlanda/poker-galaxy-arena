
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
}

const NavItem = ({ to, label, icon, collapsed = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-md transition
        ${isActive ? 'bg-emerald/10 text-emerald' : 'text-gray-400 hover:text-white hover:bg-navy'}
        ${collapsed ? 'justify-center' : ''}
      `}
      end={to === '/admin'}
    >
      <span className={`${collapsed ? 'mx-auto' : ''}`}>
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export default NavItem;
