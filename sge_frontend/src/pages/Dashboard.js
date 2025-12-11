import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, LineChart
} from 'recharts';
import { 
  TrendingUp, DollarSign, Target, 
  Eye, Zap, AlertCircle,
  ArrowUpRight, ArrowDownRight,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import { fetchDashboardMetrics } from '../services/dataService';
import { fetchAllMetrics } from '../services/metricsService';
import EnhancedEngagementSection from '../components/dashboard/EnhancedEngagementSection';
import EnhancedRevenueSection from '../components/dashboard/EnhancedRevenueSection';
import EnhancedOpsSection from '../components/dashboard/EnhancedOpsSection';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import TopFilterBar from '../components/dashboard/TopFilterBar';

// ============================================
// MOCK DATA & HELPERS
// ============================================

const generateMockData = () => {
  const dataPoints = [];
  const now = new Date();
  
  // Generate daily points for last 90 days to ensure coverage
  for (let i = 90; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Base values + trend + noise
    const trend = i / 90; // 0 to 1
    
    dataPoints.push({
      date: dateStr,
      // Revenue: Start 22k, End 25k (Target slightly ahead)
      mrr: Math.floor(22000 + (3000 * trend) + (Math.random() * 200)),
      target: Math.floor(22500 + (3000 * trend)), 
      // Growth: Start 1100, End 1300
      active_users: Math.floor(1100 + (200 * trend) + (Math.random() * 10)),
      new_signups: Math.floor(80 + (20 * trend) + (Math.random() * 10)),
      // Engagement: Start 6.5, End 7.8
      avg_session_duration_min: Number((6.5 + (1.3 * trend) + (Math.random() * 0.5)).toFixed(1))
    });
  }

  return {
    growth: dataPoints.map(d => ({ date: d.date, active_users: d.active_users, new_signups: d.new_signups })),
    engagement: dataPoints.map(d => ({ date: d.date, avg_session_duration_min: d.avg_session_duration_min })),
    revenue: dataPoints.map(d => ({ date: d.date, mrr: d.mrr, target: d.target, arr: d.mrr * 12 })),
    ops: [],
    segments: []
  };
};

const DEFAULT_METRICS = generateMockData();

// ============================================
// COMPONENTS
// ============================================

const ExecutiveMetricCard = ({ title, value, change, icon: Icon, colorClass }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <div className="metric-icon" style={colorClass ? { color: colorClass } : {}}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <p className="metric-label">{title}</p>
        <h3 className="metric-value">{value}</h3>
        <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data States
  const [growthData, setGrowthData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [opsData, setOpsData] = useState([]);
  const [segmentsData, setSegmentsData] = useState([]);
  
  // CSV Metrics State
  const [csvMetrics, setCsvMetrics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [dateRange, setDateRange] = useState('30d');
  const [dataset, setDataset] = useState('production');
  const [segment, setSegment] = useState('all');
  const [planTier, setPlanTier] = useState('all');
  const [region, setRegion] = useState('all');

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load API mock data
        let metrics;
        try {
           metrics = await fetchDashboardMetrics();
        } catch (err) {
           console.warn("Using default mock data due to fetch error:", err);
           metrics = {}; 
        }

        // Check if fetched data is valid and fresh (has data within last 30 days)
        const isDataFresh = (data) => {
          if (!data || data.length === 0) return false;
          
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          // Check if any data point is recent
          return data.some(item => {
              if (!item.date) return false;
              return new Date(item.date) > thirtyDaysAgo;
          });
        };

        const useDefaults = !metrics.growth || metrics.growth.length === 0 || !isDataFresh(metrics.growth);
        
        if (useDefaults && metrics.growth && metrics.growth.length > 0) {
           console.warn("Fetched metrics are stale or empty. Falling back to generated mock data.");
        }
        
        setGrowthData(useDefaults ? DEFAULT_METRICS.growth : metrics.growth);
        setEngagementData(useDefaults ? DEFAULT_METRICS.engagement : metrics.engagement);
        setRevenueData(useDefaults ? DEFAULT_METRICS.revenue : metrics.revenue);
        setOpsData(useDefaults ? DEFAULT_METRICS.ops : (metrics.ops || [])); 
        setSegmentsData(metrics.segments || []);
        
        // Load CSV Metrics
        const allCsv = await fetchAllMetrics();
        setCsvMetrics(allCsv);
        
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        // Do not block dashboard rendering on error if we have defaults, 
        // but here we already handled primary metrics. 
        // If fetchAllMetrics fails, we might still want to show dashboard.
        if (growthData.length === 0) { // If still empty (unlikely with defaults)
             setError("Failed to load dashboard metrics.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter & Process Data Logic
  const filterAndProcessData = (data, range, datasetName) => {
    if (!data) return [];
    
    // 1. Filter by Date
    const now = new Date();
    let cutoff = new Date();
    
    // Assuming data is recent relative to "now".
    if (range === '7d') cutoff.setDate(now.getDate() - 7);
    else if (range === '30d') cutoff.setDate(now.getDate() - 30);
    else if (range === '90d') cutoff.setDate(now.getDate() - 90);
    else if (range === 'ytd') cutoff = new Date(now.getFullYear(), 0, 1); // Jan 1st
    else if (range === '12m') cutoff.setFullYear(now.getFullYear() - 1);
    else cutoff.setDate(now.getDate() - 30); // Default

    let processed = data.filter(item => {
        if (!item.date) return true;
        const itemDate = new Date(item.date);
        return itemDate >= cutoff;
    });

    // 2. Adjust for Dataset (Simulation)
    if (datasetName === 'staging') {
        processed = processed.map(item => {
            const newItem = { ...item };
            Object.keys(newItem).forEach(key => {
                if (typeof newItem[key] === 'number') {
                     newItem[key] = Math.floor(newItem[key] * 0.6); 
                }
            });
            return newItem;
        });
    } else if (datasetName === 'demo') {
        processed = processed.map(item => {
             const newItem = { ...item };
            Object.keys(newItem).forEach(key => {
                if (typeof newItem[key] === 'number') {
                     newItem[key] = Math.floor(newItem[key] * 0.3); 
                }
            });
            return newItem;
        });
    }

    return processed;
  };

  const filteredGrowth = useMemo(() => filterAndProcessData(growthData, dateRange, dataset), [growthData, dateRange, dataset]);
  const filteredEngagement = useMemo(() => filterAndProcessData(engagementData, dateRange, dataset), [engagementData, dateRange, dataset]);
  const filteredRevenue = useMemo(() => filterAndProcessData(revenueData, dateRange, dataset), [revenueData, dateRange, dataset]);
  const filteredOps = useMemo(() => filterAndProcessData(opsData, dateRange, dataset), [opsData, dateRange, dataset]);

  // Filter CSV Metrics
  const filteredCsvMetrics = useMemo(() => {
    let result = csvMetrics;
    
    // Filter by Tab/Category if not Overview or Full Catalog
    if (activeTab !== 'Overview' && activeTab !== 'Full Catalog') {
        result = result.filter(m => {
            const d = (m.domain || '').toLowerCase();
            const tab = activeTab.toLowerCase();
            // Map 'Ops' tab to 'operations' domain if needed, or check logic
            if (tab === 'ops') return d.includes('ops') || d.includes('operations');
            return d.includes(tab);
        });
    }

    // Filter by Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(m => 
            m.name.toLowerCase().includes(q) || 
            (m.description && m.description.toLowerCase().includes(q))
        );
    }

    return result;
  }, [csvMetrics, activeTab, searchQuery]);

  // Executive Metrics derived from latest data points
  const latestRevenue = filteredRevenue.length > 0 ? filteredRevenue[filteredRevenue.length - 1] : {};
  const previousRevenue = filteredRevenue.length > 1 ? filteredRevenue[filteredRevenue.length - 2] : {};
  
  const latestGrowth = filteredGrowth.length > 0 ? filteredGrowth[filteredGrowth.length - 1] : {};
  const previousGrowth = filteredGrowth.length > 1 ? filteredGrowth[filteredGrowth.length - 2] : {};

  const latestEngagement = filteredEngagement.length > 0 ? filteredEngagement[filteredEngagement.length - 1] : {};
  const previousEngagement = filteredEngagement.length > 1 ? filteredEngagement[filteredEngagement.length - 2] : {};

  const calculateChange = (curr, prev) => {
    if (!prev || prev === 0) return 0;
    return ((curr - prev) / prev * 100).toFixed(1);
  };

  const executiveMetrics = [
    { 
      title: 'Total Revenue (MRR)', 
      value: latestRevenue.mrr ? `$${latestRevenue.mrr.toLocaleString()}` : '$0', 
      change: calculateChange(latestRevenue.mrr, previousRevenue.mrr), 
      icon: DollarSign 
    },
    { 
      title: 'Active Users', 
      value: latestGrowth.active_users ? latestGrowth.active_users.toLocaleString() : '0', 
      change: calculateChange(latestGrowth.active_users, previousGrowth.active_users), 
      icon: Users 
    },
    { 
      title: 'Avg Session', 
      value: latestEngagement.avg_session_duration_min ? `${latestEngagement.avg_session_duration_min}m` : '0m', 
      change: calculateChange(latestEngagement.avg_session_duration_min, previousEngagement.avg_session_duration_min), 
      icon: Zap 
    },
    { 
      title: 'New Signups', 
      value: latestGrowth.new_signups ? latestGrowth.new_signups.toLocaleString() : '0', 
      change: calculateChange(latestGrowth.new_signups, previousGrowth.new_signups), 
      icon: TrendingUp 
    },
  ];

  const orgName = user?.user_metadata?.org_name || 'Organization';

  // Render Helpers
  const renderOverview = () => (
    <>
      {/* Executive Metrics */}
      <section>
        <div className="executive-metrics-grid">
          {executiveMetrics.map((metric, idx) => (
            <ExecutiveMetricCard key={idx} {...metric} />
          ))}
        </div>
      </section>

      {/* Main Overview Chart - Growth & Revenue */}
      <section>
        <div className="dashboard-two-column">
          {/* Insights Panel */}
          <div className="insights-panel">
            <div className="insights-header">
              <div className="insights-icon">
                <AlertCircle size={20} />
              </div>
              <h3 className="insights-title">Latest Insights</h3>
            </div>
            <div className="insights-list">
              {[
                { id: 1, text: 'Revenue growth exceeded targets by 12% this quarter', meta: '2 hours ago' },
                { id: 2, text: 'Customer retention improved to 94%, up 3% from last month', meta: '4 hours ago' },
                { id: 3, text: 'New market segment showing 28% conversion rate', meta: '6 hours ago' }
              ].map(insight => (
                <div key={insight.id} className="insight-item">
                  <div className="insight-dot" />
                  <div className="insight-content">
                    <p className="insight-text">{insight.text}</p>
                    <p className="insight-meta">{insight.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Chart (Overview) */}
          <div className="momentum-chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Growth & Revenue</h3>
                <p className="chart-subtitle">Revenue vs Target Performance</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                  <XAxis dataKey="date" stroke="#B0B4B8" fontSize={12} tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
                  <YAxis stroke="#B0B4B8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mrr" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" name="MRR (Actual)" />
                  <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeDasharray="5 5" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Cards */}
      <section>
        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Strategic Framework</h2>
            <p className="dashboard-section-subtitle">Core methodologies driving growth</p>
          </div>
        </div>
        <div className="framework-cards-grid">
          {[
            { title: 'Reveal', desc: 'Uncover hidden opportunities.', icon: Eye, val: '127' },
            { title: 'Reframe', desc: 'Transform challenges into strategies.', icon: Zap, val: '18' },
            { title: 'Realign', desc: 'Align efforts with goals.', icon: Target, val: '24' }
          ].map((card, idx) => (
            <div key={idx} className="framework-card">
              <div className="framework-card-icon"><card.icon size={28} /></div>
              <h3 className="framework-card-title">{card.title}</h3>
              <p className="framework-card-description">{card.desc}</p>
              <div className="framework-card-stat">
                <span className="framework-stat-label">Insights</span>
                <span className="framework-stat-value">{card.val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner">Loading dashboard metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Header & Controls */}
        <section className="dashboard-controls" style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h2 className="dashboard-section-title">Dashboard</h2>
               <p className="dashboard-section-subtitle">
                 Welcome back, {user?.email} &bull; <span style={{ color: '#F59E0B', fontWeight: 600 }}>{orgName}</span>
               </p>
            </div>
          </div>

          <TopFilterBar 
             timeRange={dateRange}
             onTimeRangeChange={setDateRange}
             dataView={activeTab}
             onDataViewChange={setActiveTab}
             dataset={dataset}
             onDatasetChange={setDataset}
          />
          
          {/* Secondary Filters (Segment, Plan, Region) */}
          <div className="filters-bar" style={{ justifyContent: 'center', width: '100%' }}>
            
            {/* Search Box */}
            <input 
                type="text" 
                placeholder="Search metrics..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '14px',
                    minWidth: '200px'
                }}
            />

            <select className="filter-select" value={segment} onChange={e => setSegment(e.target.value)}>
              <option value="all">All Segments</option>
              {segmentsData && [...new Set(segmentsData.map(s => s.segment))].map(seg => (
                 <option key={seg} value={seg}>{seg}</option>
              ))}
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="SMB">SMB</option>
            </select>

            <select className="filter-select" value={planTier} onChange={e => setPlanTier(e.target.value)}>
              <option value="all">All Plans</option>
               {segmentsData && [...new Set(segmentsData.map(s => s.plan))].map(plan => (
                 <option key={plan} value={plan}>{plan}</option>
              ))}
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            
             <select className="filter-select" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">All Regions</option>
              <option value="North America">North America</option>
              <option value="EMEA">EMEA</option>
              <option value="APAC">APAC</option>
            </select>
          </div>
        </section>

        {/* Dynamic Content */}
        {activeTab === 'Overview' && renderOverview()}
        
        {/* Engagement Tab */}
        {activeTab === 'Engagement' && (
             <EnhancedEngagementSection data={filteredEngagement} timeRange={dateRange} dataset={dataset} />
        )}

        {/* Revenue Tab */}
        {activeTab === 'Revenue' && (
             <EnhancedRevenueSection data={filteredRevenue} timeRange={dateRange} dataset={dataset} />
        )}

        {/* Ops Tab */}
        {activeTab === 'Ops' && (
             <EnhancedOpsSection data={filteredOps} timeRange={dateRange} dataset={dataset} />
        )}

        {/* Render Metrics Grid for other tabs */}
        {(activeTab === 'Full Catalog' || activeTab === 'Strategy') && (
            <MetricsGrid metrics={filteredCsvMetrics} filters={{ segment, plan: planTier, region }} />
        )}

      </div>
    </div>
  );
};

export default Dashboard;
