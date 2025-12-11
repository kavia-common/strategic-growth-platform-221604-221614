import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, DollarSign, Target, 
  Eye, Zap, AlertCircle,
  Activity, ArrowUpRight, ArrowDownRight,
  Users, Layers, Clock, Settings
} from 'lucide-react';
import { getDashboardSummary } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

// ============================================
// MOCK DATA GENERATORS & CONSTANTS
// ============================================

const COLORS = ['#E3B76A', '#2563EB', '#10B981', '#F59E0B', '#EF4444'];

const generateGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    month,
    revenue: 120 + idx * 10 + Math.random() * 20,
    target: 100 + idx * 12,
    customers: 50 + idx * 5 + Math.random() * 10
  }));
};

const generateEngagementData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    dau: 200 + Math.random() * 50,
    mau: 1500 + Math.random() * 100,
    retention: 85 + Math.random() * 10
  }));
};

const generateRevenueData = () => {
  const products = ['Enterprise', 'Pro', 'Team', 'Starter'];
  return products.map((name, index) => ({
    name,
    value: 400 - (index * 80) + Math.random() * 50
  }));
};

const generateOpsData = () => {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  return weeks.map((week, idx) => ({
    week,
    velocity: 70 + idx * 4 + Math.random() * 10,
    incidents: Math.floor(Math.random() * 5)
  }));
};

const generateRiskTrendsData = () => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  return quarters.map((quarter, idx) => ({
    quarter,
    high: 5 + Math.random() * 3,
    medium: 12 + Math.random() * 5,
    low: 20 + Math.random() * 8,
  }));
};

const generateRecommendationsData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, idx) => ({
    month,
    accepted: 75 + idx * 2 + Math.random() * 8,
  }));
};

const generateInsights = () => [
  { id: 1, text: 'Revenue growth exceeded targets by 12% this quarter', meta: '2 hours ago', priority: 'high' },
  { id: 2, text: 'Customer retention improved to 94%, up 3% from last month', meta: '4 hours ago', priority: 'high' },
  { id: 3, text: 'New market segment showing 28% conversion rate', meta: '6 hours ago', priority: 'medium' },
  { id: 4, text: 'Strategic initiative "Project Phoenix" is 85% complete', meta: '1 day ago', priority: 'medium' },
  { id: 5, text: 'Team productivity metrics up 15% after recent changes', meta: '1 day ago', priority: 'low' },
  { id: 6, text: 'Quarterly risk assessment completed with low overall risk', meta: '2 days ago', priority: 'low' },
  { id: 7, text: 'Customer feedback NPS score reached 62, highest this year', meta: '2 days ago', priority: 'medium' },
  { id: 8, text: 'New partnership opportunities identified in APAC region', meta: '3 days ago', priority: 'high' },
];

const generateStrategicProjects = () => [
  { id: 1, name: 'Digital Transformation Initiative', status: 'in-progress', priority: 'high', completion: 68, owner: 'Sarah Chen' },
  { id: 2, name: 'Customer Experience Redesign', status: 'active', priority: 'high', completion: 82, owner: 'Mike Thompson' },
  { id: 3, name: 'Market Expansion - EMEA', status: 'pending', priority: 'medium', completion: 35, owner: 'Alex Rodriguez' },
  { id: 4, name: 'Product Innovation Lab', status: 'in-progress', priority: 'high', completion: 55, owner: 'Emma Williams' },
  { id: 5, name: 'Operational Excellence Program', status: 'completed', priority: 'medium', completion: 100, owner: 'David Kim' },
  { id: 6, name: 'Sustainability Initiative', status: 'on-hold', priority: 'low', completion: 20, owner: 'Lisa Anderson' },
];

// ============================================
// COMPONENTS
// ============================================

const ExecutiveMetricCard = ({ title, value, change, icon: Icon, colorClass }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div className="metric-icon" style={colorClass ? { color: colorClass } : {}}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className="metric-label">{title}</p>
        <h3 className="metric-value">{value}</h3>
        <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #E8E8E8',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1C1C1C' }}>{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
          <span style={{ fontSize: '14px', color: '#1C1C1C' }}>
            {entry.name}: <strong>{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Filters
  const [dateRange, setDateRange] = useState('12m');
  const [segment, setSegment] = useState('all');
  const [planTier, setPlanTier] = useState('all');

  // Memos for Mock Data (re-generate only on mount to act as stable mock)
  const growthData = useMemo(() => generateGrowthData(), []);
  const engagementData = useMemo(() => generateEngagementData(), []);
  const revenueData = useMemo(() => generateRevenueData(), []);
  const opsData = useMemo(() => generateOpsData(), []);
  const riskTrendsData = useMemo(() => generateRiskTrendsData(), []);
  const recommendationsData = useMemo(() => generateRecommendationsData(), []);
  const insights = useMemo(() => generateInsights(), []);
  const projects = useMemo(() => generateStrategicProjects(), []);

  // Fetch Data Effect (with Mock fallback)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Attempt to fetch from backend
        // const response = await getDashboardSummary();
        // setData(response.data);
        
        // For now, simulate network delay and use mock
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data, using mocks', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, segment, planTier]);

  // Executive Metrics derived from mock data
  const executiveMetrics = [
    { title: 'Total Revenue', value: '$2.4M', change: 12.3, icon: DollarSign }, // Revenue
    { title: 'Active Users', value: '1,240', change: 8.5, icon: Users }, // Engagement
    { title: 'Execution Velocity', value: '87%', change: 5.2, icon: Zap }, // Ops
    { title: 'Growth Rate', value: '18%', change: 3.8, icon: TrendingUp }, // Growth
  ];

  const orgName = user?.user_metadata?.org_name || 'Organization';

  // Render Helpers
  const renderOverview = () => (
    <>
      {/* Executive Metrics */}
      <section>
        <div className="executive-metrics-grid">
          {executiveMetrics.map((metric, idx) => (
            <ExecutiveMetricCard key={idx} {...metric} />
          ))}
        </div>
      </section>

      {/* Two-Column: Insights + Main Chart */}
      <section>
        <div className="dashboard-two-column">
          {/* Insights Panel */}
          <div className="insights-panel">
            <div className="insights-header">
              <div className="insights-icon">
                <AlertCircle size={20} />
              </div>
              <h3 className="insights-title">Latest Insights</h3>
            </div>
            <div className="insights-list">
              {insights.map(insight => (
                <div key={insight.id} className="insight-item">
                  <div className="insight-dot" />
                  <div className="insight-content">
                    <p className="insight-text">{insight.text}</p>
                    <p className="insight-meta">{insight.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Chart (Overview) */}
          <div className="momentum-chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Growth & Revenue</h3>
                <p className="chart-subtitle">Revenue vs Target Performance</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E3B76A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E3B76A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                  <XAxis dataKey="month" stroke="#B0B4B8" fontSize={12} />
                  <YAxis stroke="#B0B4B8" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#E3B76A" fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#2563EB" strokeDasharray="5 5" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Cards */}
      <section>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Strategic Framework</h2>
            <p className="dashboard-section-subtitle">Core methodologies driving growth</p>
          </div>
        </div>
        <div className="framework-cards-grid">
          {[
            { title: 'Reveal', desc: 'Uncover hidden opportunities.', icon: Eye, val: '127' },
            { title: 'Reframe', desc: 'Transform challenges into strategies.', icon: Zap, val: '18' },
            { title: 'Realign', desc: 'Align efforts with goals.', icon: Target, val: '24' }
          ].map((card, idx) => (
            <div key={idx} className="framework-card">
              <div className="framework-card-icon"><card.icon size={28} /></div>
              <h3 className="framework-card-title">{card.title}</h3>
              <p className="framework-card-description">{card.desc}</p>
              <div className="framework-card-stat">
                <span className="framework-stat-label">Insights</span>
                <span className="framework-stat-value">{card.val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Table */}
      <section>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Active Projects</h2>
            <p className="dashboard-section-subtitle">Strategic initiatives status</p>
          </div>
        </div>
        <div className="strategic-projects-card">
          <div className="sp-table-scroll">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Completion</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td style={{ fontWeight: 500 }}>{project.name}</td>
                    <td>
                      <span className={`status-pill ${project.status}`}>
                        <span className="status-indicator" />
                        {project.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`project-priority priority-${project.priority}`}>
                        {project.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#F5F5F5', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${project.completion}%`, height: '100%', backgroundColor: '#E3B76A' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#B0B4B8' }}>{project.completion}%</span>
                      </div>
                    </td>
                    <td>{project.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );

  const renderDeepDive = (type) => {
    // Render specific charts based on type: Growth, Engagement, Revenue, Ops
    return (
      <div className="sge-visualizations-grid">
        {type === 'Growth' && (
          <>
            <div className="visualization-card">
              <h3 className="chart-title">Revenue Trends</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="visualization-card">
              <h3 className="chart-title">Customer Acquisition</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="customers" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {type === 'Engagement' && (
          <>
             <div className="visualization-card">
              <h3 className="chart-title">Daily Active Users</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="dau" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="visualization-card">
              <h3 className="chart-title">Retention Rate</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="retention" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {type === 'Revenue' && (
          <>
            <div className="visualization-card">
              <h3 className="chart-title">Revenue by Plan</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={revenueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="visualization-card">
              <h3 className="chart-title">Recommendation Acceptance</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <LineChart data={recommendationsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {type === 'Ops' && (
          <>
            <div className="visualization-card">
              <h3 className="chart-title">Execution Velocity</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <AreaChart data={opsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="velocity" stroke="#E3B76A" fill="#E3B76A" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="visualization-card">
              <h3 className="chart-title">Risk Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <BarChart data={riskTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#EF4444" />
                    <Bar dataKey="medium" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="low" stackId="a" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading && !data && !growthData) {
    return <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Header & Controls */}
        <section className="dashboard-controls">
          <div>
            <h2 className="dashboard-section-title">Dashboard</h2>
            <p className="dashboard-section-subtitle">
              Welcome back, {user?.email} • <span style={{ color: '#E3B76A' }}>{orgName}</span>
            </p>
          </div>
          
          {/* Tabs */}
          <div className="tabs-container">
            {['Overview', 'Growth', 'Engagement', 'Revenue', 'Ops'].map(tab => (
              <button 
                key={tab} 
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <select className="filter-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option value="1m">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last Year</option>
            </select>
            <select className="filter-select" value={segment} onChange={e => setSegment(e.target.value)}>
              <option value="all">All Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="smb">SMB</option>
            </select>
            <select className="filter-select" value={planTier} onChange={e => setPlanTier(e.target.value)}>
              <option value="all">All Plans</option>
              <option value="pro">Pro Plan</option>
              <option value="team">Team Plan</option>
            </select>
          </div>
        </section>

        {/* Dynamic Content */}
        {activeTab === 'Overview' ? renderOverview() : renderDeepDive(activeTab)}

      </div>
    </div>
  );
};

export default Dashboard;
