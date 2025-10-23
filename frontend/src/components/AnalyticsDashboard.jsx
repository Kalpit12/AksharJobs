import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import ThemedLoadingSpinner from './ThemedLoadingSpinner';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [jobPerformanceData, setJobPerformanceData] = useState(null);
  const [candidateInsightsData, setCandidateInsightsData] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all analytics data in parallel
      const [analyticsResponse, jobPerformanceResponse, candidateInsightsResponse, fallbackResponse] = await Promise.all([
        fetch(buildApiUrl(`/api/analytics/recruiter/detailed?days=${timeRange}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(buildApiUrl('/api/analytics/recruiter/job-performance'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(buildApiUrl('/api/analytics/recruiter/candidate-insights'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(buildApiUrl(`/api/analytics/recruitment-analytics?days=${timeRange}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (analyticsResponse.ok) {
        const analyticsResult = await analyticsResponse.json();
        console.log('Analytics data:', analyticsResult);
        setAnalyticsData(analyticsResult.data);
      } else if (fallbackResponse.ok) {
        // Fallback to existing recruitment analytics endpoint
        const fallbackResult = await fallbackResponse.json();
        console.log('Fallback analytics data:', fallbackResult);
        if (fallbackResult.data) {
          // Transform fallback data to match expected format
          const transformedData = {
            overview: {
              total_jobs: fallbackResult.data.overview?.total_jobs || 0,
              total_applications: fallbackResult.data.overview?.total_applications || 0,
              total_views: fallbackResult.data.overview?.total_views || 0,
              avg_match_score: fallbackResult.data.candidate_quality?.avg_match_score || 0
            },
            applications_over_time: fallbackResult.data.application_trends?.applications_by_day || {},
            status_distribution: {},
            match_score_distribution: fallbackResult.data.candidate_quality?.match_score_distribution || {},
            top_performing_jobs: []
          };
          setAnalyticsData(transformedData);
        }
      } else {
        console.error('Analytics response error:', analyticsResponse.status);
      }

      if (jobPerformanceResponse.ok) {
        const jobPerformanceResult = await jobPerformanceResponse.json();
        console.log('Job performance data:', jobPerformanceResult);
        setJobPerformanceData(jobPerformanceResult.data);
      } else {
        console.error('Job performance response error:', jobPerformanceResponse.status);
      }

      if (candidateInsightsResponse.ok) {
        const candidateInsightsResult = await candidateInsightsResponse.json();
        console.log('Candidate insights data:', candidateInsightsResult);
        setCandidateInsightsData(candidateInsightsResult.data);
      } else {
        console.error('Candidate insights response error:', candidateInsightsResponse.status);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatPercentage = (num) => {
    return Math.round(num || 0) + '%';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'reviewed': '#3b82f6',
      'shortlisted': '#10b981',
      'interview_scheduled': '#8b5cf6',
      'accepted': '#059669',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const renderOverviewTab = () => {
    if (!analyticsData) {
      return (
        <div className="no-data-state">
          <i className="fas fa-chart-bar"></i>
          <h3>No Analytics Data Available</h3>
          <p>Start by posting jobs and receiving applications to see analytics data here.</p>
        </div>
      );
    }

    const { overview, applications_over_time, status_distribution, match_score_distribution, top_performing_jobs } = analyticsData;

    return (
      <div className="analytics-overview">
        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon jobs">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{formatNumber(overview.total_jobs)}</div>
                <div className="metric-label">Total Jobs</div>
              </div>
            </div>
            <div className="metric-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>Active postings</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon applications">
                <i className="fas fa-users"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{formatNumber(overview.total_applications)}</div>
                <div className="metric-label">Total Applications</div>
              </div>
            </div>
            <div className="metric-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>All time</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon views">
                <i className="fas fa-eye"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{formatNumber(overview.total_views)}</div>
                <div className="metric-label">Total Views</div>
              </div>
            </div>
            <div className="metric-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>Job visibility</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon score">
                <i className="fas fa-star"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{Math.round(overview.avg_match_score || 0)}%</div>
                <div className="metric-label">Avg Match Score</div>
              </div>
            </div>
            <div className="metric-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>Candidate quality</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Applications Over Time Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Applications Over Time</h3>
              <div className="chart-controls">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(parseInt(e.target.value))}
                  className="time-selector"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="chart-content">
              <div className="simple-chart">
                {Object.keys(applications_over_time).length > 0 ? (
                  <div className="applications-timeline">
                    {Object.entries(applications_over_time).slice(-14).map(([date, count]) => (
                      <div key={date} className="timeline-bar">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            height: `${Math.max((count / Math.max(...Object.values(applications_over_time))) * 100, 10)}%`,
                            backgroundColor: '#ff6b35'
                          }}
                        ></div>
                        <div className="bar-label">{count}</div>
                        <div className="bar-date">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <i className="fas fa-chart-line"></i>
                    <p>No applications data for selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Application Status</h3>
            </div>
            <div className="chart-content">
              <div className="status-distribution">
                {Object.entries(status_distribution).map(([status, count]) => (
                  <div key={status} className="status-item">
                    <div className="status-indicator" style={{ backgroundColor: getStatusColor(status) }}></div>
                    <div className="status-info">
                      <span className="status-name">{status.replace('_', ' ')}</span>
                      <span className="status-count">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Match Score Distribution</h3>
          </div>
          <div className="chart-content">
            <div className="score-distribution">
              {Object.entries(match_score_distribution).map(([range, count]) => (
                <div key={range} className="score-range">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${(count / Math.max(...Object.values(match_score_distribution))) * 100}%`,
                        backgroundColor: range === '81-100' ? '#10b981' : 
                                       range === '61-80' ? '#3b82f6' :
                                       range === '41-60' ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="score-info">
                    <span className="score-range-label">{range}</span>
                    <span className="score-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Top Performing Jobs</h3>
          </div>
          <div className="chart-content">
            <div className="jobs-table">
              <div className="table-header">
                <div>Job Title</div>
                <div>Applications</div>
                <div>Views</div>
                <div>Avg Score</div>
                <div>Conversion</div>
              </div>
              {top_performing_jobs.map((job, idx) => (
                <div key={idx} className="table-row">
                  <div className="job-title">{job.job_title}</div>
                  <div className="job-metric">{job.applications}</div>
                  <div className="job-metric">{job.views}</div>
                  <div className="job-metric">{Math.round(job.avg_match_score)}%</div>
                  <div className="job-metric">{formatPercentage(job.conversion_rate)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobPerformanceTab = () => {
    if (!jobPerformanceData) {
      return (
        <div className="no-data-state">
          <i className="fas fa-briefcase"></i>
          <h3>No Job Performance Data Available</h3>
          <p>Post some jobs to see performance analytics here.</p>
        </div>
      );
    }

    const { jobs, summary } = jobPerformanceData;

    return (
      <div className="job-performance">
        {/* Summary Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon jobs">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{summary.total_jobs}</div>
                <div className="metric-label">Total Jobs</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon active">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{summary.active_jobs}</div>
                <div className="metric-label">Active Jobs</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon applications">
                <i className="fas fa-users"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{Math.round(summary.avg_applications_per_job)}</div>
                <div className="metric-label">Avg Applications/Job</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon views">
                <i className="fas fa-eye"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{Math.round(summary.avg_views_per_job)}</div>
                <div className="metric-label">Avg Views/Job</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Performance Table */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>All Jobs Performance</h3>
          </div>
          <div className="chart-content">
            <div className="jobs-performance-table">
              <div className="table-header">
                <div>Job Title</div>
                <div>Location</div>
                <div>Type</div>
                <div>Days Posted</div>
                <div>Views</div>
                <div>Applications</div>
                <div>Avg Score</div>
                <div>High Quality</div>
              </div>
              {jobs.map((job, idx) => (
                <div key={idx} className="table-row">
                  <div className="job-title">{job.job_title}</div>
                  <div className="job-location">{job.location}</div>
                  <div className="job-type">
                    <span className="type-badge">{job.job_type}</span>
                  </div>
                  <div className="job-days">{job.days_posted}</div>
                  <div className="job-metric">{job.views}</div>
                  <div className="job-metric">{job.applications}</div>
                  <div className="job-metric score">{Math.round(job.avg_match_score)}%</div>
                  <div className="job-metric quality">{job.high_quality_applications}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCandidateInsightsTab = () => {
    if (!candidateInsightsData) {
      return (
        <div className="no-data-state">
          <i className="fas fa-users"></i>
          <h3>No Candidate Insights Available</h3>
          <p>Receive some applications to see candidate insights here.</p>
        </div>
      );
    }

    const { 
      total_candidates, 
      match_score_distribution, 
      top_skills, 
      candidate_quality_insights,
      avg_match_score 
    } = candidateInsightsData;

    return (
      <div className="candidate-insights">
        {/* Summary Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon candidates">
                <i className="fas fa-users"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{formatNumber(total_candidates)}</div>
                <div className="metric-label">Total Candidates</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon quality">
                <i className="fas fa-star"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{Math.round(avg_match_score)}%</div>
                <div className="metric-label">Avg Match Score</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon high-quality">
                <i className="fas fa-gem"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{candidate_quality_insights.high_quality_count}</div>
                <div className="metric-label">High Quality</div>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon percentage">
                <i className="fas fa-percentage"></i>
              </div>
              <div className="metric-info">
                <div className="metric-value">{Math.round(candidate_quality_insights.high_quality_percentage)}%</div>
                <div className="metric-label">High Quality Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Quality Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Candidate Quality Distribution</h3>
            </div>
            <div className="chart-content">
              <div className="quality-distribution">
                <div className="quality-item high">
                  <div className="quality-bar">
                    <div 
                      className="quality-fill" 
                      style={{ 
                        width: `${(candidate_quality_insights.high_quality_count / total_candidates) * 100}%`,
                        backgroundColor: '#10b981'
                      }}
                    ></div>
                  </div>
                  <div className="quality-info">
                    <span className="quality-label">High Quality (80%+)</span>
                    <span className="quality-count">{candidate_quality_insights.high_quality_count}</span>
                  </div>
                </div>
                <div className="quality-item medium">
                  <div className="quality-bar">
                    <div 
                      className="quality-fill" 
                      style={{ 
                        width: `${(candidate_quality_insights.medium_quality_count / total_candidates) * 100}%`,
                        backgroundColor: '#f59e0b'
                      }}
                    ></div>
                  </div>
                  <div className="quality-info">
                    <span className="quality-label">Medium Quality (50-79%)</span>
                    <span className="quality-count">{candidate_quality_insights.medium_quality_count}</span>
                  </div>
                </div>
                <div className="quality-item low">
                  <div className="quality-bar">
                    <div 
                      className="quality-fill" 
                      style={{ 
                        width: `${(candidate_quality_insights.low_quality_count / total_candidates) * 100}%`,
                        backgroundColor: '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="quality-info">
                    <span className="quality-label">Low Quality (&lt;50%)</span>
                    <span className="quality-count">{candidate_quality_insights.low_quality_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Top Skills</h3>
            </div>
            <div className="chart-content">
              <div className="skills-list">
                {top_skills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <div className="skill-name">{skill.skill}</div>
                    <div className="skill-count">{skill.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Match Score Distribution</h3>
          </div>
          <div className="chart-content">
            <div className="score-distribution">
              {Object.entries(match_score_distribution).map(([range, count]) => (
                <div key={range} className="score-range">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${(count / Math.max(...Object.values(match_score_distribution))) * 100}%`,
                        backgroundColor: range === '81-100' ? '#10b981' : 
                                       range === '61-80' ? '#3b82f6' :
                                       range === '41-60' ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="score-info">
                    <span className="score-range-label">{range}</span>
                    <span className="score-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ThemedLoadingSpinner 
        theme="recruiter"
        size="large"
        text="Loading analytics dashboard..."
        fullScreen={false}
      />
    );
  }

  return (
    <div className="analytics-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-chart-bar"></i>
            Analytics Dashboard
          </h1>
          <p>Comprehensive insights into your recruitment performance</p>
        </div>
        <div className="header-controls">
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="time-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-line"></i>
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <i className="fas fa-briefcase"></i>
          Job Performance
        </button>
        <button 
          className={`tab-button ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <i className="fas fa-users"></i>
          Candidate Insights
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'jobs' && renderJobPerformanceTab()}
        {activeTab === 'candidates' && renderCandidateInsightsTab()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
