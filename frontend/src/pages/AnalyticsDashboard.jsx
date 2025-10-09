import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BackButton from '../components/BackButton';
import { analyticsApi } from '../api/analyticsApi';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for different analytics data
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [matchThresholds, setMatchThresholds] = useState([]);
  const [skillsGapAnalysis, setSkillsGapAnalysis] = useState(null);
  const [matchingHistory, setMatchingHistory] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [selectedJob, setSelectedJob] = useState('');
  const [jobs, setJobs] = useState([]);
  const [historyDays, setHistoryDays] = useState('30');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      loadDashboardData();
      loadJobs();
    }
  }, [userId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, thresholdsRes, historyRes, recruitmentAnalyticsRes] = await Promise.all([
        analyticsApi.getDashboardSummary(),
        analyticsApi.getMatchThresholds(),
        analyticsApi.getMatchingHistory(30),
        analyticsApi.getRecruitmentAnalytics(30)
      ]);
      
      setDashboardSummary(summaryRes.data);
      setMatchThresholds(thresholdsRes.data || []);
      setMatchingHistory(historyRes.data || []);
      
      // Use recruitment analytics data to populate dashboard summary if available
      if (recruitmentAnalyticsRes.data) {
        const analytics = recruitmentAnalyticsRes.data;
        setDashboardSummary({
          total_jobs: analytics.overview?.total_jobs || 0,
          total_applications: analytics.overview?.total_applications || 0,
          average_match_score: analytics.candidate_quality?.avg_match_score || 0,
          recent_jobs: historyRes.data || []
        });
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      // Get real jobs from the backend
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`http://localhost:3002/api/jobs/jobs_by_user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const realJobs = data.jobs?.map(job => ({
          id: job._id,
          title: job.job_title
        })) || [];
        setJobs(realJobs);
        console.log('Loaded real jobs:', realJobs);
      } else {
        console.error('Failed to load jobs:', response.status);
        // Fallback to empty array
        setJobs([]);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      // Fallback to empty array if API fails
      setJobs([]);
    }
  };

  const handleThresholdUpdate = async (jobId, minThreshold, autoRejectThreshold) => {
    try {
      await analyticsApi.setMatchThresholds(jobId, minThreshold, autoRejectThreshold);
      loadDashboardData(); // Reload data
    } catch (err) {
      setError('Failed to update thresholds');
    }
  };

  const loadSkillsGapAnalysis = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const analysis = await analyticsApi.getSkillsGapAnalysis(jobId);
      setSkillsGapAnalysis(analysis.data);
    } catch (err) {
      setError('Failed to load skills gap analysis');
    } finally {
      setLoading(false);
    }
  };

  const loadCompetitorAnalysis = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const job = jobs.find(j => j.id === selectedJob);
      if (job) {
        const analysis = await analyticsApi.getCompetitorAnalysis(
          job.title,
          'Remote',
          'Technology'
        );
        setCompetitorAnalysis(analysis.data);
      }
    } catch (err) {
      setError('Failed to load competitor analysis');
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="analytics-overview">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Jobs</h3>
          <p className="metric-value">{dashboardSummary?.total_jobs || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Total Applications</h3>
          <p className="metric-value">{dashboardSummary?.total_applications || 0}</p>
        </div>
        <div className="metric-card">
          <h3>Avg Match Score</h3>
          <p className="metric-value">{dashboardSummary?.average_match_score || 0}%</p>
        </div>
        <div className="metric-card">
          <h3>High Quality Candidates</h3>
          <p className="metric-value">
            {matchingHistory.reduce((sum, job) => sum + (job.high_quality_candidates || 0), 0)}
          </p>
        </div>
      </div>

      <div className="recent-jobs">
        <h3>Recent Job Performance</h3>
        <div className="jobs-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applications</th>
                <th>Avg Match Score</th>
                <th>High Quality</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {dashboardSummary?.recent_jobs?.length > 0 ? (
                dashboardSummary.recent_jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.job_title}</td>
                    <td>{job.total_applications}</td>
                    <td>{job.average_match_score}%</td>
                    <td>{job.high_quality_candidates}</td>
                    <td>{job.conversion_rate?.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '2rem' }}>📈</span>
                      <p>No job performance data available yet.</p>
                      <p style={{ fontSize: '0.9rem', color: '#999' }}>
                        Job performance metrics will appear here once you have jobs with applications.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderThresholdsTab = () => (
    <div className="thresholds-section">
      <h3>Match Score Thresholds</h3>
      <p>Set minimum match scores to automatically filter candidates</p>
      
      <div className="thresholds-grid">
        {matchThresholds.length > 0 ? (
          matchThresholds.map((job, index) => (
            <div key={index} className="threshold-card">
              <h4>{job.job_title}</h4>
              <div className="threshold-inputs">
                <div className="input-group">
                  <label>Minimum Score:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={job.match_threshold || 70}
                    onChange={(e) => {
                      const newThresholds = [...matchThresholds];
                      newThresholds[index].match_threshold = parseInt(e.target.value);
                      setMatchThresholds(newThresholds);
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>Auto-Reject Below:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={job.auto_reject_threshold || 50}
                    onChange={(e) => {
                      const newThresholds = [...matchThresholds];
                      newThresholds[index].auto_reject_threshold = parseInt(e.target.value);
                      setMatchThresholds(newThresholds);
                    }}
                  />
                </div>
              </div>
              <button
                className="update-btn"
                onClick={() => handleThresholdUpdate(
                  job._id,
                  job.match_threshold,
                  job.auto_reject_threshold
                )}
              >
                Update Thresholds
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', gridColumn: '1 / -1' }}>
            <span style={{ fontSize: '2rem' }}>⚙️</span>
            <p>No jobs available to set match score thresholds.</p>
            <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '10px' }}>
              Create some job postings first to configure match score settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkillsGapTab = () => (
    <div className="skills-gap-section">
      <h3>Skills Gap Analysis</h3>
      <div className="job-selector">
        <label>Select Job:</label>
        <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
          <option value="">Choose a job...</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
        <button 
          className="analyze-btn"
          onClick={() => loadSkillsGapAnalysis(selectedJob)}
          disabled={!selectedJob}
        >
          Analyze Skills
        </button>
      </div>

      {skillsGapAnalysis ? (
        <div className="skills-analysis">
          <h4>{skillsGapAnalysis.job_title}</h4>
          <div className="required-skills">
            <h5>Required Skills:</h5>
            <div className="skills-tags">
              {skillsGapAnalysis.required_skills?.map((skill, index) => (
                <span key={index} className="skill-tag required">{skill}</span>
              )) || <p>No required skills defined for this job.</p>}
            </div>
          </div>

          <div className="candidates-analysis">
            <h5>Candidates Analysis:</h5>
            {skillsGapAnalysis.candidates_analysis?.length > 0 ? (
              <div className="candidates-grid">
                {skillsGapAnalysis.candidates_analysis.map((candidate, index) => (
                  <div key={index} className="candidate-card">
                    <h6>{candidate.candidate_name}</h6>
                    <p>Match Score: {candidate.match_score}%</p>
                    <p>Skills Match: {candidate.skills_match_percentage.toFixed(1)}%</p>
                    
                    <div className="skills-breakdown">
                      <div className="matched-skills">
                        <strong>Matched:</strong>
                        {candidate.matched_skills?.map((skill, idx) => (
                          <span key={idx} className="skill-tag matched">{skill}</span>
                        )) || <span>None</span>}
                      </div>
                      <div className="missing-skills">
                        <strong>Missing:</strong>
                        {candidate.missing_skills?.map((skill, idx) => (
                          <span key={idx} className="skill-tag missing">{skill}</span>
                        )) || <span>None</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <span style={{ fontSize: '2rem' }}>👥</span>
                <p>No candidates have applied for this job yet.</p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  Skills gap analysis will be available once applications are received.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedJob ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <span style={{ fontSize: '2rem' }}>🔍</span>
          <p>Click "Analyze Skills" to perform skills gap analysis for the selected job.</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <span style={{ fontSize: '2rem' }}>📋</span>
          <p>Select a job to analyze skills gaps and candidate matches.</p>
          {jobs.length === 0 && (
            <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '10px' }}>
              No jobs available. Create some job postings first.
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderMatchingHistoryTab = () => (
    <div className="matching-history-section">
      <h3>Matching History & Performance</h3>
      
      <div className="history-filters">
        <select
          value={historyDays}
          onChange={(e) => {
            const value = e.target.value;
            setHistoryDays(value);
            const days = parseInt(value);
            analyticsApi.getMatchingHistory(days).then(response => {
              setMatchingHistory(response.data);
            });
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Posted Date</th>
              <th>Applications</th>
              <th>Avg Match Score</th>
              <th>High Quality</th>
              <th>Views</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {matchingHistory.length > 0 ? (
              matchingHistory.map((job, index) => (
                <tr key={index}>
                  <td>{job.job_title}</td>
                  <td>{new Date(job.posted_date).toLocaleDateString()}</td>
                  <td>{job.total_applications}</td>
                  <td>{job.average_match_score}%</td>
                  <td>{job.high_quality_candidates}</td>
                  <td>{job.views}</td>
                  <td>{job.conversion_rate?.toFixed(1)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '2rem' }}>📊</span>
                    <p>No matching history data available for the selected period.</p>
                    <p style={{ fontSize: '0.9rem', color: '#999' }}>
                      This could be because there are no jobs posted or no applications received yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompetitorTab = () => (
    <div className="competitor-analysis-section">
      <h3>Competitor Analysis</h3>
      
      <div className="competitor-filters">
        <div className="filter-group">
          <label>Select Job:</label>
          <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            <option value="">Choose a job...</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
        <button 
          className="analyze-btn"
          onClick={loadCompetitorAnalysis}
          disabled={!selectedJob}
        >
          Analyze Competition
        </button>
      </div>

      {competitorAnalysis ? (
        <div className="competitor-results">
          <div className="market-insights">
            <h4>Market Insights</h4>
            <div className="insights-grid">
              <div className="insight-card">
                <h5>Average Salary</h5>
                <p>{competitorAnalysis.market_insights?.average_salary || 'N/A'}</p>
              </div>
              <div className="insight-card">
                <h5>Average Applicants</h5>
                <p>{competitorAnalysis.market_insights?.average_applicants || 'N/A'}</p>
              </div>
              <div className="insight-card">
                <h5>Market Demand</h5>
                <p>{competitorAnalysis.market_insights?.market_demand || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="competitor-jobs">
            <h4>Competitor Job Postings</h4>
            {competitorAnalysis.competitor_analysis?.length > 0 ? (
              <div className="competitor-grid">
                {competitorAnalysis.competitor_analysis.map((competitor, index) => (
                  <div key={index} className="competitor-card">
                    <h5>{competitor.company}</h5>
                    <p><strong>Job:</strong> {competitor.job_title}</p>
                    <p><strong>Location:</strong> {competitor.location}</p>
                    <p><strong>Salary:</strong> {competitor.salary_range}</p>
                    <p><strong>Applicants:</strong> {competitor.applicants}</p>
                    <p><strong>Quality:</strong> {competitor.match_quality}</p>
                    <p><strong>Posted:</strong> {new Date(competitor.posted_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <span style={{ fontSize: '2rem' }}>🏢</span>
                <p>No competitor data available for this job.</p>
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  Competitor analysis is currently using mock data.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedJob ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <span style={{ fontSize: '2rem' }}>🔍</span>
          <p>Click "Analyze Competition" to get market insights for the selected job.</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <span style={{ fontSize: '2rem' }}>📊</span>
          <p>Select a job to analyze market competition and get insights.</p>
          {jobs.length === 0 && (
            <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '10px' }}>
              No jobs available. Create some job postings first.
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <BackButton to="/recruiter-dashboard" text="Back" />
    
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights into your recruitment performance</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'thresholds' ? 'active' : ''}`}
          onClick={() => setActiveTab('thresholds')}
        >
          Match Thresholds
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills Gap Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Matching History
        </button>
        <button
          className={`tab-btn ${activeTab === 'competitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitor')}
        >
          Competitor Analysis
        </button>
      </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'thresholds' && renderThresholdsTab()}
          {activeTab === 'skills' && renderSkillsGapTab()}
          {activeTab === 'history' && renderMatchingHistoryTab()}
          {activeTab === 'competitor' && renderCompetitorTab()}
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
