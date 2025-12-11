# Dashboard Data & Metrics Guide

## Overview
The SGE Dashboard is designed to be data-driven. While some high-level executive metrics are hardcoded or come from specific API endpoints, the bulk of the metrics catalog (~150 metrics) is loaded dynamically from CSV files located in `public/data/`.

## Data Sources
The dashboard loads data from the following CSV files in `public/data`:
- `growth_metrics.csv`
- `ops_metrics.csv`
- `strategy_metrics.csv`
- `other_metrics.csv`
- *(Add more files as needed and update `src/services/metricsService.js`)*

## CSV Format
Each CSV file should follow this standard schema:

| Column | Description | Example |
|--------|-------------|---------|
| `date` | YYYY-MM-DD format date | `2025-11-01` |
| `metric_name` | Unique name of the metric | `Customer Acquisition Cost` |
| `value` | Numeric value (can be float) | `125.50` |
| `segment` | Customer segment | `Enterprise` |
| `plan` | Pricing plan | `Pro` |
| `region` | Geographic region | `North America` |
| `domain` | Metric domain/category | `Growth` |
| `description` | Brief description for tooltip | `Cost to acquire a customer` |

## Adding New Metrics
1. **Open the appropriate CSV file** (e.g., `growth_metrics.csv` for growth-related metrics).
2. **Add rows** for your new metric. Ensure you provide data points for different dates if you want to see a trend line.
3. **Save the file**.
4. **Refresh the dashboard**. The new metric will automatically appear in the "Full Catalog" and the relevant category tab (if the domain matches).

## Extending the Schema
If you need to add new filterable dimensions (e.g., "Industry"):
1. Add the column to the CSV.
2. Update `src/services/metricsService.js` to parse the new column.
3. Update `src/components/dashboard/MetricsGrid.jsx` or `MetricCard.jsx` to filter/display based on this new dimension.
4. Add a dropdown to the `Dashboard.js` filter bar.

## Performance Note
The dashboard loads all CSVs on startup. For ~150 metrics with ~12 months of data each, this is efficient (approx. <1MB total). If the dataset grows to thousands of metrics, consider moving to a server-side database or using a more robust data pipeline (e.g., Supabase).
