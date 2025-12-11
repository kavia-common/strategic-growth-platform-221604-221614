import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
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

const EnhancedRevenueSection = ({ data, timeRange }) => {
  const sampleData = data && data.length > 0 ? data : generateSampleRevenueData(timeRange);
  
  // Plan mix for pie chart
  const planMix = [
    { name: 'Enterprise', value: 125000, color: COLORS.primary },
    { name: 'Professional', value: 85000, color: COLORS.secondary },
    { name: 'Starter', value: 45000, color: COLORS.success },
    { name: 'Free Trial', value: 5000, color: COLORS.purple }
  ];

  // Revenue by category for stacked bar
  const revenueCategories = [
    { category: 'Subscriptions', new: 45000, renewal: 125000, expansion: 28000 },
    { category: 'Add-ons', new: 12000, renewal: 8000, expansion: 15000 },
    { category: 'Services', new: 18000, renewal: 22000, expansion: 8000 },
    { category: 'One-time', new: 8000, renewal: 0, expansion: 0 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      {/* MRR & ARR Growth Trend */}
      <ChartCard title="MRR & ARR Growth" subtitle="Monthly and annual recurring revenue">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="mrr" stroke={COLORS.primary} fill="url(#colorMRR)" strokeWidth={2} name="MRR ($)" />
            <Line type="monotone" dataKey="arr" stroke={COLORS.secondary} strokeWidth={3} strokeDasharray="5 5" name="ARR ($)" dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Plan Mix - Donut Chart */}
      <ChartCard title="Revenue by Plan Tier" subtitle="Distribution across pricing tiers">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={planMix}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: $${(value/1000).toFixed(0)}K`}
              labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
            >
              {planMix.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue Categories - Stacked Bar */}
      <ChartCard title="Revenue by Category" subtitle="New, renewal, and expansion breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueCategories} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="new" stackId="a" fill={COLORS.success} radius={[0, 0, 0, 0]} name="New ($)" />
            <Bar dataKey="renewal" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} name="Renewal ($)" />
            <Bar dataKey="expansion" stackId="a" fill={COLORS.secondary} radius={[8, 8, 0, 0]} name="Expansion ($)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ARPU & Customer LTV */}
      <ChartCard title="ARPU & Customer Metrics" subtitle="Average revenue per user and lifetime value">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="arpu" stroke={COLORS.purple} strokeWidth={3} name="ARPU ($)" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ltv" stroke={COLORS.pink} strokeWidth={3} name="LTV ($)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Net Revenue Retention */}
      <ChartCard title="Net Revenue Retention & Churn" subtitle="Revenue retention and churn rates">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="nrr" stroke={COLORS.success} fill="url(#colorNRR)" strokeWidth={2} name="NRR (%)" />
            <Line type="monotone" dataKey="churn" stroke={COLORS.error} strokeWidth={2} name="Churn Rate (%)" dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gross Margin Trend */}
      <ChartCard title="Gross Margin" subtitle="Profitability over time">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke="#9CA3AF" fontSize={12} unit="%" domain={[60, 90]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gross_margin" fill={COLORS.teal} radius={[8, 8, 0, 0]} name="Gross Margin (%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

function generateSampleRevenueData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().substring(5, 10);
    
    data.push({
      date: dateStr,
      mrr: Math.floor(180000 + Math.random() * 30000 + i * 500),
      arr: Math.floor(2160000 + Math.random() * 360000 + i * 6000),
      arpu: Math.floor(85 + Math.random() * 25),
      ltv: Math.floor(2200 + Math.random() * 400),
      nrr: Math.floor(108 + Math.random() * 12),
      churn: Math.floor(3 + Math.random() * 2),
      gross_margin: Math.floor(72 + Math.random() * 8)
    });
  }
  
  return data;
}

export default EnhancedRevenueSection;
