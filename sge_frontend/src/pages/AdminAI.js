import React from 'react';
import { Sparkles, MessageSquare, Zap } from 'lucide-react';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/admin.css';

// PUBLIC_INTERFACE
/**
 * Admin AI page component
 * Displays AI-related features and tools for administrators
 * 
 * @returns {JSX.Element} The admin AI page
 */
const AdminAI = () => {
  return (
    <div className="admin-page">
      <AdminSidePanel />
      
      <main className="admin-main">
        <div className="admin-content">
          {/* Header Section */}
          <div className="admin-header">
            <h1 className="admin-header-title">AI Tools</h1>
            <div className="admin-header-actions">
              <button className="admin-btn admin-btn-primary">
                <Sparkles size={16} />
                <span>New AI Task</span>
              </button>
            </div>
          </div>

          {/* AI Features Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-card-header">
                <div className="admin-stat-icon blue">
                  <MessageSquare size={20} />
                </div>
              </div>
              <div className="admin-stat-value">1,234</div>
              <div className="admin-stat-change positive">
                <span>+15.3%</span>
              </div>
              <div className="admin-stat-label">AI Conversations</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-header">
                <div className="admin-stat-icon amber">
                  <Zap size={20} />
                </div>
              </div>
              <div className="admin-stat-value">8,542</div>
              <div className="admin-stat-change positive">
                <span>+22.1%</span>
              </div>
              <div className="admin-stat-label">AI Requests</div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-card-header">
                <div className="admin-stat-icon green">
                  <Sparkles size={20} />
                </div>
              </div>
              <div className="admin-stat-value">94.8%</div>
              <div className="admin-stat-change positive">
                <span>+3.2%</span>
              </div>
              <div className="admin-stat-label">Success Rate</div>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">AI Features</h2>
            </div>
            <div style={{ padding: '20px 0' }}>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                This section will display AI-powered tools and features for administrators.
                Configure AI models, review AI interactions, and manage AI-related settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAI;
