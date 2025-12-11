# Dashboard Data Documentation

This document describes the data sources and structure for the SGE Dashboard.

## Data Sources

The dashboard pulls data from CSV files located in `public/assets/data/`.
This allows for easy updates and integration with external data pipelines without requiring backend changes for the prototype.

### File Locations

- **Growth Metrics**: `public/assets/data/growth_over_time.csv`
- **Engagement Metrics**: `public/assets/data/engagement_over_time.csv`
- **Revenue Metrics**: `public/assets/data/revenue_over_time.csv`
- **Ops Metrics**: `public/assets/data/ops_over_time.csv`
- **Segments/Filters**: `public/assets/data/segments.csv`

## Schemas

### Growth
- `date` (YYYY-MM-DD)
- `new_signups` (integer)
- `active_users` (integer)
- `conversion_rate` (float, percentage)
- `cac` (float, currency)
- `ltv` (float, currency)
- `churn_rate` (float, percentage)

### Engagement
- `date` (YYYY-MM-DD)
- `dau` (integer)
- `mau` (integer)
- `avg_session_duration_min` (float)
- `retention_7d` (float, percentage)
- `feature_adoption_pct` (float, percentage)

### Revenue
- `date` (YYYY-MM-DD)
- `mrr` (float, currency)
- `arr` (float, currency)
- `arpu` (float, currency)
- `expansion_revenue` (float, currency)
- `net_revenue_retention` (float, percentage)
- `gross_margin` (float, percentage)

### Ops
- `date` (YYYY-MM-DD)
- `incidents` (integer)
- `response_time_ms` (integer)
- `uptime_pct` (float, percentage)
- `ticket_volume` (integer)
- `resolution_time_hours` (float)

## How to Update

1.  Replace the CSV files in `public/assets/data/` with new data.
2.  Ensure the header row matches the schemas above exactly.
3.  The dashboard will automatically fetch and display the new data on refresh.

## Extending Charts

To add new charts:
1.  Add columns to the relevant CSV or create a new CSV.
2.  Update `src/services/dataService.js` to fetch the new file if created.
3.  Update or create a new section component in `src/components/dashboard/`.
4.  Add the new component to `src/pages/Dashboard.js`.
