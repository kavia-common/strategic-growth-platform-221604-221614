import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, User, X, Menu } from 'lucide-react';
import '../styles/Sidebar.css';
import '../styles/Layout.css';
import '../styles/responsive.css';

/**
 * PUBLIC_INTERFACE
 * AppLayout
 * A shared application layout with:
 * - Left sidebar navigation (static on >= md, off-canvas drawer on small screens)
 * - Top navbar with hamburger toggle on small screens
 * - Overlay and accessibility controls (aria-expanded, aria-controls, Escape to close)
 * - Focus trap inside drawer for keyboard accessibility
 *
 * Props:
 * - children: ReactNode - the page content to render inside the main area
 */
const AppLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile state

  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const menuButtonRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Chat', path: '/chat', icon: MessageSquare },
  ];

  const activeLabel = navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    // return focus to menu button for good a11y
    if (menuButtonRef.current) {
      menuButtonRef.current.focus();
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const onHamburgerClick = () => setIsSidebarOpen(true);

  // Close on route change (for mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  // ESC key to close and focus trap implementation for the drawer
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!isSidebarOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSidebar();
      } else if (e.key === 'Tab' && drawerRef.current) {
        // Simple focus trap
        const focusable = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  // When sidebar opens, focus first element inside
  useEffect(() => {
    if (isSidebarOpen && drawerRef.current) {
      const focusable = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, [isSidebarOpen]);

  return (
    <div className="layout-container">
      {/* Overlay for mobile drawer */}
      <div
        className={`layout-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        role="presentation"
        aria-hidden={!isSidebarOpen}
      />

      {/* Sidebar (static on md+, off-canvas on mobile) */}
      <aside
        id="app-sidebar"
        ref={drawerRef}
        className={`sidebar-foundatia responsive-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Mobile Close Button (visible on small screens) */}
        <div className="sidebar-mobile-controls">
          <button
            ref={firstFocusableRef}
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Brand Section with Logo and Tagline */}
        <div className="sidebar-brand">
          <Link
            to="/dashboard"
            className="sidebar-brand-link"
            aria-label="Foundatia SGE Home"
            onClick={closeSidebar}
          >
            <div className="sidebar-logo">
              {!imgError ? (
                <img
                  src={process.env.PUBLIC_URL + '/logo.png'}
                  alt="Foundatia Logo"
                  className="sidebar-logo-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="sidebar-logo-text">F</span>
              )}
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
        <nav className="sidebar-nav" role="navigation" aria-label="Primary">
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
                  onClick={closeSidebar}
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
            ref={lastFocusableRef}
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="layout-main">
        {/* Topbar with hamburger on small screens */}
        <header className="layout-topbar">
          <div className="layout-topbar-left">
            <button
              ref={menuButtonRef}
              type="button"
              className="layout-hamburger"
              aria-label="Open sidebar"
              aria-controls="app-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={onHamburgerClick}
            >
              <Menu size={20} />
            </button>
            <h2 className="layout-topbar-title">{activeLabel}</h2>
          </div>
          <div className="layout-topbar-actions">
            <div className="layout-theme-badge">Foundatia</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
