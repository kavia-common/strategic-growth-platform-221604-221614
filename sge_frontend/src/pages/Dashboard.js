import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, CreditCard, UserMinus, Percent, Target } from 'lucide-react';

// --- Mock Data ---

// Revenue Over Time (Line Chart)
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
  { month: 'Jul', revenue: 72000 },
];

// Feature Usage by Category (Bar Chart)
const featureData = [
  { category: 'Analytics', usage: 4000 },
  { category: 'Chat AI', usage: 3000 },
  { category: 'Reports', usage: 2000 },
  { category: 'API', usage: 2780 },
  { category: 'Admin', usage: 1890 },
];

// Plan Distribution (Pie Chart)
const planData = [
  { name: 'Enterprise', value: 400 },
  { name: 'Professional', value: 300 },
  { name: 'Starter', value: 300 },
  { name: 'Free', value: 200 },
];
const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#9CA3AF']; // Primary, Secondary, Success, Gray

// Retention / Engagement (Area Chart)
const retentionData = [
  { month: 'Jan', retention: 85 },
  { month: 'Feb', retention: 88 },
  { month: 'Mar', retention: 87 },
  { month: 'Apr', retention: 90 },
  { month: 'May', retention: 92 },
  { month: 'Jun', retention: 91 },
  { month: 'Jul', retention: 94 },
];

// --- Components ---

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  // Map color names to theme colors/classes dynamically would be complex with just CSS variables 
  // if we don't have full Tailwind, so we use inline styles or specific classes.
  // Using utility classes from App.css and inline style for specific colors where utilities might be missing.
  
  const getColorHex = (c) => {
    switch(c) {
      case 'blue': return '#2563EB';
      case 'amber': return '#F59E0B';
      case 'green': return '#10B981';
      case 'red': return '#EF4444';
      case 'purple': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const themeColor = getColorHex(color);
  const bgColor = `${themeColor}15`; // 15 = roughly 10% opacity hex

  return (
    <div className="card flex items-start justify-between hover:shadow-lg transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <div className="flex items-center mt-2">
            <span className={`text-sm font-medium flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="transform rotate-180" />}
                {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
        </div>
      </div>
      <div 
        className="p-3 rounded-lg"
        style={{ backgroundColor: bgColor, color: themeColor }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

// PUBLIC_INTERFACE
const Dashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Monthly Recurring Revenue" 
            value="$45,231" 
            change={20.1} 
            icon={DollarSign} 
            color="blue" 
        />
        <StatCard 
            title="Active Users" 
            value="2,350" 
            change={15.3} 
            icon={Users} 
            color="amber" 
        />
        <StatCard 
            title="Conversion Rate" 
            value="3.2%" 
            change={-1.2} 
            icon={Target} 
            color="purple" 
        />
        <StatCard 
            title="Churn Rate" 
            value="0.8%" 
            change={-0.4} 
            icon={UserMinus} 
            color="red" 
        />
      </div>

      {/* Charts Row 1: Revenue & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="card h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
             <select className="input w-32 py-1 text-sm">
                <option>Last 6M</option>
                <option>Last Year</option>
             </select>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Area Chart */}
        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Retention</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                    <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="retention" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRetention)" 
                />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Feature Usage & Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature Usage Bar Chart (Takes up 2 cols) */}
        <div className="card h-80 flex flex-col lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Usage by Category</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#9CA3AF" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="usage" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Pie Chart */}
        <div className="card h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Distribution</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center pb-8">
                    <p className="text-2xl font-bold text-gray-900">1.2k</p>
                    <p className="text-xs text-gray-500">Total Subs</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
