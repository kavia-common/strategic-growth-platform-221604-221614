import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import '../styles/admin.css';

// PUBLIC_INTERFACE
/**
 * Admin-specific side panel component with limited navigation
 * Shows only Dashboard and AI items with Ocean Professional theme
 * 
 * @returns {JSX.Element} The admin side panel component
 */
const AdminSidePanel = () => {
  const location = useLocation();

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/admin', 
      icon: LayoutDashboard,
      exact: true
    },
    { 
      label: 'AI', 
      path: '/admin/ai', 
      icon: Sparkles,
      exact: false
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Section */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-icon">
          SGE
        </div>
        <span className="admin-sidebar-brand-text">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav" role="navigation" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <div className="admin-nav-item-icon">
                <Icon />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidePanel;
