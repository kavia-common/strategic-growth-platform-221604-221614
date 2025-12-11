import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import ChartCard from './ChartCard';

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

const EngagementSection = ({ data }) => {
  if (!data || data.length === 0) return <div>No engagement data available</div>;

  return (
    <div className="sge-visualizations-grid">
      <ChartCard title="DAU vs MAU" subtitle="User engagement activity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="dau" stroke="#F59E0B" strokeWidth={2} name="DAU" />
            <Line type="monotone" dataKey="mau" stroke="#2563EB" strokeWidth={2} name="MAU" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Avg Session Duration" subtitle="Time spent per session (minutes)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="avg_session_duration_min" stroke="#10B981" fill="url(#colorSession)" name="Session Duration (min)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Retention & Adoption" subtitle="7-day retention vs Feature adoption">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" unit="%" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="retention_7d" stroke="#6366F1" strokeWidth={2} name="7d Retention (%)" />
            <Line type="monotone" dataKey="feature_adoption_pct" stroke="#EC4899" strokeWidth={2} name="Feature Adoption (%)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default EngagementSection;
