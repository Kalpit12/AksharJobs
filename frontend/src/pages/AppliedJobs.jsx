import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import "../styles/AppliedJobs.css";

const AppliedJobs = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  /** Fetch Applied Jobs from Backend */
  const fetchAppliedJobs = useCallback(async () => {
    if (!userId) {
      console.error("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/applications/get_applications`, { params: { userId } });

      if (response.data && Array.isArray(response.data.applications)) {
        setAppliedJobs(response.data.applications);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /** Fetch All Job Details */
  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/jobs/get_jobs");

      if (response.data && Array.isArray(response.data)) {
        setJobDetails(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppliedJobs();
    fetchJobDetails();
  }, [fetchAppliedJobs, fetchJobDetails]);

  /** Apply for a Job */
  const applyForJob = useCallback(async (jobId) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/applications/update_status`, { userId, jobId, status: "applied" });
      fetchAppliedJobs();
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  }, [userId, fetchAppliedJobs]);

  /** Merge Applied Jobs with Job Details */
  const mergedJobs = appliedJobs.map((app) => {
    const job = jobDetails.find((j) => j._id === app.jobId) || {};

    return {
      jobId: app.jobId,
      job_title: job.job_title || "Unknown Job",
      company_name: job.company_name || "Unknown Company",
      location: job.location || "Not Specified",
      matchScore: app.final_score || 0,
      salary_range: job.salary_range || "Not Provided",
      application_deadline: job.application_deadline || "N/A",
      status: app.status || "not_applied",
      interviewDate: app.interviewDate,
      interviewMode: app.interviewMode,
    };
  });

  /** Filter & Sort Jobs */
  const filteredJobs = mergedJobs
    .filter((job) =>
      (job.job_title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (job.company_name?.toLowerCase() || "").includes(search.toLowerCase())
    )
    .filter((job) => (filterStatus ? job.status === filterStatus : true))
    .sort((a, b) => {
      if (sortField === "matchScore") return b.matchScore - a.matchScore;
      if (sortField === "salary")
        return (
          parseInt(b.salary_range?.split("-")[1]?.replace(/[^0-9]/g, "") || "0") -
          parseInt(a.salary_range?.split("-")[1]?.replace(/[^0-9]/g, "") || "0")
        );
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#667eea';
      case 'shortlisted': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'accepted': return '#10b981';
      case 'not_applied': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return '📝';
      case 'shortlisted': return '⭐';
      case 'rejected': return '❌';
      case 'accepted': return '🎉';
      case 'not_applied': return '⏳';
      default: return '⏳';
    }
  };

  const formatDate = (dateString) => {
    if (dateString === "N/A") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="applied_jobs_page">
        <Header />
        <BackButton to="/jobseeker-dashboard" text="Back to Dashboard" />
        <div className="applied_jobs_container">
          <div className="loading_container">
            <div className="loading_spinner"></div>
            <p>Loading your applied jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applied_jobs_page">
      <Header />
      <BackButton to="/jobseeker-dashboard" text="Back to Dashboard" />
      
      <div className="applied_jobs_container">
        {/* Section Header */}
        <div className="section_header">
          <h2>
            <span className="bag_icon">💼</span>
            Applied Jobs Dashboard
          </h2>
          <p className="section_subtitle">Track your job applications and their status</p>
        </div>

        {/* Enhanced Search & Filters */}
        <div className="enhanced_filters_container">
          <div className="filters_grid">
            <div className="filter_group">
              <label className="filter_label">Search</label>
              <input
                type="text"
                placeholder="Search by job title or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="enhanced_input"
              />
            </div>
            
            <div className="filter_group">
              <label className="filter_label">Status</label>
              <select 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="enhanced_select"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="not_applied">Not Applied</option>
              </select>
            </div>
            
            <div className="filter_group">
              <label className="filter_label">Sort By</label>
              <select 
                onChange={(e) => setSortField(e.target.value)}
                className="enhanced_select"
              >
                <option value="">Default Order</option>
                <option value="matchScore">Match Score (High to Low)</option>
                <option value="salary">Salary Range (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="stats_summary">
          <div className="stat_card">
            <div className="stat_icon">📄</div>
            <div className="stat_content">
              <h3>{filteredJobs.length}</h3>
              <p>Total Jobs</p>
            </div>
          </div>
          
          <div className="stat_card">
            <div className="stat_icon">⭐</div>
            <div className="stat_content">
              <h3>{filteredJobs.filter(job => job.status === 'shortlisted').length}</h3>
              <p>Shortlisted</p>
            </div>
          </div>
          
          <div className="stat_card">
            <div className="stat_icon">🎉</div>
            <div className="stat_content">
              <h3>{filteredJobs.filter(job => job.status === 'accepted').length}</h3>
              <p>Accepted</p>
            </div>
          </div>
          
          <div className="stat_card">
            <div className="stat_icon">📊</div>
            <div className="stat_content">
              <h3>{Math.round(filteredJobs.reduce((acc, job) => acc + job.matchScore, 0) / Math.max(filteredJobs.length, 1))}%</h3>
              <p>Avg Match Score</p>
            </div>
          </div>
        </div>

        {/* Modern Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="jobs_grid">
            {filteredJobs.map((job) => (
              <div key={job.jobId} className="job_card">
                <div className="job_header">
                  <div className="job_title_section">
                    <h3 className="job_title">{job.job_title}</h3>
                    <p className="company_name">{job.company_name}</p>
                  </div>
                  <div className="status_badge" style={{ backgroundColor: getStatusColor(job.status) }}>
                    <span className="status_icon">{getStatusIcon(job.status)}</span>
                    <span className="status_text">{job.status.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                <div className="job_details">
                  <div className="detail_row">
                    <div className="detail_item">
                      <span className="detail_icon">📍</span>
                      <span className="detail_label">Location:</span>
                      <span className="detail_value">{job.location}</span>
                    </div>
                    
                    <div className="detail_item">
                      <span className="detail_icon">💰</span>
                      <span className="detail_label">Salary:</span>
                      <span className="detail_value">{job.salary_range}</span>
                    </div>
                  </div>
                  
                  <div className="detail_row">
                    <div className="detail_item">
                      <span className="detail_icon">📅</span>
                      <span className="detail_label">Deadline:</span>
                      <span className="detail_value">{formatDate(job.application_deadline)}</span>
                    </div>
                    
                    <div className="detail_item">
                      <span className="detail_icon">📊</span>
                      <span className="detail_label">Match Score:</span>
                      <span className="detail_value score_value" style={{ color: job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {Math.round(job.matchScore)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="job_actions">
                  {job.status === "not_applied" ? (
                    <button 
                      className="action_button primary" 
                      onClick={() => applyForJob(job.jobId)}
                    >
                      Apply Now
                    </button>
                  ) : job.status === "shortlisted" && job.interviewDate && job.interviewMode ? (
                    <div className="interview_info">
                      <div className="interview_badge">
                        <span className="interview_icon">📅</span>
                        <span>Interview: {new Date(job.interviewDate).toLocaleString()}</span>
                      </div>
                      <div className="interview_badge">
                        <span className="interview_icon">💻</span>
                        <span>Mode: {job.interviewMode}</span>
                      </div>
                    </div>
                  ) : job.status === "accepted" ? (
                    <div className="success_badge">
                      <span className="success_icon">🎉</span>
                      <span>Congratulations! You got the job!</span>
                    </div>
                  ) : job.status === "rejected" ? (
                    <div className="rejection_badge">
                      <span className="rejection_icon">💪</span>
                      <span>Keep applying! Better opportunities await.</span>
                    </div>
                  ) : (
                    <div className="status_info">
                      <span>Application submitted successfully</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no_jobs_container">
            <div className="no_jobs_icon">💼</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or start applying to jobs!</p>
            <button 
              className="action_button primary"
              onClick={() => window.location.href = '/jobseeker-dashboard'}
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
