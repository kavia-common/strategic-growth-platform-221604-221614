import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Home, BarChart3, Folder, FileText, Settings, Users, Briefcase, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';

// Mock data for charts and tables
const productivityData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 61 },
  { day: 'Thu', value: 58 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 65 },
  { day: 'Sun', value: 78 }
];

const workloadData = [
  { week: 'Week 1', value: 75 },
  { week: 'Week 2', value: 90 },
  { week: 'Week 3', value: 60 },
  { week: 'Week 4', value: 85 }
];

const taskStatusData = [
  { name: 'Completed', value: 45, color: '#F5A623' },
  { name: 'In Progress', value: 32, color: '#4A90E2' },
  { name: 'Pending', value: 18, color: '#E94B8A' },
  { name: 'Blocked', value: 5, color: '#7B68EE' }
];

const recentSessions = [
  { name: 'AHS Analysis', date: 'March 5, 2024', participants: '12 users', status: 'Active' },
  { name: 'Strategy Mtng', date: 'March 4, 2024', participants: '8 users', status: 'Pending' },
  { name: 'Project Kickoff', date: 'March 3, 2024', participants: '15 users', status: 'In Progress' }
];

// PUBLIC_INTERFACE
/**
 * Dashboard Component
 * Implements pixel-accurate dashboard layout per design notes with:
 * - Fixed 240px sidebar with active/inactive/hover states
 * - Top header with title and action button
 * - 4-column metrics grid with icon chips and change indicators
 * - Charts row with line chart (Productivity) and bar chart (Workload)
 * - Bottom row with Recent Sessions table and Task Status donut chart
 * - Full responsive behavior and Ocean Professional theme
 */
export default function Dashboard() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, active: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
    { id: 'projects', label: 'Projects', icon: Folder, active: false },
    { id: 'reports', label: 'Reports', icon: FileText, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: false }
  ];

  return (
    <div className="dashboard-layout">
      {/* Fixed Sidebar - 240px */}
      <aside className="dashboard-sidebar">
        {/* Logo Area */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span className="sidebar-logo-symbol">D</span>
          </div>
          <span className="sidebar-logo-text">Dashboard</span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              >
                <Icon className="sidebar-nav-icon" size={20} />
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-header-title">AI Facilitator</h1>
          <button className="dashboard-header-button">
            Link for analyze crowd intel
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-content">
          {/* Metrics Grid - 4 Cards */}
          <div className="metrics-grid">
            {/* Metric Card 1: Total Users */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <Users className="metric-icon" size={20} />
              </div>
              <div className="metric-label">Total Users</div>
              <div className="metric-value">12,8</div>
              <div className="metric-change positive">
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>

            {/* Metric Card 2: Active Projects */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <Briefcase className="metric-icon" size={20} />
              </div>
              <div className="metric-label">Active Projects</div>
              <div className="metric-value">45</div>
              <div className="metric-change positive">
                <TrendingUp size={14} />
                <span>+8.3%</span>
              </div>
            </div>

            {/* Metric Card 3: Revenue */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <DollarSign className="metric-icon" size={20} />
              </div>
              <div className="metric-label">Revenue</div>
              <div className="metric-value">₹24</div>
              <div className="metric-change positive">
                <TrendingUp size={14} />
                <span>+8.2%</span>
              </div>
            </div>

            {/* Metric Card 4: AI Chat Sessions */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <MessageSquare className="metric-icon" size={20} />
              </div>
              <div className="metric-label">AI Chat Sessions</div>
              <div className="metric-value">3,234</div>
              <div className="metric-change positive">
                <TrendingUp size={14} />
                <span>+15.3%</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Line Chart Card - Productivity */}
            <div className="chart-card chart-card-large">
              <div className="chart-header">
                <h3 className="chart-title">Productivity over last 7 days</h3>
                <select className="chart-filter-dropdown">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: 'var(--gray-600)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--gray-200)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--gray-600)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--gray-200)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '6px',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '12px'
                      }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-blue)" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="var(--chart-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--chart-blue)" 
                      strokeWidth={2}
                      dot={{ r: 6, fill: 'var(--chart-blue)', strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 8 }}
                      fill="url(#lineGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart Card - Workload */}
            <div className="chart-card chart-card-small">
              <div className="chart-header">
                <h3 className="chart-title">Workload by Team</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: 'var(--gray-600)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--gray-200)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--gray-600)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--gray-200)' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '6px',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--chart-blue)" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row - Table and Donut Chart */}
          <div className="bottom-row">
            {/* Recent Sessions Table */}
            <div className="table-card">
              <h3 className="table-title">Recent Sessions</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Session Name</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session, idx) => (
                      <tr key={idx}>
                        <td className="table-cell-primary">{session.name}</td>
                        <td className="table-cell-secondary">{session.date}</td>
                        <td className="table-cell-secondary">{session.participants}</td>
                        <td>
                          <span className={`status-badge status-${session.status.toLowerCase().replace(' ', '-')}`}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Task Status Donut Chart */}
            <div className="donut-card">
              <h3 className="donut-title">Task Status</h3>
              <div className="donut-container">
                <div className="donut-chart-wrapper">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid var(--gray-200)',
                          borderRadius: '6px',
                          boxShadow: 'var(--shadow-lg)',
                          padding: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="donut-legend">
                  {taskStatusData.map((item, idx) => (
                    <div key={idx} className="legend-item">
                      <div 
                        className="legend-indicator" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-label">{item.name}</span>
                      <span className="legend-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
