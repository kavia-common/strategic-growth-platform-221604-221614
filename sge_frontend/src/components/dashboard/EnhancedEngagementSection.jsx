import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, CustomTooltip } from './ChartTheme';

const EnhancedEngagementSection = ({ data, timeRange }) => {
  // Generate rich sample data if not provided
  const sampleData = data && data.length > 0 ? data : generateSampleEngagementData(timeRange);
  
  // Session buckets data for stacked bar chart
  const sessionBuckets = [
    { range: '0-5min', count: 2840, percentage: 28 },
    { range: '5-15min', count: 4230, percentage: 42 },
    { range: '15-30min', count: 1890, percentage: 19 },
    { range: '30-60min', count: 780, percentage: 8 },
    { range: '60+min', count: 310, percentage: 3 }
  ];

  // User segment engagement for pie chart
  const userSegments = [
    { name: 'Power Users', value: 3200, color: CHART_COLORS.primary },
    { name: 'Regular Users', value: 5800, color: CHART_COLORS.secondary },
    { name: 'Casual Users', value: 2400, color: CHART_COLORS.success },
    { name: 'New Users', value: 1600, color: CHART_COLORS.purple }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* DAU vs MAU Trend */}
      <ChartCard title="Daily & Monthly Active Users" subtitle="User activity trends over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMAU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.6}/>
                <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="dau" stroke={CHART_COLORS.primary} fill="url(#colorDAU)" strokeWidth={2} name="DAU" />
            <Area type="monotone" dataKey="mau" stroke={CHART_COLORS.secondary} fill="url(#colorMAU)" strokeWidth={2} name="MAU" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Session Duration Distribution - Stacked Bar */}
      <ChartCard title="Session Duration Distribution" subtitle="How long users stay engaged">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sessionBuckets} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="range" stroke={CHART_COLORS.gray} fontSize={12} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Retention & Feature Adoption */}
      <ChartCard title="Retention & Feature Adoption" subtitle="7-day retention vs new feature usage">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="retention_7d" stroke={CHART_COLORS.indigo} strokeWidth={3} name="7d Retention (%)" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="feature_adoption" stroke={CHART_COLORS.pink} strokeWidth={3} name="Feature Adoption (%)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* User Segment Breakdown - Donut Chart */}
      <ChartCard title="User Segment Engagement" subtitle="Distribution by activity level">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={userSegments}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percentage, value }) => `${name}: ${value.toLocaleString()}`}
              labelLine={{ stroke: CHART_COLORS.gray, strokeWidth: 1 }}
            >
              {userSegments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

// Generate sample data based on time range
function generateSampleEngagementData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().substring(5, 10);
    
    data.push({
      date: dateStr,
      dau: Math.floor(8000 + Math.random() * 2000 + i * 50),
      mau: Math.floor(25000 + Math.random() * 5000 + i * 100),
      retention_7d: Math.floor(72 + Math.random() * 8),
      feature_adoption: Math.floor(58 + Math.random() * 12),
      avg_session: Math.floor(18 + Math.random() * 8)
    });
  }
  
  return data;
}

export default EnhancedEngagementSection;
