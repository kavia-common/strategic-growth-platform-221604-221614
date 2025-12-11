import React from 'react';

/**
 * TopFilterBar Component
 * Centered horizontal filter bar for switching data views, datasets, and time ranges.
 * Styled according to Ocean Professional theme.
 */
const TopFilterBar = ({ 
  timeRange, 
  onTimeRangeChange, 
  dataView, 
  onDataViewChange,
  dataset,
  onDatasetChange 
}) => {
  const timeRangeOptions = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '1Y' }
  ];

  const dataViewOptions = [
    { value: 'Overview', label: 'Overview' },
    { value: 'Engagement', label: 'Engagement' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Ops', label: 'Operations' },
    { value: 'Strategy', label: 'Strategy' },
    { value: 'Full Catalog', label: 'Catalog' }
  ];

  const datasetOptions = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'demo', label: 'Demo Data' }
  ];

  // Helper for button styles
  const getButtonStyle = (isActive, activeColor) => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? activeColor : 'transparent',
    color: isActive ? '#ffffff' : '#6B7280',
    boxShadow: isActive ? `0 2px 4px ${activeColor}33` : 'none',
    whiteSpace: 'nowrap'
  });

  const labelStyle = {
    fontSize: '12px', 
    fontWeight: 600, 
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const groupContainerStyle = {
    display: 'flex',
    backgroundColor: '#F3F4F6',
    borderRadius: '10px',
    padding: '4px',
    gap: '4px'
  };

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
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      flexWrap: 'wrap'
    }}>
      
      {/* Data View Selector (Primary Navigation) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={labelStyle}>View</label>
        <div style={groupContainerStyle}>
          {dataViewOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onDataViewChange(option.value)}
              style={getButtonStyle(dataView === option.value, '#2563EB')} // Ocean Primary
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '48px', backgroundColor: '#E5E7EB', display: 'none', '@media (min-width: 768px)': { display: 'block' } }} />

      {/* Dataset Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={labelStyle}>Dataset</label>
        <div style={groupContainerStyle}>
          {datasetOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onDatasetChange && onDatasetChange(option.value)}
              style={getButtonStyle(dataset === option.value, '#F59E0B')} // Ocean Secondary
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div style={{ width: '1px', height: '48px', backgroundColor: '#E5E7EB', display: 'none', '@media (min-width: 768px)': { display: 'block' } }} />

      {/* Time Range Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <label style={labelStyle}>Time Range</label>
        <div style={groupContainerStyle}>
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              style={getButtonStyle(timeRange === option.value, '#2563EB')} // Ocean Primary (Consistent with View)
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
