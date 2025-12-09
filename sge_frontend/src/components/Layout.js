import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, Menu, X, User } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Layout Component
 * Provides the main application layout with:
 * - Fixed sidebar navigation with Dashboard and AI Chat entries
 * - Ocean Professional theme styling
 * - Mobile collapse/expand behavior
 * - Sticky header
 * - Scrollable main content area
 */
const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Mobile close button */}
        <button 
          className="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo-icon">
              <span className="sidebar-logo-symbol">SGE</span>
            </div>
            <h1 className="sidebar-logo-text">Platform</h1>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} className="sidebar-nav-icon" />
                <span className="sidebar-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-email">{user?.email || 'User'}</p>
              <p className="user-role">Organization Member</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="sidebar-signout-btn"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="app-main">
        {/* Sticky Header */}
        <header className="app-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="header-title">
              {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="header-right">
            <div className="header-theme-badge">
              Ocean Professional
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
