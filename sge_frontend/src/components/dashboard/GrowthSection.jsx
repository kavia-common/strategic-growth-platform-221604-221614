import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend
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

const GrowthSection = ({ data }) => {
  if (!data || data.length === 0) return <div>No growth data available</div>;

  return (
    <div className="sge-visualizations-grid">
      <ChartCard title="New Signups & Active Users" subtitle="Growth momentum over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="new_signups" stroke="#2563EB" fillOpacity={1} fill="url(#colorSignups)" name="New Signups" />
            <Area type="monotone" dataKey="active_users" stroke="#F59E0B" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Conversion & Churn Rates" subtitle="Efficiency and retention metrics">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" unit="%" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="conversion_rate" stroke="#10B981" strokeWidth={2} name="Conversion Rate (%)" />
            <Line type="monotone" dataKey="churn_rate" stroke="#EF4444" strokeWidth={2} name="Churn Rate (%)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CAC vs LTV" subtitle="Unit economics">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="cac" fill="#EF4444" name="CAC ($)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ltv" fill="#10B981" name="LTV ($)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default GrowthSection;
