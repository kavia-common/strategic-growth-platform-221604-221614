import Papa from 'papaparse';

const CSV_FILES = [
  { name: 'Growth', file: '/data/growth_metrics.csv' },
  { name: 'Operations', file: '/data/ops_metrics.csv' },
  { name: 'Strategy', file: '/data/strategy_metrics.csv' },
  { name: 'Other', file: '/data/other_metrics.csv' }
];

// PUBLIC_INTERFACE
export const fetchAllMetrics = async () => {
  /**
   * Fetches and parses all metric CSV files.
   * Returns an object grouped by Domain (from CSV) or Category (file source).
   */
  const results = {};

  const promises = CSV_FILES.map(item => {
    return new Promise((resolve) => {
      Papa.parse(item.file, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (parsed) => {
          resolve({ category: item.name, data: parsed.data, error: null });
        },
        error: (err) => {
            console.warn(`Failed to load ${item.file}:`, err);
            resolve({ category: item.name, data: [], error: err });
        }
      });
    });
  });

  const loaded = await Promise.all(promises);

  // Post-process: Group by Metric Name
  // We want a structure:
  // {
  //   [MetricName]: {
  //      info: { domain, description, ... },
  //      data: [ { date, value, segment, plan, region }, ... ]
  //   }
  // }
  
  // Also we want to preserve the source category/domain from the file or row content.
  
  const metricsMap = {};

  loaded.forEach(({ category, data }) => {
    data.forEach(row => {
      const name = row.metric_name;
      if (!name) return;

      if (!metricsMap[name]) {
        metricsMap[name] = {
            id: name,
            name: name,
            domain: row.domain || category,
            description: row.description || '',
            data: []
        };
      }
      
      // Parse value to number
      let val = parseFloat(row.value);
      if (isNaN(val)) val = 0;

      metricsMap[name].data.push({
        ...row,
        value: val,
        dateObj: new Date(row.date) // Pre-parse date for sorting
      });
    });
  });

  // Sort data by date for each metric
  Object.values(metricsMap).forEach(metric => {
    metric.data.sort((a, b) => a.dateObj - b.dateObj);
  });

  return Object.values(metricsMap);
};
