import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, DoorOpen, BookOpen, Sparkles, Calendar,
  AlertTriangle, BarChart3, Users, Settings, LogOut, Zap
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Administrator', 'Faculty', 'Student'] },
  { label: 'Rooms', icon: DoorOpen, path: '/rooms', roles: ['Administrator', 'Faculty'] },
  { label: 'Courses', icon: BookOpen, path: '/courses', roles: ['Administrator', 'Faculty'] },
  { label: 'Allocation', icon: Sparkles, path: '/allocation', roles: ['Administrator'] },
  { label: 'Timetable', icon: Calendar, path: '/timetable', roles: ['Administrator', 'Faculty', 'Student'] },
  { label: 'Conflicts', icon: AlertTriangle, path: '/conflicts', roles: ['Administrator'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['Administrator'] },
  { label: 'Users', icon: Users, path: '/users', roles: ['Administrator'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">SmartAlloc</div>
            <div className="text-gray-400 text-xs tracking-wide">INSTITUTIONAL</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ label, icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={location.pathname === path ? 'nav-link-active w-full' : 'nav-link w-full'}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Auto Allocate button */}
      {user?.role === 'Administrator' && (
        <div className="p-3">
          <button onClick={() => navigate('/allocation')} className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
            <Zap size={14} />
            Auto Allocate
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-0.5">
        <button onClick={() => navigate('/settings')} className="nav-link w-full">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button onClick={logout} className="nav-link w-full text-red-500 hover:text-red-700 hover:bg-red-50">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
