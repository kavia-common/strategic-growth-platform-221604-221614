import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, DollarSign, Target, 
  Eye, Zap, AlertCircle,
  Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import '../styles/Dashboard.css';

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateMomentumData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    month,
    momentum: 65 + idx * 3 + Math.random() * 8,
  }));
};

const generateExecutionVelocityData = () => {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  return weeks.map((week, idx) => ({
    week,
    velocity: 70 + idx * 4 + Math.random() * 10,
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

const ExecutiveMetricCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div className="metric-icon">
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
  const [timeRange, setTimeRange] = useState('12m');

  const momentumData = useMemo(() => generateMomentumData(), []);
  const executionVelocityData = useMemo(() => generateExecutionVelocityData(), []);
  const riskTrendsData = useMemo(() => generateRiskTrendsData(), []);
  const recommendationsData = useMemo(() => generateRecommendationsData(), []);
  const insights = useMemo(() => generateInsights(), []);
  const projects = useMemo(() => generateStrategicProjects(), []);

  const executiveMetrics = [
    { title: 'Revenue Growth', value: '$2.4M', change: 12.3, icon: DollarSign },
    { title: 'Active Projects', value: '24', change: 8.5, icon: Activity },
    { title: 'Team Velocity', value: '87%', change: 5.2, icon: TrendingUp },
    { title: 'Strategic Alignment', value: '92%', change: 3.8, icon: Target },
  ];

  const frameworkCards = [
    {
      title: 'Reveal',
      description: 'Uncover hidden opportunities and insights from your data to drive strategic decisions.',
      icon: Eye,
      stat: { label: 'Insights', value: '127' }
    },
    {
      title: 'Reframe',
      description: 'Transform challenges into opportunities with innovative problem-solving approaches.',
      icon: Zap,
      stat: { label: 'Strategies', value: '18' }
    },
    {
      title: 'Realign',
      description: 'Align organizational efforts with strategic goals for maximum impact and efficiency.',
      icon: Target,
      stat: { label: 'Initiatives', value: '24' }
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Executive Metrics - 4 Equal Cards */}
        <section>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Executive Metrics</h2>
              <p className="dashboard-section-subtitle">Key performance indicators at a glance</p>
            </div>
          </div>
          <div className="executive-metrics-grid">
            {executiveMetrics.map((metric, idx) => (
              <ExecutiveMetricCard key={idx} {...metric} />
            ))}
          </div>
        </section>

        {/* Two-Column: Insights Panel + Momentum Chart */}
        <section>
          <div className="dashboard-two-column">
            
            {/* Insights Panel - Scrollable List with Gold Dots */}
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

            {/* Momentum Chart - Smooth Gold Line over Grey Grid */}
            <div className="momentum-chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Strategic Momentum</h3>
                  <p className="chart-subtitle">Overall momentum trend over time</p>
                </div>
                <div className="chart-actions">
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="chart-filter"
                  >
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="12m">12 Months</option>
                  </select>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={momentumData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                    <XAxis dataKey="month" stroke="#B0B4B8" fontSize={12} />
                    <YAxis stroke="#B0B4B8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="momentum" 
                      stroke="#E3B76A" 
                      strokeWidth={3}
                      dot={{ fill: '#E3B76A', r: 4 }}
                      activeDot={{ r: 6, fill: '#D4A654' }}
                      name="Momentum Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Framework Cards - Reveal, Reframe, Realign */}
        <section>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Strategic Framework</h2>
              <p className="dashboard-section-subtitle">Core methodologies driving growth</p>
            </div>
          </div>
          <div className="framework-cards-grid">
            {frameworkCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="framework-card">
                  <div className="framework-card-icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="framework-card-title">{card.title}</h3>
                  <p className="framework-card-description">{card.description}</p>
                  <div className="framework-card-stat">
                    <span className="framework-stat-label">{card.stat.label}</span>
                    <span className="framework-stat-value">{card.stat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Additional SGE Visualizations */}
        <section>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">SGE Analytics</h2>
              <p className="dashboard-section-subtitle">Advanced metrics and trends</p>
            </div>
          </div>
          <div className="sge-visualizations-grid">
            
            {/* Execution Velocity Trend */}
            <div className="visualization-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Execution Velocity</h3>
                  <p className="chart-subtitle">Weekly velocity tracking</p>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={executionVelocityData}>
                    <defs>
                      <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E3B76A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E3B76A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                    <XAxis dataKey="week" stroke="#B0B4B8" fontSize={12} />
                    <YAxis stroke="#B0B4B8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="velocity" 
                      stroke="#E3B76A" 
                      strokeWidth={2}
                      fill="url(#velocityGradient)"
                      name="Velocity %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Trends - Stacked Bar */}
            <div className="visualization-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Risk Trends</h3>
                  <p className="chart-subtitle">Risk assessment by severity</p>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                    <XAxis dataKey="quarter" stroke="#B0B4B8" fontSize={12} />
                    <YAxis stroke="#B0B4B8" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#EF4444" name="High Risk" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="medium" stackId="a" fill="#F59E0B" name="Medium Risk" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="low" stackId="a" fill="#10B981" name="Low Risk" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations Accepted Rate */}
            <div className="visualization-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Recommendations Accepted</h3>
                  <p className="chart-subtitle">AI recommendation adoption rate</p>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recommendationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                    <XAxis dataKey="month" stroke="#B0B4B8" fontSize={12} />
                    <YAxis stroke="#B0B4B8" fontSize={12} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="accepted" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 5 }}
                      name="Acceptance Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Projects Table with Colored Status Pills */}
        <section>
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">Strategic Projects</h2>
              <p className="dashboard-section-subtitle">Active initiatives and their progress</p>
            </div>
          </div>
          <div className="strategic-projects-card">
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
                        <div style={{ 
                          flex: 1, 
                          height: '6px', 
                          backgroundColor: '#F5F5F5', 
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${project.completion}%`, 
                            height: '100%', 
                            backgroundColor: '#E3B76A',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#B0B4B8', minWidth: '35px' }}>
                          {project.completion}%
                        </span>
                      </div>
                    </td>
                    <td>{project.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
