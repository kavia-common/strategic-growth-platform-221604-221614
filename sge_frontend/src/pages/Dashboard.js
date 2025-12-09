import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, DollarSign, MessageSquare, TrendingUp, TrendingDown, Target, Clock, Award, Activity } from 'lucide-react';

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

const topPerformersData = [
  { name: 'Marketing Team', score: 92 },
  { name: 'Sales Team', score: 88 },
  { name: 'Product Team', score: 85 },
  { name: 'Engineering', score: 79 },
  { name: 'Support Team', score: 75 }
];

const recentSessions = [
  { name: 'AHS Analysis', date: 'March 5, 2024', participants: '12 users', status: 'Active' },
  { name: 'Strategy Mtng', date: 'March 4, 2024', participants: '8 users', status: 'Pending' },
  { name: 'Project Kickoff', date: 'March 3, 2024', participants: '15 users', status: 'In Progress' },
  { name: 'Q1 Review', date: 'March 2, 2024', participants: '20 users', status: 'Completed' }
];

const recentActivities = [
  { title: 'New user signup', time: '5 minutes ago', type: 'success' },
  { title: 'Report generated', time: '1 hour ago', type: 'info' },
  { title: 'System update', time: '2 hours ago', type: 'warning' },
  { title: 'Backup completed', time: '3 hours ago', type: 'success' }
];

// PUBLIC_INTERFACE
/**
 * Dashboard Component
 * Implements responsive dashboard layout with:
 * - Multiple KPI rows with trend indicators
 * - Responsive grid that adapts across breakpoints (1 col mobile, 2 tablet, 3-4 desktop)
 * - Multiple chart types (line, bar, horizontal bar, donut)
 * - Data tables and activity cards
 * - Full vertical scrolling without content clipping
 * - Ocean Professional theme styling
 */
export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Primary KPI Row - 4 columns */}
      <div className="metrics-grid">
        {/* Metric Card 1: Total Users */}
        <div className="metric-card">
          <div className="metric-icon-container bg-blue">
            <Users className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Total Users</div>
          <div className="metric-value">12,845</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+12.5%</span>
          </div>
        </div>

        {/* Metric Card 2: Active Projects */}
        <div className="metric-card">
          <div className="metric-icon-container bg-green">
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
          <div className="metric-icon-container bg-amber">
            <DollarSign className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Revenue</div>
          <div className="metric-value">$24,891</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+8.2%</span>
          </div>
        </div>

        {/* Metric Card 4: AI Chat Sessions */}
        <div className="metric-card">
          <div className="metric-icon-container bg-purple">
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

      {/* Secondary KPI Row - Additional Metrics */}
      <div className="metrics-grid">
        {/* Metric Card 5: Completion Rate */}
        <div className="metric-card">
          <div className="metric-icon-container bg-teal">
            <Target className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Completion Rate</div>
          <div className="metric-value">87.5%</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+3.2%</span>
          </div>
        </div>

        {/* Metric Card 6: Avg Response Time */}
        <div className="metric-card">
          <div className="metric-icon-container bg-orange">
            <Clock className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Avg Response Time</div>
          <div className="metric-value">2.4s</div>
          <div className="metric-change negative">
            <TrendingDown size={14} />
            <span>-5.1%</span>
          </div>
        </div>

        {/* Metric Card 7: Top Performer Score */}
        <div className="metric-card">
          <div className="metric-icon-container bg-pink">
            <Award className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Top Performer Score</div>
          <div className="metric-value">92</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+2.0%</span>
          </div>
        </div>

        {/* Metric Card 8: Active Sessions */}
        <div className="metric-card">
          <div className="metric-icon-container bg-indigo">
            <Activity className="metric-icon" size={20} />
          </div>
          <div className="metric-label">Active Sessions</div>
          <div className="metric-value">156</div>
          <div className="metric-change positive">
            <TrendingUp size={14} />
            <span>+18.7%</span>
          </div>
        </div>
      </div>

      {/* Charts Row - 2 columns on desktop, stacks on mobile/tablet */}
      <div className="charts-row">
        {/* Line Chart Card - Productivity */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Productivity over last 7 days</h3>
            <select className="chart-filter-dropdown">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--chart-blue)" 
                  strokeWidth={2}
                  dot={{ r: 6, fill: 'var(--chart-blue)', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Card - Workload */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Workload by Week</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
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
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Three Column Section - Top Performers, Donut Chart, Recent Activity */}
      <div className="three-col-row">
        {/* Top Performers - Horizontal Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Top Performers</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={topPerformersData} 
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis 
                  type="number"
                  tick={{ fill: 'var(--gray-600)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--gray-200)' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fill: 'var(--gray-600)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--gray-200)' }}
                  width={100}
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
                  dataKey="score" 
                  fill="var(--chart-yellow)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Donut Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Task Status</h3>
          <div className="donut-container">
            <div className="donut-chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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

        {/* Recent Activity Card */}
        <div className="activity-card">
          <h3 className="chart-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Sessions Table */}
      <div className="bottom-row">
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
      </div>
    </div>
  );
}
