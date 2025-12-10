import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Activity, Target, 
  Zap, Heart, TrendingDown, Filter,
  Download, Eye, MoreVertical, Search,
  Bell, Settings
} from 'lucide-react';
import classNames from 'classnames';

// ============================================
// MOCK DATA GENERATORS
// ============================================

// Generate 12 months of revenue/user growth data
const generateGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    month,
    mrr: 15000 + idx * 2000 + Math.random() * 3000,
    users: 1200 + idx * 150 + Math.random() * 200,
    arr: (15000 + idx * 2000) * 12
  }));
};

// Generate feature usage by segment
const generateFeatureUsage = () => [
  { segment: 'Enterprise', analytics: 850, chat: 1200, reports: 650, workflows: 480 },
  { segment: 'Mid-Market', analytics: 620, chat: 890, reports: 420, workflows: 310 },
  { segment: 'SMB', analytics: 340, chat: 520, reports: 180, workflows: 140 },
  { segment: 'Startup', analytics: 180, chat: 280, reports: 90, workflows: 60 }
];

// Generate plan distribution
const generatePlanDistribution = () => [
  { name: 'Enterprise', value: 28, color: '#2563EB' },
  { name: 'Professional', value: 42, color: '#F59E0B' },
  { name: 'Starter', value: 22, color: '#10B981' },
  { name: 'Trial', value: 8, color: '#6B7280' }
];

// Generate top accounts by engagement
const generateTopAccounts = () => [
  { name: 'Acme Corp', engagement: 95, growth: '+12%', plan: 'Enterprise' },
  { name: 'TechStart Inc', engagement: 88, growth: '+8%', plan: 'Professional' },
  { name: 'Global Solutions', engagement: 82, growth: '+5%', plan: 'Enterprise' },
  { name: 'InnovateCo', engagement: 78, growth: '+15%', plan: 'Professional' },
  { name: 'DataDriven LLC', engagement: 74, growth: '+3%', plan: 'Starter' },
  { name: 'CloudFirst', engagement: 68, growth: '-2%', plan: 'Professional' }
];

// Generate cohort retention data
const generateCohortData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  return weeks.map((week, idx) => ({
    week,
    cohort1: 100 - idx * 8,
    cohort2: 100 - idx * 10,
    cohort3: 100 - idx * 12,
    cohort4: 100 - idx * 15
  }));
};

// ============================================
// COMPONENTS
// ============================================

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`metric-icon-container ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="space-y-1">
        <p className="metric-label">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="metric-value">{value}</h3>
          <div className={classNames('metric-change', change >= 0 ? 'positive' : 'negative')}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[160px]">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
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
  const [dateRange, setDateRange] = useState('12m');
  const [segment, setSegment] = useState('all');
  const [plan, setPlan] = useState('all');

  // Generate mock data
  const growthData = useMemo(() => generateGrowthData(), []);
  const featureUsage = useMemo(() => generateFeatureUsage(), []);
  const planDistribution = useMemo(() => generatePlanDistribution(), []);
  const topAccounts = useMemo(() => generateTopAccounts(), []);
  const cohortData = useMemo(() => generateCohortData(), []);

  // Calculate moving average for growth data
  const growthWithMA = useMemo(() => {
    return growthData.map((item, idx) => {
      if (idx < 2) return { ...item, mrrMA: item.mrr, usersMA: item.users };
      const mrrMA = (growthData[idx - 2].mrr + growthData[idx - 1].mrr + item.mrr) / 3;
      const usersMA = (growthData[idx - 2].users + growthData[idx - 1].users + item.users) / 3;
      return { ...item, mrrMA, usersMA };
    });
  }, [growthData]);

  // KPI values
  const kpis = [
    { title: 'MRR', value: '$45,231', change: 12.3, subtitle: 'Monthly Recurring Revenue', icon: DollarSign, color: 'blue' },
    { title: 'ARR', value: '$542,772', change: 15.8, subtitle: 'Annual Recurring Revenue', icon: TrendingUp, color: 'blue' },
    { title: 'Active Users', value: '2,847', change: 8.4, subtitle: 'Active this month', icon: Users, color: 'amber' },
    { title: 'DAU/MAU', value: '42.5%', change: 3.2, subtitle: 'Daily/Monthly Active Ratio', icon: Activity, color: 'green' },
    { title: 'Conversion', value: '18.6%', change: -1.5, subtitle: 'Trial to Paid', icon: Target, color: 'green' },
    { title: 'Churn', value: '3.2%', change: -0.8, subtitle: 'Monthly Churn Rate', icon: TrendingDown, color: 'red' },
    { title: 'NPS', value: '58', change: 5.0, subtitle: 'Net Promoter Score', icon: Heart, color: 'amber' },
    { title: 'LTV/CAC', value: '4.2x', change: 6.5, subtitle: 'Lifetime Value / CAC', icon: Zap, color: 'purple' }
  ];

  // Filter Bar Component
  const FilterBar = () => (
    <div className="dashboard-card flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="w-5 h-5 text-blue-600" />
        </div>
        <span className="font-medium text-gray-900">Filters</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="chart-filter-dropdown"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={segment} 
            onChange={(e) => setSegment(e.target.value)}
            className="chart-filter-dropdown"
          >
            <option value="all">All Segments</option>
            <option value="enterprise">Enterprise</option>
            <option value="mid-market">Mid-Market</option>
            <option value="smb">SMB</option>
            <option value="startup">Startup</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={plan} 
            onChange={(e) => setPlan(e.target.value)}
            className="chart-filter-dropdown"
          >
            <option value="all">All Plans</option>
            <option value="enterprise">Enterprise</option>
            <option value="professional">Professional</option>
            <option value="starter">Starter</option>
            <option value="trial">Trial</option>
          </select>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation */}
      <header className="dashboard-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive insights and performance metrics</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search metrics..."
                className="pl-10 pr-4 py-2.5 w-64 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="space-y-6">
          {/* Filters */}
          <FilterBar />

          {/* KPI Grid - 8 Cards */}
          <div className="dashboard-metrics-grid">
            {kpis.map((kpi, idx) => (
              <StatCard key={idx} {...kpi} />
            ))}
          </div>

          {/* Revenue & Users Growth with Moving Average */}
          <div className="dashboard-charts-grid">
            {/* MRR Growth Card */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">MRR Growth & Trend</h3>
                  <p className="text-sm text-gray-500">Monthly recurring revenue with moving average</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthWithMA}>
                    <defs>
                      <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="mrr" stroke="#2563EB" fill="url(#colorMRR)" strokeWidth={2} name="MRR" />
                    <Line type="monotone" dataKey="mrrMA" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="3-Month MA" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Growth Card */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">User Growth & Trend</h3>
                  <p className="text-sm text-gray-500">Active users with moving average trend</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    View details →
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthWithMA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} name="Active Users" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="usersMA" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="3-Month MA" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Feature Usage by Segment */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Feature Usage by Segment</h3>
                <p className="text-sm text-gray-500">Usage distribution across different customer segments</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">3,120</div>
                  <div className="text-sm text-gray-500">Total sessions</div>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis dataKey="segment" type="category" stroke="#6B7280" fontSize={12} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="analytics" stackId="a" fill="#2563EB" name="Analytics" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="chat" stackId="a" fill="#10B981" name="AI Chat" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="reports" stackId="a" fill="#F59E0B" name="Reports" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="workflows" stackId="a" fill="#8B5CF6" name="Workflows" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution & Top Accounts */}
          <div className="dashboard-bottom-grid">
            {/* Plan Distribution */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Plan Distribution</h3>
                  <p className="text-sm text-gray-500">Customer base by subscription plan</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {planDistribution.map((plan, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }}></div>
                      <span className="text-sm text-gray-700">{plan.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{plan.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Accounts */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Accounts by Engagement</h3>
                  <p className="text-sm text-gray-500">Highest engagement scores this month</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all →
                </button>
              </div>
              <div className="space-y-4">
                {topAccounts.map((account, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600">{account.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{account.plan}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                            {account.growth}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{account.engagement}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cohort Retention */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cohort Retention Analysis</h3>
                <p className="text-sm text-gray-500">User retention across different cohorts over time</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time data</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cohortData}>
                  <defs>
                    <linearGradient id="cohort1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="cohort2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="cohort3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="cohort4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="cohort1" stackId="1" stroke="#2563EB" fill="url(#cohort1)" name="Jan Cohort" />
                  <Area type="monotone" dataKey="cohort2" stackId="1" stroke="#10B981" fill="url(#cohort2)" name="Feb Cohort" />
                  <Area type="monotone" dataKey="cohort3" stackId="1" stroke="#F59E0B" fill="url(#cohort3)" name="Mar Cohort" />
                  <Area type="monotone" dataKey="cohort4" stackId="1" stroke="#8B5CF6" fill="url(#cohort4)" name="Apr Cohort" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 p-6 border-t border-gray-200/50 bg-white">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-6">
              <span>© 2024 Analytics Dashboard</span>
              <span>•</span>
              <span>v2.4.1</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-700 transition-colors">Privacy</button>
              <button className="hover:text-gray-700 transition-colors">Terms</button>
              <button className="hover:text-gray-700 transition-colors">Support</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;