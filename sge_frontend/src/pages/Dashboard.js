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
        const metrics = await fetchDashboardMetrics();
        setGrowthData(metrics.growth || []);
        setEngagementData(metrics.engagement || []);
        setRevenueData(metrics.revenue || []);
        setOpsData(metrics.ops || []);
        setSegmentsData(metrics.segments || []);
        
        // Load CSV Metrics
        const allCsv = await fetchAllMetrics();
        setCsvMetrics(allCsv);
        
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard metrics. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Logic (Simple client-side filtering example)
  const filterDataByDate = (data) => {
    if (!data) return [];
    // Simplistic filter: assuming mock data is recent. 
    // In a real scenario, compare row.date with threshold.
    return data; 
  };

  const filteredGrowth = useMemo(() => filterDataByDate(growthData), [growthData, dateRange]);
  const filteredEngagement = useMemo(() => filterDataByDate(engagementData), [engagementData, dateRange]);
  const filteredRevenue = useMemo(() => filterDataByDate(revenueData), [revenueData, dateRange]);
  const filteredOps = useMemo(() => filterDataByDate(opsData), [opsData, dateRange]);

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
                      <stop offset="5%" stopColor="#E3B76A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E3B76A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4D6D9" />
                  <XAxis dataKey="date" stroke="#B0B4B8" fontSize={12} tickFormatter={(str) => str.substring(5, 7) + '/' + str.substring(2, 4)} />
                  <YAxis stroke="#B0B4B8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mrr" stroke="#E3B76A" fillOpacity={1} fill="url(#colorRev)" name="MRR" />
                  <Line type="monotone" dataKey="arr" stroke="#2563EB" strokeDasharray="5 5" name="ARR (Scaled)" />
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
                 Welcome back, {user?.email} &bull; <span style={{ color: '#E3B76A' }}>{orgName}</span>
               </p>
            </div>
          </div>

          <TopFilterBar 
             timeRange={dateRange}
             onTimeRangeChange={setDateRange}
             dataView={activeTab}
             onDataViewChange={setActiveTab}
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
             <EnhancedEngagementSection data={filteredEngagement} timeRange={dateRange} />
        )}

        {/* Revenue Tab */}
        {activeTab === 'Revenue' && (
             <EnhancedRevenueSection data={filteredRevenue} timeRange={dateRange} />
        )}

        {/* Ops Tab */}
        {activeTab === 'Ops' && (
             <EnhancedOpsSection data={filteredOps} timeRange={dateRange} />
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
