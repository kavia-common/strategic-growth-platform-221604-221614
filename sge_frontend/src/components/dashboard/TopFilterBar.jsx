import React from 'react';
import '../../styles/TopFilterBar.css';

/**
 * TopFilterBar Component
 * Centered horizontal filter bar for switching data views, datasets, and time ranges.
 * Styled using Foundatia brand tokens.
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

  return (
    <div className="top-filter-bar">
      
      {/* Data View Selector (Primary Navigation) */}
      <div className="filter-section">
        <label className="filter-label">View</label>
        <div className="filter-group">
          {dataViewOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onDataViewChange(option.value)}
              className={`filter-button ${dataView === option.value ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="filter-divider" />

      {/* Dataset Selector */}
      <div className="filter-section">
        <label className="filter-label">Dataset</label>
        <div className="filter-group">
          {datasetOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onDatasetChange && onDatasetChange(option.value)}
              className={`filter-button ${dataset === option.value ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="filter-divider" />

      {/* Time Range Selector */}
      <div className="filter-section">
        <label className="filter-label">Time Range</label>
        <div className="filter-group">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              className={`filter-button ${timeRange === option.value ? 'active' : ''}`}
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
