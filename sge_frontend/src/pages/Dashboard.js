import React, { useState, useEffect, useMemo } from 'react';
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
import TopFilterBar from '../components/dashboard/TopFilterBar';
import EnhancedEngagementSection from '../components/dashboard/EnhancedEngagementSection';
import EnhancedRevenueSection from '../components/dashboard/EnhancedRevenueSection';
import EnhancedOpsSection from '../components/dashboard/EnhancedOpsSection';
import MetricsGrid from '../components/dashboard/MetricsGrid';

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

  // Filter states for new TopFilterBar
  const [timeRange, setTimeRange] = useState('30d');
  const [dataView, setDataView] = useState('overview');

  // Legacy filters (kept for MetricsGrid compatibility)
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
    // Simplistic filter: assuming mock data is recent
    return data; 
  };

  const filteredGrowth = useMemo(() => filterDataByDate(growthData), [growthData, timeRange]);
  const filteredEngagement = useMemo(() => filterDataByDate(engagementData), [engagementData, timeRange]);
  const filteredRevenue = useMemo(() => filterDataByDate(revenueData), [revenueData, timeRange]);
  const filteredOps = useMemo(() => filterDataByDate(opsData), [opsData, timeRange]);

  // Filter CSV Metrics
  const filteredCsvMetrics = useMemo(() => {
    let result = csvMetrics;
    
    // Filter by dataView if using metrics grid
    if (dataView !== 'overview') {
      result = result.filter(m => {
        const d = (m.domain || '').toLowerCase();
        const view = dataView.toLowerCase();
        return d.includes(view);
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
  }, [csvMetrics, dataView, searchQuery]);

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
      value: latestRevenue.mrr ? `$${latestRevenue.mrr.toLocaleString()}` : '$185K', 
      change: calculateChange(latestRevenue.mrr, previousRevenue.mrr) || 12.4, 
      icon: DollarSign,
      colorClass: '#2563EB'
    },
    { 
      title: 'Active Users', 
      value: latestGrowth.active_users ? latestGrowth.active_users.toLocaleString() : '9,847', 
      change: calculateChange(latestGrowth.active_users, previousGrowth.active_users) || 8.3, 
      icon: Users,
      colorClass: '#F59E0B'
    },
    { 
      title: 'Avg Session', 
      value: latestEngagement.avg_session_duration_min ? `${latestEngagement.avg_session_duration_min}m` : '22m', 
      change: calculateChange(latestEngagement.avg_session_duration_min, previousEngagement.avg_session_duration_min) || 5.7, 
      icon: Zap,
      colorClass: '#10B981'
    },
    { 
      title: 'System Uptime', 
      value: '99.8%', 
      change: 0.3, 
      icon: Target,
      colorClass: '#8B5CF6'
    },
  ];

  const orgName = user?.user_metadata?.org_name || 'Organization';

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" style={{ fontSize: '18px', color: '#2563EB', fontWeight: 600 }}>
          Loading dashboard metrics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="error-message" style={{ fontSize: '16px', color: '#EF4444', padding: '20px', backgroundColor: '#FEE2E2', borderRadius: '12px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Enhanced Header */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              color: '#111827',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #2563EB 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Strategic Growth Dashboard
            </h1>
            <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
              Welcome back, <strong>{user?.email}</strong> • <span style={{ color: '#F59E0B', fontWeight: 600 }}>{orgName}</span>
            </p>
          </div>
        </section>

        {/* Top Filter Bar - Centered */}
        <TopFilterBar 
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          dataView={dataView}
          onDataViewChange={setDataView}
        />

        {/* Executive Metrics */}
        <section style={{ marginBottom: '32px' }}>
          <div className="executive-metrics-grid">
            {executiveMetrics.map((metric, idx) => (
              <ExecutiveMetricCard key={idx} {...metric} />
            ))}
          </div>
        </section>

        {/* Dynamic Content Based on Data View */}
        {dataView === 'overview' && (
          <>
            {/* Insights & Quick Overview */}
            <section style={{ marginBottom: '32px' }}>
              <div className="insights-panel" style={{ maxHeight: 'none', marginBottom: '24px' }}>
                <div className="insights-header">
                  <div className="insights-icon">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="insights-title">Key Insights</h3>
                </div>
                <div className="insights-list">
                  {[
                    { id: 1, text: 'Revenue growth exceeded targets by 12% this quarter with strong enterprise adoption', meta: '2 hours ago' },
                    { id: 2, text: 'User engagement up 24% - new onboarding flow driving retention improvements', meta: '4 hours ago' },
                    { id: 3, text: 'System uptime maintained at 99.8% with zero critical incidents this week', meta: '6 hours ago' },
                    { id: 4, text: 'Professional tier showing 38% conversion rate from trials', meta: '8 hours ago' }
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
            </section>

            {/* Preview of all sections */}
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                Engagement Overview
              </h2>
              <EnhancedEngagementSection data={filteredEngagement} timeRange={timeRange} />
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                Revenue Overview
              </h2>
              <EnhancedRevenueSection data={filteredRevenue} timeRange={timeRange} />
            </section>

            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
                Operations Overview
              </h2>
              <EnhancedOpsSection data={filteredOps} timeRange={timeRange} />
            </section>
          </>
        )}

        {dataView === 'engagement' && (
          <section>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              User Engagement Analytics
            </h2>
            <EnhancedEngagementSection data={filteredEngagement} timeRange={timeRange} />
          </section>
        )}

        {dataView === 'revenue' && (
          <section>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              Revenue & Financial Metrics
            </h2>
            <EnhancedRevenueSection data={filteredRevenue} timeRange={timeRange} />
          </section>
        )}

        {dataView === 'operations' && (
          <section>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
              Operational Performance
            </h2>
            <EnhancedOpsSection data={filteredOps} timeRange={timeRange} />
          </section>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
