import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ title, subtitle, actions, searchPlaceholder }) {
  const { user } = useAuth();
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-6">
      {/* Search */}
      <div className="flex-1 relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
          placeholder={searchPlaceholder || 'Search resources or reports...'}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900">
          <HelpCircle size={16} />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{user?.fullName}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">{user?.role}</div>
          </div>
          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
