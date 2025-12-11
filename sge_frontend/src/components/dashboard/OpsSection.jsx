import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
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

const OpsSection = ({ data }) => {
  if (!data || data.length === 0) return <div>No ops data available</div>;

  return (
    <div className="sge-visualizations-grid">
      <ChartCard title="Incidents & Tickets" subtitle="Operational load">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="incidents" fill="#EF4444" name="Incidents" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ticket_volume" fill="#F59E0B" name="Ticket Volume" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="System Uptime" subtitle="Availability percentage">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" domain={[99, 100]} />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="uptime_pct" stroke="#10B981" strokeWidth={2} name="Uptime (%)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Response Time" subtitle="System latency (ms)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="response_time_ms" stroke="#6366F1" strokeWidth={2} name="Response Time (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

       <ChartCard title="Resolution Time" subtitle="Average time to resolve tickets (hours)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
            <YAxis stroke="#9CA3AF" />
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
             <Bar dataKey="resolution_time_hours" fill="#8B5CF6" name="Resolution Time (hrs)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default OpsSection;
