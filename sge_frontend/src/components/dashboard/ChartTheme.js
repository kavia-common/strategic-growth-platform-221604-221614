import React from 'react';

// Ocean Professional Palette
export const CHART_COLORS = {
  primary: '#2563EB',   // Ocean Blue
  secondary: '#F59E0B', // Amber
  success: '#10B981',   // Emerald
  warning: '#F59E0B',   // Amber
  error: '#EF4444',     // Red
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  indigo: '#6366F1',
  gray: '#9CA3AF',
  grid: '#E5E7EB',
  text: '#374151',
  surface: '#ffffff'
};

// Shared Tooltip Component
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      backgroundColor: CHART_COLORS.surface,
      padding: '12px',
      borderRadius: '8px',
      border: `1px solid ${CHART_COLORS.grid}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827' }}>{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
          <span style={{ fontSize: '14px', color: CHART_COLORS.text }}>
            {entry.name}: <strong>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export const getHeatmapColor = (intensity) => {
    const colors = [
      '#EFF6FF', // Very light blue
      '#BFDBFE', // Light blue
      '#60A5FA', // Medium blue
      '#3B82F6', // Blue
      '#2563EB'  // Dark blue (primary)
    ];
    // intensity is 0 to 1
    const index = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
    return colors[index];
  };
