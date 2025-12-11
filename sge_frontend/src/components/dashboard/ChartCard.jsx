import React from 'react';

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="visualization-card" style={{ 
      backgroundColor: '#ffffff', 
      borderRadius: '12px', 
      padding: '24px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #E5E7EB',
      height: '100%',
      minHeight: '350px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="chart-header" style={{ marginBottom: '20px' }}>
        <h3 className="chart-title" style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          color: '#111827',
          margin: 0
        }}>{title}</h3>
        {subtitle && (
          <p className="chart-subtitle" style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            marginTop: '4px',
            margin: 0
          }}>{subtitle}</p>
        )}
      </div>
      <div className="chart-container" style={{ flex: 1, minHeight: '0' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
