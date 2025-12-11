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
        console.warn(`Error parsing CSV from ${url}:`, error);
        resolve([]); // Resolve with empty array instead of reject to allow partial loading
      }
    });
  });
};

/**
 * Shifts the dates in the dataset so that the last data point aligns with today.
 * Preserves the relative time intervals between data points.
 */
const shiftDatesToNow = (data) => {
  if (!data || data.length === 0) return [];
  
  let maxDate = new Date(0);
  let validItems = [];

  // Find the latest date in the dataset
  data.forEach(item => {
    if (item.date) {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
          if (d > maxDate) maxDate = d;
          validItems.push(item);
      }
    }
  });

  if (validItems.length === 0) return data;

  const today = new Date();
  // Calculate difference in milliseconds
  const diffTime = today.getTime() - maxDate.getTime();

  // If the data is already future or very close (within 24h), no need to shift significantly
  if (Math.abs(diffTime) < 86400000) return validItems;

  return validItems.map(item => {
    const originalDate = new Date(item.date);
    const newDate = new Date(originalDate.getTime() + diffTime);
    return {
      ...item,
      date: newDate.toISOString().split('T')[0]
    };
  });
};

/**
 * Generates synthetic mock data for the dashboard if CSVs are missing or stale.
 */
const generateMockData = () => {
    const days = 90;
    const growth = [];
    const engagement = [];
    const revenue = [];
    const ops = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Linear growth with some randomness
        const factor = 1 + (days - i) * 0.02; 
        
        growth.push({
            date: dateStr,
            new_signups: Math.floor(150 * factor + Math.random() * 50),
            active_users: Math.floor(1200 * factor + Math.random() * 100),
            conversion_rate: 3.5 + Math.random(),
            cac: 200 + Math.random() * 50,
            ltv: 1200 + Math.random() * 100,
            churn_rate: Math.max(0.5, 2.1 - (days - i) * 0.01)
        });

        engagement.push({
            date: dateStr,
            dau: Math.floor(450 * factor + Math.random() * 50),
            mau: Math.floor(1200 * factor + Math.random() * 100),
            avg_session_duration_min: 12 + Math.random() * 3,
            retention_7d: 45 + Math.random() * 5,
            feature_adoption_pct: 25 + Math.random() * 5
        });

        revenue.push({
            date: dateStr,
            mrr: Math.floor(45000 * factor + Math.random() * 5000),
            arr: Math.floor(540000 * factor + Math.random() * 50000),
            arpu: 38 + Math.random() * 2,
            expansion_revenue: 2000 * factor,
            net_revenue_retention: 105 + Math.random() * 5,
            gross_margin: 75 + Math.random() * 5
        });

        ops.push({
            date: dateStr,
            uptime: 99.9,
            incidents: Math.floor(Math.random() * 2),
            tickets: Math.floor(50 * factor),
            response_time: 2 + Math.random(),
            resolution_time: 5 + Math.random() * 2
        });
    }

    return {
        growth,
        engagement,
        revenue,
        ops,
        segments: [
            { segment: 'Enterprise', plan: 'Enterprise', region: 'North America', count: 50 },
            { segment: 'Mid-Market', plan: 'Pro', region: 'Europe', count: 150 },
            { segment: 'SMB', plan: 'Basic', region: 'APAC', count: 500 }
        ]
    };
};

// PUBLIC_INTERFACE
export const fetchDashboardMetrics = async () => {
  /**
   * Fetches all dashboard metrics from CSV files.
   * Automatically shifts dates to present if data is stale.
   * Falls back to generated mock data if CSVs fail or are empty.
   */
  try {
    const [growth, engagement, revenue, ops, segments] = await Promise.all([
      fetchCsvData('/assets/data/growth_over_time.csv').catch(() => null),
      fetchCsvData('/assets/data/engagement_over_time.csv').catch(() => null),
      fetchCsvData('/assets/data/revenue_over_time.csv').catch(() => null),
      fetchCsvData('/assets/data/ops_over_time.csv').catch(() => null),
      fetchCsvData('/assets/data/segments.csv').catch(() => null)
    ]);

    // Check if we have valid primary data (growth and revenue are critical for Overview)
    if (!growth || growth.length === 0 || !revenue || revenue.length === 0) {
        console.warn("CSV data incomplete or missing, using generated mock data.");
        return generateMockData();
    }

    return {
      growth: shiftDatesToNow(growth),
      engagement: shiftDatesToNow(engagement),
      revenue: shiftDatesToNow(revenue),
      ops: shiftDatesToNow(ops),
      segments: segments || []
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics, using fallback:", error);
    return generateMockData();
  }
};
