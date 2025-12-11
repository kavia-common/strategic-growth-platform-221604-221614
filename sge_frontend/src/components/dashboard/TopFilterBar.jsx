import React from 'react';

/**
 * TopFilterBar Component
 * Centered horizontal filter bar for switching time ranges and data views
 * Styled according to Ocean Professional theme
 */
const TopFilterBar = ({ timeRange, onTimeRangeChange, dataView, onDataViewChange }) => {
  const timeRangeOptions = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '1Y' }
  ];

  const dataViewOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'operations', label: 'Operations' }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '32px',
      padding: '24px',
      marginBottom: '32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Time Range Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Time Range
        </label>
        <div style={{
          display: 'flex',
          backgroundColor: '#F3F4F6',
          borderRadius: '10px',
          padding: '4px',
          gap: '4px'
        }}>
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: timeRange === option.value ? '#2563EB' : 'transparent',
                color: timeRange === option.value ? '#ffffff' : '#6B7280',
                boxShadow: timeRange === option.value ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div style={{
        width: '1px',
        height: '48px',
        backgroundColor: '#E5E7EB'
      }} />

      {/* Data View Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Data View
        </label>
        <div style={{
          display: 'flex',
          backgroundColor: '#F3F4F6',
          borderRadius: '10px',
          padding: '4px',
          gap: '4px'
        }}>
          {dataViewOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onDataViewChange(option.value)}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: dataView === option.value ? '#F59E0B' : 'transparent',
                color: dataView === option.value ? '#ffffff' : '#6B7280',
                boxShadow: dataView === option.value ? '0 2px 4px rgba(245, 158, 11, 0.2)' : 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar;
