import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';

const MetricsGrid = ({ metrics, filters }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, metrics]);

  if (!metrics || metrics.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
        No metrics found matching your criteria.
      </div>
    );
  }

  const displayedMetrics = metrics.slice(0, page * itemsPerPage);
  const hasMore = displayedMetrics.length < metrics.length;

  return (
    <div className="metrics-section">
      <div className="metrics-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
      }}>
        {displayedMetrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} filters={filters} />
        ))}
      </div>
      
      {hasMore && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button 
            onClick={() => setPage(p => p + 1)}
            style={{
                padding: '10px 24px',
                background: '#fff',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.borderColor = '#9CA3AF'}
            onMouseOut={e => e.target.style.borderColor = '#D1D5DB'}
          >
            Load More Metrics ({metrics.length - displayedMetrics.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricsGrid;
