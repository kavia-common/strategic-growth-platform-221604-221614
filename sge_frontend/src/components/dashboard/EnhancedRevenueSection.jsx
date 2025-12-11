import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, CustomTooltip } from './ChartTheme';

const EnhancedRevenueSection = ({ data, timeRange }) => {
  const sampleData = data && data.length > 0 ? data : generateSampleRevenueData(timeRange);
  
  // Plan mix for pie chart
  const planMix = [
    { name: 'Enterprise', value: 125000, color: CHART_COLORS.primary },
    { name: 'Professional', value: 85000, color: CHART_COLORS.secondary },
    { name: 'Starter', value: 45000, color: CHART_COLORS.success },
    { name: 'Free Trial', value: 5000, color: CHART_COLORS.purple }
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
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="mrr" stroke={CHART_COLORS.primary} fill="url(#colorMRR)" strokeWidth={2} name="MRR ($)" />
            <Line type="monotone" dataKey="arr" stroke={CHART_COLORS.secondary} strokeWidth={3} strokeDasharray="5 5" name="ARR ($)" dot={{ r: 4 }} />
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
              labelLine={{ stroke: CHART_COLORS.gray, strokeWidth: 1 }}
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
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="category" stroke={CHART_COLORS.gray} fontSize={12} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="new" stackId="a" fill={CHART_COLORS.success} radius={[0, 0, 0, 0]} name="New ($)" />
            <Bar dataKey="renewal" stackId="a" fill={CHART_COLORS.primary} radius={[0, 0, 0, 0]} name="Renewal ($)" />
            <Bar dataKey="expansion" stackId="a" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} name="Expansion ($)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ARPU & Customer LTV */}
      <ChartCard title="ARPU & Customer Metrics" subtitle="Average revenue per user and lifetime value">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="arpu" stroke={CHART_COLORS.purple} strokeWidth={3} name="ARPU ($)" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ltv" stroke={CHART_COLORS.pink} strokeWidth={3} name="LTV ($)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Net Revenue Retention */}
      <ChartCard title="Net Revenue Retention & Churn" subtitle="Revenue retention and churn rates">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="nrr" stroke={CHART_COLORS.success} fill="url(#colorNRR)" strokeWidth={2} name="NRR (%)" />
            <Line type="monotone" dataKey="churn" stroke={CHART_COLORS.error} strokeWidth={2} name="Churn Rate (%)" dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gross Margin Trend */}
      <ChartCard title="Gross Margin" subtitle="Profitability over time">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.gray} fontSize={12} tickFormatter={(str) => str.substring(5)} />
            <YAxis stroke={CHART_COLORS.gray} fontSize={12} unit="%" domain={[60, 90]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gross_margin" fill={CHART_COLORS.teal} radius={[8, 8, 0, 0]} name="Gross Margin (%)" />
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
