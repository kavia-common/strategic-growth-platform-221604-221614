import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, ComposedChart
} from 'recharts';
import ChartCard from './ChartCard';

const COLORS = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  indigo: '#6366F1'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827' }}>{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>
            {entry.name}: <strong>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

const EnhancedOpsSection = ({ data, timeRange }) => {
  const sampleData = data && data.length > 0 ? data : generateSampleOpsData(timeRange);
  
  // Ticket categories for bar chart
  const ticketCategories = [
    { category: 'Bug Reports', count: 145, resolved: 132 },
    { category: 'Feature Requests', count: 89, resolved: 45 },
    { category: 'Support', count: 234, resolved: 228 },
    { category: 'Billing', count: 56, resolved: 54 },
    { category: 'Technical', count: 178, resolved: 156 }
  ];

  // Activity heatmap data (simplified grid representation)
  const activityHeatmap = generateActivityHeatmap();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* System Uptime */}
      <ChartCard title="System Uptime & Availability" subtitle="Percentage uptime over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} domain={[99, 100]} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="uptime" stroke={COLORS.success} fill="url(#colorUptime)" strokeWidth={2} name="Uptime (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Incidents & Tickets */}
      <ChartCard title="Incidents & Support Tickets" subtitle="Daily operational load">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="tickets" fill={COLORS.secondary} radius={[4, 4, 0, 0]} name="Tickets" />
            <Line type="monotone" dataKey="incidents" stroke={COLORS.error} strokeWidth={3} name="Incidents" dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Response & Resolution Time */}
      <ChartCard title="Response & Resolution Time" subtitle="Average time metrics (hours)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="response_time" stroke={COLORS.indigo} strokeWidth={3} name="Response Time (hrs)" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="resolution_time" stroke={COLORS.purple} strokeWidth={3} name="Resolution Time (hrs)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tickets by Category */}
      <ChartCard title="Tickets by Category" subtitle="Volume and resolution status">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ticketCategories} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
            <YAxis dataKey="category" type="category" stroke="#9CA3AF" fontSize={12} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="count" fill={COLORS.secondary} radius={[0, 4, 4, 0]} name="Total" />
            <Bar dataKey="resolved" fill={COLORS.success} radius={[0, 4, 4, 0]} name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Activity Heatmap */}
      <ChartCard title="Activity Heatmap" subtitle="User activity by day and hour">
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingLeft: '60px' }}>
            {['00', '04', '08', '12', '16', '20'].map(hour => (
              <div key={hour} style={{ flex: 1, fontSize: '11px', color: '#6B7280', textAlign: 'center' }}>
                {hour}:00
              </div>
            ))}
          </div>
          {activityHeatmap.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '50px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                {row.day}
              </div>
              <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                {row.hours.map((intensity, hourIdx) => (
                  <div
                    key={hourIdx}
                    style={{
                      flex: 1,
                      height: '32px',
                      backgroundColor: getHeatmapColor(intensity),
                      borderRadius: '4px',
                      border: '1px solid #E5E7EB'
                    }}
                    title={`${row.day} ${hourIdx * 4}:00 - Activity: ${intensity}`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px', paddingLeft: '60px' }}>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Less</span>
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((val, idx) => (
              <div
                key={idx}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: getHeatmapColor(val),
                  borderRadius: '4px',
                  border: '1px solid #E5E7EB'
                }}
              />
            ))}
            <span style={{ fontSize: '11px', color: '#6B7280' }}>More</span>
          </div>
        </div>
      </ChartCard>

      {/* Deployment Frequency */}
      <ChartCard title="Deployment Frequency" subtitle="Number of deployments per day">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="deployments" fill={COLORS.primary} radius={[8, 8, 0, 0]} name="Deployments" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

function generateSampleOpsData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().substring(5, 10);
    
    data.push({
      date: dateStr,
      uptime: 99.5 + Math.random() * 0.5,
      tickets: Math.floor(35 + Math.random() * 25),
      incidents: Math.floor(1 + Math.random() * 4),
      response_time: Math.floor(1.5 + Math.random() * 2),
      resolution_time: Math.floor(4 + Math.random() * 6),
      deployments: Math.floor(2 + Math.random() * 4)
    });
  }
  
  return data;
}

function generateActivityHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    hours: Array.from({ length: 6 }, () => Math.random())
  }));
}

function getHeatmapColor(intensity) {
  const colors = [
    '#EFF6FF', // Very light blue
    '#BFDBFE', // Light blue
    '#60A5FA', // Medium blue
    '#3B82F6', // Blue
    '#2563EB'  // Dark blue (primary)
  ];
  const index = Math.floor(intensity * (colors.length - 1));
  return colors[index];
}

export default EnhancedOpsSection;
