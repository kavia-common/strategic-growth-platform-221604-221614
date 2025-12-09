# Dashboard Testing Guide

## How to Access the Dashboard

1. **Start the application** (if not already running):
   ```bash
   npm start
   ```

2. **Navigate to the application**:
   - URL: http://localhost:3000
   - Login with your Supabase credentials
   - Click on "Dashboard" in the sidebar

## What to Verify

### Page Header
✓ Title: "Analytics Dashboard"
✓ Subtitle: "Comprehensive insights into your organization's performance"
✓ Timestamp: "Updated 5 min ago" (top right)

### Filters Bar
✓ Three filter dropdowns visible:
  - Date Range (default: Last 12 Months)
  - Segment (default: All Segments)
  - Plan (default: All Plans)
✓ Filter icon on the left

### KPI Cards Row (8 Cards)
✓ Cards arranged in responsive grid (4 columns on desktop)
✓ Each card shows:
  - Metric name
  - Large value
  - Subtitle description
  - Trend indicator with percentage
  - Colored icon on the right

Expected KPIs:
1. MRR: $45,231
2. ARR: $542,772
3. Active Users: 2,847
4. DAU/MAU: 42.5%
5. Conversion: 18.6%
6. Churn: 3.2%
7. NPS: 58
8. LTV/CAC: 4.2x

### Activity Heatmap
✓ GitHub-style grid with blue cells
✓ Grid shows ~52 weeks × 7 days
✓ Color legend at bottom (Less → More)
✓ Hover over cells shows tooltip with date and count

### MRR Growth & Trend Chart
✓ Area chart with blue gradient fill
✓ Dashed amber line for 3-month moving average
✓ X-axis shows months (Jan-Dec)
✓ Hover shows tooltip with values

### User Growth & Trend Chart
✓ Line chart with green line
✓ Dashed amber line for moving average
✓ Interactive tooltips

### Feature Usage by Segment
✓ Horizontal stacked bars
✓ Four segments listed (Enterprise, Mid-Market, SMB, Startup)
✓ Four colored sections per bar (Analytics, AI Chat, Reports, Workflows)
✓ Legend at top

### Plan Distribution (Donut Chart)
✓ Donut chart with 4 colored segments
✓ Labels showing plan name and percentage
✓ Center shows "100%" and "Total Accounts"

### Top Accounts by Engagement
✓ Horizontal blue bars
✓ 6 accounts listed
✓ Account names on Y-axis, engagement % on X-axis
✓ Bars extend from left (0%) to right (100%)

### Cohort Retention Analysis
✓ Stacked area chart with 4 colored layers
✓ X-axis shows weeks (Week 1-6)
✓ Y-axis shows percentage (0-100%)
✓ Legend shows cohort names (Jan-Apr)

## Responsive Testing

### Desktop (1280px+)
- KPI cards: 4 columns
- Charts: 2 columns side by side
- All content fits without horizontal scroll

### Tablet (768px - 1024px)
- KPI cards: 2 columns
- Charts: 1 column (full width)

### Mobile (< 768px)
- KPI cards: 1 column (stacked)
- Charts: 1 column (full width)
- Filters may wrap to multiple rows

## Interactive Elements

### Hover Effects
✓ KPI cards show shadow on hover
✓ Chart tooltips appear on hover
✓ Heatmap cells show date/count on hover

### Filter Functionality
✓ Clicking dropdowns opens options
✓ Selecting options updates the selected value
✓ Note: Data reshaping not implemented (uses same mock data)

## Performance

✓ Page loads quickly
✓ No console errors
✓ Charts render smoothly
✓ Scrolling is smooth

## Known Limitations

- All data is mock/static
- Filters don't actually reshape data (UI only)
- Moving averages calculated client-side
- No real-time updates
- No data export functionality

## Next Steps for Production

1. Connect to real backend APIs
2. Implement filter logic to query different data sets
3. Add loading states
4. Add error handling
5. Implement data refresh intervals
6. Add export functionality (CSV, PDF)
7. Add date range picker (calendar UI)
8. Add drill-down capabilities (click to see details)
