import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, User } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Main layout component with themed sidebar navigation
 * Provides navigation between Dashboard and AI Chat with Ocean Professional theme
 */
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
      <aside className="sidebar-modern">
        {/* Brand Section */}
        <div className="sidebar-brand">
          <Link 
            to="/dashboard" 
            className="sidebar-brand-link"
            aria-label="SGE Platform Home"
          >
            <span className="sidebar-brand-icon">SGE</span>
            <span className="sidebar-brand-text">Platform</span>
          </Link>
          <div className="sidebar-version-badge">v1.0</div>
        </div>
        
        {/* Navigation */}
        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          <div className="sidebar-nav-group">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="sidebar-nav-item-icon">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <span className="sidebar-nav-item-label">{item.label}</span>
                  {isActive && <div className="sidebar-nav-item-indicator" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="sidebar-footer">
          <div className="sidebar-separator" />
          
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <User size={16} strokeWidth={2.5} />
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-email">{user?.email}</p>
              <p className="sidebar-user-role">Member</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="sidebar-signout-btn"
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="layout-topbar">
          <div className="flex items-center gap-4">
            <h2 className="layout-topbar-title">
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="layout-topbar-theme-tag">
              Ocean Professional
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
