import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

// Deterministic color generator based on string
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const MetricCard = ({ metric, filters }) => {
  const { name, description, data } = metric;
  
  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.segment !== 'all' && item.segment !== filters.segment) return false;
      if (filters.plan !== 'all' && item.plan !== filters.plan) return false;
      if (filters.region !== 'all' && item.region !== filters.region) return false;
      // Date range filtering could be added here
      return true;
    });
  }, [data, filters]);

  // Aggregate data by date (avg value for the date if multiple entries exist)
  const chartData = useMemo(() => {
    const dateMap = {};
    filteredData.forEach(d => {
        if (!dateMap[d.date]) {
            dateMap[d.date] = { date: d.date, total: 0, count: 0, dateObj: d.dateObj };
        }
        dateMap[d.date].total += d.value;
        dateMap[d.date].count += 1;
    });
    
    return Object.values(dateMap)
        .map(d => ({ ...d, value: d.total / d.count }))
        .sort((a, b) => a.dateObj - b.dateObj);
  }, [filteredData]);

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const previousValue = chartData.length > 1 ? chartData[chartData.length - 2].value : latestValue;
  const change = previousValue !== 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  
  const isPositive = change >= 0;
  const color = useMemo(() => stringToColor(name), [name]);

  // Simple formatting
  const formatValue = (val) => {
    if (val === undefined || val === null) return '-';
    // Check if percentage
    if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('percent') || name.toLowerCase().includes('index')) {
        // If value is small (<1), maybe it's 0.xx
        if (val <= 1 && val > -1 && val !== 0) return `${(val * 100).toFixed(1)}%`;
        return `${val.toFixed(1)}%`; // assuming it's already 0-100
    }
    if (val > 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toFixed(2);
  };

  return (
    <div className="metric-card-full" style={{ background: '#fff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb', height: '240px', display: 'flex', flexDirection: 'column' }}>
      <div className="metric-header" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '40px' }} title={name}>
            {name}
            </h4>
            <div className="info-tooltip" title={description} style={{ cursor: 'help', color: '#9CA3AF' }}>
                <Info size={14} />
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                {formatValue(latestValue)}
            </span>
            <span style={{ 
                marginLeft: '8px', 
                fontSize: '12px', 
                fontWeight: 500,
                color: change === 0 ? '#6B7280' : (isPositive ? '#10B981' : '#EF4444'),
                display: 'flex',
                alignItems: 'center'
            }}>
                {change > 0 && <ArrowUpRight size={12} style={{ marginRight: 2 }} />}
                {change < 0 && <ArrowDownRight size={12} style={{ marginRight: 2 }} />}
                {change === 0 && <Minus size={12} style={{ marginRight: 2 }} />}
                {Math.abs(change).toFixed(1)}%
            </span>
        </div>
      </div>
      
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <Tooltip 
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ color: '#6B7280', fontSize: '12px' }}
                itemStyle={{ color: '#111827', fontSize: '12px', fontWeight: 600 }}
                formatter={(value) => [formatValue(value), name]}
            />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={`url(#grad-${name})`} 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricCard;
