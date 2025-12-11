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

const RevenueSection = ({ data }) => {
  if (!data || data.length === 0) return <div>No revenue data available</div>;

  return (
    <div className="sge-visualizations-grid">
      <ChartCard title="MRR & Expansion" subtitle="Monthly Recurring Revenue breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="mrr" stackId="1" stroke="#2563EB" fill="#2563EB" name="MRR" />
            <Area type="monotone" dataKey="expansion_revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Expansion" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ARR Growth" subtitle="Annualized Recurring Revenue">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="arr" stroke="#10B981" strokeWidth={2} name="ARR" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ARPU" subtitle="Average Revenue Per User">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
             <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="arpu" fill="#F59E0B" name="ARPU ($)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

       <ChartCard title="Margins & Retention" subtitle="Net Revenue Retention & Gross Margin">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" unit="%" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="net_revenue_retention" stroke="#8B5CF6" strokeWidth={2} name="NRR (%)" />
            <Line type="monotone" dataKey="gross_margin" stroke="#EC4899" strokeWidth={2} name="Gross Margin (%)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default RevenueSection;
