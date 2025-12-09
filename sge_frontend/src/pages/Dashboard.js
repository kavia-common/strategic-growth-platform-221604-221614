import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Activity, Target, 
  Zap, Heart, TrendingDown, Calendar, Filter
} from 'lucide-react';

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
  { name: 'Acme Corp', engagement: 95 },
  { name: 'TechStart Inc', engagement: 88 },
  { name: 'Global Solutions', engagement: 82 },
  { name: 'InnovateCo', engagement: 78 },
  { name: 'DataDriven LLC', engagement: 74 },
  { name: 'CloudFirst', engagement: 68 }
];

// Generate cohort retention data (approximate via stacked area)
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

// Generate activity heatmap data (last 12 months, day-by-day)
const generateHeatmapData = () => {
  const data = [];
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const week = Math.floor(i / 7);
    data.push({
      date: date.toISOString().split('T')[0],
      day: dayOfWeek,
      week,
      count: Math.floor(Math.random() * 20)
    });
  }
  return data;
};

// ============================================
// COMPONENTS
// ============================================

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
  <div className="card flex items-start justify-between hover:shadow-md transition-shadow">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-2">{subtitle}</p>}
      <p className={`text-sm font-medium flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change > 0 ? '+' : ''}{change}% vs last month
      </p>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-50 flex-shrink-0`}>
      <Icon size={24} color={color === 'blue' ? '#2563EB' : (color === 'amber' ? '#F59E0B' : (color === 'green' ? '#10B981' : '#EF4444'))} />
    </div>
  </div>
);

// Activity Heatmap Component (GitHub-style)
const ActivityHeatmap = ({ data }) => {
  const getColor = (count) => {
    if (count === 0) return '#F3F4F6';
    if (count < 5) return '#DBEAFE';
    if (count < 10) return '#93C5FD';
    if (count < 15) return '#3B82F6';
    return '#1E40AF';
  };

  // Group by week
  const weeks = [];
  for (let w = 0; w <= 52; w++) {
    weeks.push(data.filter(d => d.week === w));
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Activity (Last 12 Months)</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.slice(-52).map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map(day => {
                const cell = week.find(d => d.day === day);
                const count = cell?.count || 0;
                return (
                  <div
                    key={day}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getColor(count) }}
                    title={`${cell?.date || ''}: ${count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#F3F4F6' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#DBEAFE' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#93C5FD' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3B82F6' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1E40AF' }} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
        </p>
      ))}
    </div>
  );
};

// PUBLIC_INTERFACE
/**
 * Comprehensive Analytics Dashboard
 * Features: 8 KPI cards, activity heatmap, multi-series charts, stacked bar,
 * donut chart, horizontal bar, cohort retention, and filters
 */
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
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  // Calculate moving average for growth data
  const growthWithMA = useMemo(() => {
    return growthData.map((item, idx) => {
      if (idx < 2) return { ...item, mrrMA: item.mrr, usersMA: item.users };
      const mrrMA = (growthData[idx - 2].mrr + growthData[idx - 1].mrr + item.mrr) / 3;
      const usersMA = (growthData[idx - 2].users + growthData[idx - 1].users + item.users) / 3;
      return { ...item, mrrMA, usersMA };
    });
  }, [growthData]);

  // KPI values (mock - would filter based on dateRange/segment/plan in real app)
  const kpis = {
    mrr: { value: '$45,231', change: 12.3, subtitle: 'Monthly Recurring Revenue' },
    arr: { value: '$542,772', change: 15.8, subtitle: 'Annual Recurring Revenue' },
    activeUsers: { value: '2,847', change: 8.4, subtitle: 'Active this month' },
    dauMau: { value: '42.5%', change: 3.2, subtitle: 'Daily/Monthly Active Ratio' },
    conversion: { value: '18.6%', change: -1.5, subtitle: 'Trial to Paid' },
    churn: { value: '3.2%', change: -0.8, subtitle: 'Monthly Churn Rate' },
    nps: { value: '58', change: 5.0, subtitle: 'Net Promoter Score' },
    ltvCac: { value: '4.2x', change: 6.5, subtitle: 'Lifetime Value / CAC' }
  };

  // Filter UI
  const FilterBar = () => (
    <div className="card flex flex-wrap items-center gap-4 mb-6">
      <Filter size={20} className="text-gray-400" />
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Date Range:</label>
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="input py-2 px-3 text-sm"
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Segment:</label>
        <select 
          value={segment} 
          onChange={(e) => setSegment(e.target.value)}
          className="input py-2 px-3 text-sm"
        >
          <option value="all">All Segments</option>
          <option value="enterprise">Enterprise</option>
          <option value="mid-market">Mid-Market</option>
          <option value="smb">SMB</option>
          <option value="startup">Startup</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Plan:</label>
        <select 
          value={plan} 
          onChange={(e) => setPlan(e.target.value)}
          className="input py-2 px-3 text-sm"
        >
          <option value="all">All Plans</option>
          <option value="enterprise">Enterprise</option>
          <option value="professional">Professional</option>
          <option value="starter">Starter</option>
          <option value="trial">Trial</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights into your organization's performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Updated 5 min ago</span>
        </div>
      </div>

      {/* Filters */}
      <FilterBar />

      {/* KPI Grid - 8 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="MRR" value={kpis.mrr.value} change={kpis.mrr.change} icon={DollarSign} color="blue" subtitle={kpis.mrr.subtitle} />
        <StatCard title="ARR" value={kpis.arr.value} change={kpis.arr.change} icon={TrendingUp} color="blue" subtitle={kpis.arr.subtitle} />
        <StatCard title="Active Users" value={kpis.activeUsers.value} change={kpis.activeUsers.change} icon={Users} color="amber" subtitle={kpis.activeUsers.subtitle} />
        <StatCard title="DAU/MAU" value={kpis.dauMau.value} change={kpis.dauMau.change} icon={Activity} color="green" subtitle={kpis.dauMau.subtitle} />
        <StatCard title="Conversion" value={kpis.conversion.value} change={kpis.conversion.change} icon={Target} color="green" subtitle={kpis.conversion.subtitle} />
        <StatCard title="Churn" value={kpis.churn.value} change={kpis.churn.change} icon={TrendingDown} color="red" subtitle={kpis.churn.subtitle} />
        <StatCard title="NPS" value={kpis.nps.value} change={kpis.nps.change} icon={Heart} color="amber" subtitle={kpis.nps.subtitle} />
        <StatCard title="LTV/CAC" value={kpis.ltvCac.value} change={kpis.ltvCac.change} icon={Zap} color="blue" subtitle={kpis.ltvCac.subtitle} />
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap data={heatmapData} />

      {/* Revenue & Users Growth with Moving Average */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR Growth & Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthWithMA}>
              <defs>
                <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="mrr" stroke="#2563EB" fill="url(#colorMRR)" strokeWidth={2} name="MRR" />
              <Line type="monotone" dataKey="mrrMA" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="3-Month MA" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth & Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthWithMA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} name="Active Users" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="usersMA" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="3-Month MA" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage by Segment (Stacked Bar) */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage by Segment</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={featureUsage} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis dataKey="segment" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="analytics" stackId="a" fill="#2563EB" name="Analytics" />
            <Bar dataKey="chat" stackId="a" fill="#10B981" name="AI Chat" />
            <Bar dataKey="reports" stackId="a" fill="#F59E0B" name="Reports" />
            <Bar dataKey="workflows" stackId="a" fill="#8B5CF6" name="Workflows" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Plan Distribution (Donut) & Top Accounts (Horizontal Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500">Total Accounts</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Accounts by Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAccounts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis dataKey="name" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={120} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
              <Bar dataKey="engagement" fill="#2563EB" radius={[0, 4, 4, 0]} name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort Retention (Stacked Area approximation) */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Retention Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
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
            <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
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
  );
};

export default Dashboard;
