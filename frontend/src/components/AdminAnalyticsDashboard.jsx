import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faChartLine, 
  faUsers, 
  faBriefcase,
  faFileAlt,
  faDollarSign,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import '../styles/AdminAnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const AdminAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    revenueData: [],
    featureUsage: [],
    applicationFunnel: [],
    userDistribution: {},
    monthlyStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/analytics/export?format=${format}&range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${dateRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const userGrowthChartData = {
    labels: analyticsData.userGrowth.map(item => item.date),
    datasets: [
      {
        label: 'Total Users',
        data: analyticsData.userGrowth.map(item => item.totalUsers),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Active Users',
        data: analyticsData.userGrowth.map(item => item.activeUsers),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const revenueChartData = {
    labels: analyticsData.revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData.revenueData.map(item => item.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }
    ]
  };

  const featureUsageData = {
    labels: analyticsData.featureUsage.map(item => item.feature),
    datasets: [
      {
        label: 'Usage Count',
        data: analyticsData.featureUsage.map(item => item.usageCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  const applicationFunnelData = {
    labels: ['Resume Uploaded', 'Job Applied', 'Shortlisted', 'Interviewed', 'Hired'],
    datasets: [
      {
        label: 'Application Funnel',
        data: analyticsData.applicationFunnel.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  const userDistributionData = {
    labels: ['Job Seekers', 'Recruiters', 'Premium Users', 'Enterprise Users'],
    datasets: [
      {
        data: [
          analyticsData.userDistribution?.jobSeekers || 0,
          analyticsData.userDistribution?.recruiters || 0,
          analyticsData.userDistribution?.premiumUsers || 0,
          analyticsData.userDistribution?.enterpriseUsers || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  if (loading) {
    return <div className="loading">Loading Analytics Dashboard...</div>;
  }

  return (
    <div className="admin-analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics & Reporting Dashboard</h2>
        <p>Comprehensive insights into platform performance and user behavior</p>
        
        <div className="analytics-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <div className="export-buttons">
            <button 
              className="export-btn"
              onClick={() => exportReport('csv')}
              disabled={exporting}
            >
              <FontAwesomeIcon icon={faDownload} />
              Export CSV
            </button>
            
            <button 
              className="export-btn"
              onClick={() => exportReport('pdf')}
              disabled={exporting}
            >
              <FontAwesomeIcon icon={faDownload} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="metric-cards">
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="metric-content">
              <h3>Total Users</h3>
              <p className="metric-value">{analyticsData.monthlyStats?.totalUsers || 0}</p>
              <span className="metric-change positive">+12% from last month</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div className="metric-content">
              <h3>Active Jobs</h3>
              <p className="metric-value">{analyticsData.monthlyStats?.activeJobs || 0}</p>
              <span className="metric-change positive">+8% from last month</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
            <div className="metric-content">
              <h3>Resumes Uploaded</h3>
              <p className="metric-value">{analyticsData.monthlyStats?.resumesUploaded || 0}</p>
              <span className="metric-change positive">+15% from last month</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <div className="metric-content">
              <h3>Monthly Revenue</h3>
              <p className="metric-value">${analyticsData.monthlyStats?.monthlyRevenue || 0}</p>
              <span className="metric-change positive">+22% from last month</span>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>User Growth Trend</h3>
            <Line 
              data={userGrowthChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'User Growth Over Time' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>Monthly Revenue</h3>
            <Bar 
              data={revenueChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Revenue by Month' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>Feature Usage</h3>
            <Doughnut 
              data={featureUsageData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'right' },
                  title: { display: true, text: 'Most Used Features' }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>Application Funnel</h3>
            <Bar 
              data={applicationFunnelData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Application Conversion Funnel' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>User Distribution</h3>
            <Pie 
              data={userDistributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'right' },
                  title: { display: true, text: 'User Type Distribution' }
                }
              }}
            />
          </div>
        </div>

        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>User Engagement</h4>
              <p>Daily active users have increased by 18% this month, with peak activity during business hours.</p>
            </div>
            
            <div className="insight-card">
              <h4>Revenue Growth</h4>
              <p>Premium subscriptions are driving 65% of total revenue, with enterprise plans showing strong growth.</p>
            </div>
            
            <div className="insight-card">
              <h4>Feature Adoption</h4>
              <p>Cultural fit assessment is the most popular premium feature, used by 78% of premium users.</p>
            </div>
            
            <div className="insight-card">
              <h4>Conversion Rate</h4>
              <p>Overall application-to-hire conversion rate is 12%, above industry average of 8%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
