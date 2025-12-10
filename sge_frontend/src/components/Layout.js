import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, User } from 'lucide-react';
import '../styles/Sidebar.css';
import '../styles/Layout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component with Foundatia-themed sidebar navigation
 * Provides navigation between Dashboard and AI Chat with charcoal sidebar and gold accents
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
    <div className="layout-container">
      {/* Foundatia Sidebar */}
      <aside className="sidebar-foundatia">
        {/* Brand Section with Logo and Tagline */}
        <div className="sidebar-brand">
          <Link 
            to="/dashboard" 
            className="sidebar-brand-link"
            aria-label="Foundatia SGE Home"
          >
            <div className="sidebar-logo">
              <span className="sidebar-logo-text">F</span>
            </div>
            <p className="sidebar-tagline">
              Reveal
              <span className="sidebar-tagline-separator">•</span>
              Reframe
              <span className="sidebar-tagline-separator">•</span>
              Realign
            </p>
          </Link>
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
                  tabIndex={0}
                >
                  <div className="sidebar-nav-item-indicator" aria-hidden="true" />
                  <div className="sidebar-nav-item-icon">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="sidebar-nav-item-label">{item.label}</span>
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
              <User size={18} strokeWidth={2.5} />
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
      <div className="layout-main">
        {/* Topbar */}
        <header className="layout-topbar">
          <div>
            <h2 className="layout-topbar-title">
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="layout-topbar-actions">
            <div className="layout-theme-badge">
              Foundatia
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
