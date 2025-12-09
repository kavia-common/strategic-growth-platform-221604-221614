import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, Menu, User } from 'lucide-react';
import classNames from 'classnames';

// PUBLIC_INTERFACE
const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">SGE</span> Platform
          </h1>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={classNames('sidebar-link', {
                'active': location.pathname.startsWith(item.path)
              })}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 truncate">Organization Member</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
             {/* Placeholder for topbar actions */}
             <div className="text-sm text-gray-500">
                Ocean Professional Theme
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[var(--bg-primary)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
