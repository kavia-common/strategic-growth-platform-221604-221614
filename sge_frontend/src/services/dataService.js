import Papa from 'papaparse';

// PUBLIC_INTERFACE
export const fetchCsvData = (url) => {
  /**
   * Fetches and parses a CSV file from a given URL.
   * Returns a promise that resolves with the parsed data.
   */
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      }
    });
  });
};

// PUBLIC_INTERFACE
export const fetchDashboardMetrics = async () => {
  /**
   * Fetches all dashboard metrics from CSV files.
   */
  try {
    const [growth, engagement, revenue, ops, segments] = await Promise.all([
      fetchCsvData('/assets/data/growth_over_time.csv'),
      fetchCsvData('/assets/data/engagement_over_time.csv'),
      fetchCsvData('/assets/data/revenue_over_time.csv'),
      fetchCsvData('/assets/data/ops_over_time.csv'),
      fetchCsvData('/assets/data/segments.csv')
    ]);

    return {
      growth,
      engagement,
      revenue,
      ops,
      segments
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    throw error;
  }
};
