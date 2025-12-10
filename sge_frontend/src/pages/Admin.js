import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Download, Filter, Plus } from 'lucide-react';
import AdminSidePanel from '../components/AdminSidePanel';
import '../styles/admin.css';

// PUBLIC_INTERFACE
/**
 * Admin Dashboard page component
 * Displays statistics cards and data tables with Ocean Professional theme
 * Uses isolated CSS to avoid affecting other pages
 * 
 * @returns {JSX.Element} The admin dashboard page
 */
const Admin = () => {
  // Sample data for statistics cards
  const [stats] = useState([
    {
      id: 1,
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 3,
      title: 'Growth Rate',
      value: '23.4%',
      change: '+4.1%',
      isPositive: true,
      icon: TrendingUp,
      color: 'amber'
    },
    {
      id: 4,
      title: 'Active Sessions',
      value: '1,429',
      change: '-2.4%',
      isPositive: false,
      icon: Activity,
      color: 'blue'
    }
  ]);

  // Sample data for the table
  const [tableData] = useState([
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      status: 'Active',
      plan: 'Enterprise',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'TechStart Inc',
      email: 'hello@techstart.io',
      status: 'Active',
      plan: 'Professional',
      lastActive: '5 hours ago'
    },
    {
      id: 3,
      name: 'Global Solutions',
      email: 'info@globalsol.com',
      status: 'Pending',
      plan: 'Starter',
      lastActive: '1 day ago'
    },
    {
      id: 4,
      name: 'InnovateCo',
      email: 'team@innovate.co',
      status: 'Active',
      plan: 'Enterprise',
      lastActive: '3 hours ago'
    },
    {
      id: 5,
      name: 'DataDriven LLC',
      email: 'contact@datadriven.com',
      status: 'Inactive',
      plan: 'Professional',
      lastActive: '1 week ago'
    },
    {
      id: 6,
      name: 'CloudFirst',
      email: 'support@cloudfirst.io',
      status: 'Active',
      plan: 'Starter',
      lastActive: '30 minutes ago'
    }
  ]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="admin-page">
      <AdminSidePanel />
      
      <main className="admin-main">
        <div className="admin-content">
          {/* Header Section */}
          <div className="admin-header">
            <h1 className="admin-header-title">Dashboard</h1>
            <div className="admin-header-actions">
              <button className="admin-btn admin-btn-secondary">
                <Filter size={16} />
                <span>Filters</span>
              </button>
              <button className="admin-btn admin-btn-secondary">
                <Download size={16} />
                <span>Export</span>
              </button>
              <button className="admin-btn admin-btn-primary">
                <Plus size={16} />
                <span>Add New</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="admin-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="admin-stat-card">
                  <div className="admin-stat-card-header">
                    <div className={`admin-stat-icon ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stat.value}</div>
                  <div className={`admin-stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                    <span>{stat.change}</span>
                  </div>
                  <div className="admin-stat-label">{stat.title}</div>
                </div>
              );
            })}
          </div>

          {/* Data Table */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">Recent Activity</h2>
              <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px' }}>
                View All
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>
                      <span className={`admin-badge ${getStatusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.plan}</td>
                    <td>{row.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
