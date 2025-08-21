import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import PremiumPrompt from "../components/PremiumPrompt";
import InterviewScorecard from "../components/InterviewScorecard";
import TeamCollaboration from "../components/TeamCollaboration";
import OfferLetterGenerator from "../components/OfferLetterGenerator";
import CulturalProfileBuilder from "../components/CulturalProfileBuilder";
import CompanyCultureAssessment from "../components/CompanyCultureAssessment";
import CulturalFitScore from "../components/CulturalFitScore";
import DiversityAnalytics from "../components/DiversityAnalytics";
import { analyticsApi } from "../api/analyticsApi";
import "../styles/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("deadline");
  const [interviews, setInterviews] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  
  // Productivity Tools State
  const [showInterviewScorecard, setShowInterviewScorecard] = useState(false);
  const [showTeamCollaboration, setShowTeamCollaboration] = useState(false);
  const [showOfferLetterGenerator, setShowOfferLetterGenerator] = useState(false);
  const [showCulturalProfileBuilder, setShowCulturalProfileBuilder] = useState(false);
  const [showCompanyCultureAssessment, setShowCompanyCultureAssessment] = useState(false);
  const [showCulturalFitScore, setShowCulturalFitScore] = useState(false);
  const [showDiversityAnalytics, setShowDiversityAnalytics] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidateCulturalProfile, setCandidateCulturalProfile] = useState(null);
  const [companyCultureData, setCompanyCultureData] = useState(null);
  
  const userId = localStorage.getItem("userId");

  // ---- Cultural Fit helpers: load/store profiles and generate deterministic defaults ----
  const loadStoredJSON = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getDeterministicSeed = (input) => {
    let hash = 0;
    const str = String(input || "");
    for (let i = 0; i < str.length; i += 1) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }
    return Math.abs(hash);
  };

  const selectFromList = (list, seed, offset) => list[(seed + offset) % list.length];

  const generateProfileFromCandidate = (candidate) => {
    const seed = getDeterministicSeed(candidate?.id ?? candidate?.name ?? Math.random());
    return {
      communication_style: selectFromList(["formal", "informal", "mixed"], seed, 1),
      leadership_approach: selectFromList(["hierarchical", "collaborative", "mentoring"], seed, 2),
      work_environment: selectFromList(["stable", "creative", "fast_paced"], seed, 3),
      team_dynamics: selectFromList(["specialized", "cross_functional", "supportive"], seed, 4),
      language_preference: selectFromList(["english", "bilingual", "multilingual"], seed, 5),
    };
  };

  const defaultCompanyCultureFromUser = (user) => ({
    communication_style: "formal",
    leadership_approach: "hierarchical",
    work_environment: "stable",
    team_dynamics: "specialized",
    language_policy: "english",
    ...(user && user.industry === "Technology" ? { work_environment: "fast_paced", team_dynamics: "cross_functional" } : {}),
  });

  // Analytics data
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [matchingHistoryAnalytics, setMatchingHistoryAnalytics] = useState([]);

  // Pipeline data state
  const [pipelineData, setPipelineData] = useState({
    applied: [
      {
        id: 1,
        name: "Sarah Johnson",
        position: "Senior Frontend Developer",
        company: "TechCorp",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        matchScore: 92,
        experience: "5 years"
      },
      {
        id: 2,
        name: "Michael Chen",
        position: "Full Stack Engineer",
        company: "InnovateLab",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        matchScore: 88,
        experience: "4 years"
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        position: "UI/UX Designer",
        company: "DesignStudio",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        matchScore: 85,
        experience: "3 years"
      }
    ],
    reviewing: [
      {
        id: 4,
        name: "David Kim",
        position: "Backend Developer",
        company: "DataFlow",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        matchScore: 91,
        experience: "6 years"
      },
      {
        id: 5,
        name: "Lisa Wang",
        position: "DevOps Engineer",
        company: "CloudTech",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        matchScore: 87,
        experience: "4 years"
      }
    ],
    interviewing: [
      {
        id: 6,
        name: "James Wilson",
        position: "Product Manager",
        company: "ProductHub",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        matchScore: 94,
        experience: "7 years"
      }
    ],
    shortlisted: [
      {
        id: 7,
        name: "Maria Garcia",
        position: "Data Scientist",
        company: "AnalyticsPro",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7f430eb9c8b?w=150&h=150&fit=crop&crop=face",
        matchScore: 96,
        experience: "5 years"
      }
    ],
    hired: [
      {
        id: 8,
        name: "Alex Thompson",
        position: "Mobile Developer",
        company: "AppWorks",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        matchScore: 89,
        experience: "4 years"
      }
    ]
  });

  // Drag and drop functionality
  const handleDragStart = (e, candidate) => {
    e.dataTransfer.setData("candidate", JSON.stringify(candidate));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const candidate = JSON.parse(e.dataTransfer.getData("candidate"));
    
    // Remove candidate from all stages
    const newPipelineData = { ...pipelineData };
    Object.keys(newPipelineData).forEach(stage => {
      newPipelineData[stage] = newPipelineData[stage].filter(c => c.id !== candidate.id);
    });
    
    // Add candidate to target stage
    newPipelineData[targetStage] = [...newPipelineData[targetStage], candidate];
    
    setPipelineData(newPipelineData);
  };

  // Load analytics for the Analytics tab cards
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          analyticsApi.getDashboardSummary(),
          analyticsApi.getMatchingHistory(30)
        ]);
        setAnalyticsSummary(summaryRes.data);
        setMatchingHistoryAnalytics(historyRes.data || []);
      } catch (err) {
        // Silently ignore for now; the UI will show placeholders if missing
        // console.error("Failed to load analytics", err);
      }
    };
    loadAnalytics();
  }, []);

  // ---- Derived analytics metrics ----
  const totalApplications30 = matchingHistoryAnalytics.reduce(
    (sum, j) => sum + (j.total_applications || 0),
    0
  );

  const totalViews30 = matchingHistoryAnalytics.reduce(
    (sum, j) => sum + (j.views || 0),
    0
  );

  const avgConversionRate = (() => {
    const items = matchingHistoryAnalytics.filter(
      (j) => (j.views || 0) > 0
    );
    if (!items.length) return 0;
    const avg =
      items.reduce((acc, j) => acc + (j.conversion_rate || 0), 0) / items.length;
    return Number.isFinite(avg) ? avg : 0;
  })();

  const overallConversionRate = totalViews30 > 0
    ? (totalApplications30 / totalViews30) * 100
    : 0;

  const highQualityCount = matchingHistoryAnalytics.reduce(
    (sum, j) => sum + (j.high_quality_candidates || 0),
    0
  );

  const highQualityRate = totalApplications30 > 0
    ? (highQualityCount / totalApplications30) * 100
    : 0;

  const avgDaysToFill = (() => {
    // Proxy: average days since posting for jobs that have applications
    const withApps = matchingHistoryAnalytics.filter(
      (j) => (j.total_applications || 0) > 0 && j.posted_date
    );
    if (!withApps.length) return 0;
    const now = Date.now();
    const days = withApps.map((j) =>
      (now - new Date(j.posted_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const avg = days.reduce((a, b) => a + b, 0) / days.length;
    return avg;
  })();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/jobs_by_user/${userId}`);
        setJobPostings(response.data || []);
      } catch (err) {
        setError("Failed to fetch job postings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`);
        setUserDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user details.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

        if (userId) {
      fetchJobs();
      fetchUserDetails();
    }
    
    // Show premium prompt for Basic users after a delay
    setTimeout(() => {
      try {
        const paymentData = localStorage.getItem('paymentData');
        if (!paymentData) {
          setShowPremiumPrompt(true);
        } else {
          const parsedData = JSON.parse(paymentData);
          if (parsedData.planName === 'Basic') {
            setShowPremiumPrompt(true);
          }
        }
      } catch (error) {
        console.log('Error parsing payment data, showing premium prompt');
        setShowPremiumPrompt(true);
      }
    }, 3000); // Show after 3 seconds
    
  }, [userId]);

  // Debug: Monitor component mount
  useEffect(() => {
    // Component mount monitoring
  }, []);

  const filteredJobs = jobPostings
    .filter(job => filterType === "all" || job.job_type === filterType)
    .filter(job => job.job_title.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortType === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
    if (sortType === "applicants") return (b.applicants?.length || 0) - (a.applicants?.length || 0);
    if (sortType === "views") return (Number(b.views) || 0) - (Number(a.views) || 0);
    return 0;
  });

  const totalJobs = jobPostings.length;
  const totalApplicants = jobPostings.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
  const totalViews = jobPostings.reduce((sum, job) => sum + (Number(job.views) || 0), 0);
  const activeJobs = jobPostings.filter(job => new Date(job.application_deadline) > new Date()).length;
  const urgentJobs = jobPostings.filter(job => {
    const deadline = new Date(job.application_deadline);
    const now = new Date();
    const daysUntilDeadline = (deadline - now) / (1000 * 60 * 60 * 24);
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  }).length;

  const currentJobs = sortedJobs.slice(0, 8);
  
  // Productivity Tools Handlers
  const openInterviewScorecard = (candidate, job) => {
    setSelectedCandidate(candidate);
    setSelectedJob(job);
    setShowInterviewScorecard(true);
  };

  const openTeamCollaboration = (candidate, job) => {
    setSelectedCandidate(candidate);
    setSelectedJob(job);
    setShowTeamCollaboration(true);
  };

  const openOfferLetterGenerator = (candidate, job) => {
    setSelectedCandidate(candidate);
    setSelectedJob(job);
    setShowOfferLetterGenerator(true);
  };

  const openCulturalFitAssessment = (candidate, job) => {
    setSelectedCandidate(candidate);
    setSelectedJob(job);
    try {
      if (candidate?.id) {
        localStorage.setItem('currentCandidateId', String(candidate.id));
      }
    } catch {}

    // Load stored profiles if available
    const storedCandidateProfile = loadStoredJSON(`culturalProfile:${candidate?.id}`);
    const storedCompanyCulture = loadStoredJSON(`companyCulture:${userId}`);

    const resolvedCandidateProfile = storedCandidateProfile || generateProfileFromCandidate(candidate);
    const resolvedCompanyCulture = storedCompanyCulture || companyCultureData || defaultCompanyCultureFromUser(userDetails);

    setCandidateCulturalProfile(resolvedCandidateProfile);
    setCompanyCultureData(resolvedCompanyCulture);
    setShowCulturalFitScore(true);
  };

  const handleScorecardSave = (scorecardData) => {
    // TODO: API call to save scorecard
    setShowInterviewScorecard(false);
  };

  const handleOfferLetterSend = (offerLetterData) => {
    // TODO: API call to send offer letter
    setShowOfferLetterGenerator(false);
  };

  const closeProductivityTools = () => {
    setShowInterviewScorecard(false);
    setShowTeamCollaboration(false);
    setShowOfferLetterGenerator(false);
    setShowCulturalProfileBuilder(false);
    setShowCompanyCultureAssessment(false);
    setShowCulturalFitScore(false);
    setShowDiversityAnalytics(false);
    setSelectedCandidate(null);
    setSelectedJob(null);
  };
  
  const fetchApplicationsAndInterviews = useCallback(async () => {
    try {
      const applicationData = [];
      const interviewData = [];
  
      for (const job of jobPostings) {
        const response = await axios.get(
          `http://localhost:5000/api/applications/get_applications?jobId=${job._id}`
        );
        const jobApplications = response.data.applications || [];
  
        const shortlistedApplications = jobApplications.filter(
          (app) => app.status === "shortlisted"
        );
  
        for (const application of shortlistedApplications) {
          const userResponse = await axios.get(
            `http://localhost:5000/api/auth/get_user?userId=${application.userId}`
          );
          const candidateDetails = {
            ...userResponse.data,
            interviewDate: application.interviewDate,
            interviewMode: application.interviewMode,
            jobTitle: job.job_title,
          };
  
          if (application.interviewDate) {
            interviewData.push(candidateDetails);
          }
          applicationData.push(candidateDetails);
        }
      }
      
      setInterviews(interviewData);
      
    } catch (err) {
      console.error("Failed to fetch applications or interviews.", err);
    }
  }, [jobPostings]);
  
  useEffect(() => {
    if (jobPostings.length > 0) {
      fetchApplicationsAndInterviews();
    }
  }, [jobPostings, fetchApplicationsAndInterviews]);

  const filterInterviews = (interviews) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const filtered = interviews.filter((candidate) => {
      const interviewDate = new Date(candidate.interviewDate);
      const interviewDay = new Date(interviewDate.getFullYear(), interviewDate.getMonth(), interviewDate.getDate());
  
      return (
        (interviewDay.getTime() === today.getTime() || interviewDay.getTime() === tomorrow.getTime()) &&
        interviewDate.getTime() > now.getTime()
      );
    });
  
    return filtered;
  };

  const upcomingInterviews = filterInterviews(interviews);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'urgent': return '#dc3545';
      case 'expired': return '#6c757d';
      default: return '#17a2b8';
    }
  };

  const getJobStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDeadline < 0) return 'expired';
    if (daysUntilDeadline <= 7) return 'urgent';
    return 'active';
  };
  
  return (
    <div className="recruiter_dashboard_wrapper">
      <Header />
      <div className="recruiter_dashboard_container">
        
        {/* Premium Prompt - Modern Design */}
                        {showPremiumPrompt && (
                  <PremiumPrompt 
                    userType="recruiter"
                    onClose={() => setShowPremiumPrompt(false)}
                  />
                )}
        
        <div className="main_content">
        {/* 🎯 Section Header */}
        <div className="section_header">
          <h2>
            <span className="header_icon"><i className="fas fa-bullseye"></i></span>
            <span className="header_text">Talent Command Center</span>
          </h2>
          <p className="section_subtitle">Manage your job postings and candidate pipeline</p>
        </div>

        {/* 👤 Enhanced Company Profile Section */}
        {isLoadingProfile ? (
          <div className="profile_loading">
            <div className="loading_spinner"></div>
            <p>Loading company profile...</p>
          </div>
        ) : userDetails && (
          <div className="recruiter_user_profile">
            <div className="profile_image_container">
              <img 
                src={userDetails.profileImage || "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180"} 
                alt="Company Logo" 
                className="recruiter_profile_image"
                onError={(e) => {
                  e.target.src = "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180";
                }}
              />
              <div className="profile_status_badge">
                <span className="status_dot"></span>
                Active Recruiter
              </div>
            </div>
            
            <div className="profile_info">
              <div className="profile_details">
                <h3 className="company_name">{userDetails.companyName || "Company Name"}</h3>
                <div className="company_details">
                  <div className="detail_item">
                    <span className="detail_icon">👤</span>
                    <span className="detail_text">
                      <strong>Recruiter:</strong> {userDetails.firstName} {userDetails.lastName}
                      <span 
                        style={{
                          background: '#FF0000',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          marginLeft: '15px',
                          boxShadow: '0 4px 15px rgba(255, 0, 0, 0.6)',
                          border: '3px solid #FFD700',
                          display: 'inline-block',
                          position: 'relative',
                          zIndex: 9999,
                          minWidth: '60px',
                          textAlign: 'center'
                        }}
                      >
                        ⭐ PRO ⭐
                      </span>
                    </span>
                  </div>
                  <div className="detail_item">
                    <span className="detail_icon">📧</span>
                    <span className="detail_text">
                      <strong>Email:</strong> {userDetails.email}
                    </span>
                  </div>
                  <div className="detail_item">
                    <span className="detail_icon">🏢</span>
                    <span className="detail_text">
                      <strong>Industry:</strong> {userDetails.industry || "Technology"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="profile_stats">
                <div className="stat_item">
                  <div className="stat_icon">📊</div>
                  <div className="stat_content">
                    <div className="stat_number">{totalJobs}</div>
                    <div className="stat_label">Total Jobs</div>
                  </div>
                </div>
                <div className="stat_item">
                  <div className="stat_icon">👥</div>
                  <div className="stat_content">
                    <div className="stat_number">{totalApplicants}</div>
                    <div className="stat_label">Total Applicants</div>
                  </div>
                </div>
                <div className="stat_item">
                  <div className="stat_icon">👁️</div>
                  <div className="stat_content">
                    <div className="stat_number">{totalViews}</div>
                    <div className="stat_label">Total Views</div>
                  </div>
                </div>
                <div className="stat_item">
                  <div className="stat_icon">⏰</div>
                  <div className="stat_content">
                    <div className="stat_number">{urgentJobs}</div>
                    <div className="stat_label">Urgent Jobs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🎛️ Enhanced Dashboard Controls */}
        <div className="dashboard_controls">
          <div className="search_filter_section">
            <div className="search_container">
              <span className="search_icon">🔍</span>
              <input
                type="text"
                placeholder="Search jobs by title, location, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="enhanced_search_input"
              />
            </div>
            
            <div className="filter_controls">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="enhanced_filter_select"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              
              <select 
                value={sortType} 
                onChange={(e) => setSortType(e.target.value)} 
                className="enhanced_sort_select"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="applicants">Sort by Applicants</option>
                <option value="views">Sort by Views</option>
                <option value="created">Sort by Created Date</option>
              </select>
            </div>
          </div>

          <div className="tab_navigation">
            <button 
              className={`tab_button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`tab_button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              💼 Job Postings
            </button>
            <button 
              className={`tab_button ${activeTab === 'interviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('interviews')}
            >
              🗓️ Interviews
            </button>
            <button 
              className={`tab_button ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
            <button 
              className={`tab_button ${activeTab === 'cv-browser' ? 'active' : ''}`}
              onClick={() => setActiveTab('cv-browser')}
            >
              📄 CV Browser
            </button>
          </div>
        </div>

        {/* 🎯 Candidate Pipeline Visualization */}
        <div className="candidate_pipeline_section">
          <div className="section_header">
            <h2>🚀 Productivity Tools & Candidate Pipeline</h2>
            <p className="section_subtitle">Use the action buttons below each candidate to access powerful productivity tools</p>
                                                   <div className="productivity_tools_info">
                <div className="tool_info">
                  <span className="tool_label">Interview Scorecard</span>
                </div>
                <div className="tool_info">
                  <span className="tool_label">Team Collaboration</span>
                </div>
                <div className="tool_info">
                  <span className="tool_label">Offer Letter Generator</span>
                </div>
                <div className="tool_info">
                  <span className="tool_label">Cultural Fit Assessment</span>
                </div>
              </div>
             
             
          </div>
          
          <div className="pipeline_container">
            <div className="pipeline_column" data-stage="applied" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'applied')}>
              <div className="pipeline_header">
                <h3>📥 Applied</h3>
                <span className="candidate_count">{pipelineData.applied.length}</span>
              </div>
              <div className="pipeline_candidates">
                {pipelineData.applied.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="candidate_card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <div className="candidate_actions">
                      <button 
                        className="action_btn scorecard_btn"
                        onClick={() => openInterviewScorecard(candidate, { title: candidate.position })}
                        title="Interview Scorecard"
                      >
                        SC
                      </button>
                      <button 
                        className="action_btn collaboration_btn"
                        onClick={() => openTeamCollaboration(candidate, { title: candidate.position })}
                        title="Team Collaboration"
                      >
                        TC
                      </button>
                      <button 
                        className="action_btn offer_btn"
                        onClick={() => openOfferLetterGenerator(candidate, { title: candidate.position })}
                        title="Generate Offer Letter"
                      >
                        OL
                      </button>
                      <button 
                        className="action_btn cultural_btn"
                        onClick={() => openCulturalFitAssessment(candidate, { title: candidate.position })}
                        title="Cultural Fit Assessment"
                      >
                        CF
                      </button>
                    </div>
                    <div className="candidate_info">
                      <div className="candidate_avatar">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="candidate_details">
                        <h4>{candidate.name}</h4>
                        <p className="candidate_position">{candidate.position}</p>
                        <p className="candidate_company">{candidate.company}</p>
                        <div className="candidate_meta">
                          <span className="match_score">Match: {candidate.matchScore}%</span>
                          <span className="experience">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipeline_column" data-stage="reviewing" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'reviewing')}>
              <div className="pipeline_header">
                <h3>📋 Reviewing</h3>
                <span className="candidate_count">{pipelineData.reviewing.length}</span>
              </div>
              <div className="pipeline_candidates">
                {pipelineData.reviewing.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="candidate_card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <div className="candidate_actions">
                      <button 
                        className="action_btn scorecard_btn"
                        onClick={() => openInterviewScorecard(candidate, { title: candidate.position })}
                        title="Interview Scorecard"
                      >
                        SC
                      </button>
                      <button 
                        className="action_btn collaboration_btn"
                        onClick={() => openTeamCollaboration(candidate, { title: candidate.position })}
                        title="Team Collaboration"
                      >
                        TC
                      </button>
                      <button 
                        className="action_btn offer_btn"
                        onClick={() => openOfferLetterGenerator(candidate, { title: candidate.position })}
                        title="Generate Offer Letter"
                      >
                        OL
                      </button>
                      <button 
                        className="action_btn cultural_btn"
                        onClick={() => openCulturalFitAssessment(candidate, { title: candidate.position })}
                        title="Cultural Fit Assessment"
                      >
                        CF
                      </button>
                    </div>
                    <div className="candidate_info">
                      <div className="candidate_avatar">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="candidate_details">
                        <h4>{candidate.name}</h4>
                        <p className="candidate_position">{candidate.position}</p>
                        <p className="candidate_company">{candidate.company}</p>
                        <div className="candidate_meta">
                          <span className="match_score">Match: {candidate.matchScore}%</span>
                          <span className="experience">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipeline_column" data-stage="interviewing" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'interviewing')}>
              <div className="pipeline_header">
                <h3>🤝 Interviewing</h3>
                <span className="candidate_count">{pipelineData.interviewing.length}</span>
              </div>
              <div className="pipeline_candidates">
                {pipelineData.interviewing.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="candidate_card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <div className="candidate_actions">
                      <button 
                        className="action_btn scorecard_btn"
                        onClick={() => openInterviewScorecard(candidate, { title: candidate.position })}
                        title="Interview Scorecard"
                      >
                        SC
                      </button>
                      <button 
                        className="action_btn collaboration_btn"
                        onClick={() => openTeamCollaboration(candidate, { title: candidate.position })}
                        title="Team Collaboration"
                      >
                        TC
                      </button>
                      <button 
                        className="action_btn offer_btn"
                        onClick={() => openOfferLetterGenerator(candidate, { title: candidate.position })}
                        title="Generate Offer Letter"
                      >
                        OL
                      </button>
                      <button 
                        className="action_btn cultural_btn"
                        onClick={() => openCulturalFitAssessment(candidate, { title: candidate.position })}
                        title="Cultural Fit Assessment"
                      >
                        CF
                      </button>
                    </div>
                    <div className="candidate_info">
                      <div className="candidate_avatar">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="candidate_details">
                        <h4>{candidate.name}</h4>
                        <p className="candidate_position">{candidate.position}</p>
                        <p className="candidate_company">{candidate.company}</p>
                        <div className="candidate_meta">
                          <span className="match_score">Match: {candidate.matchScore}%</span>
                          <span className="experience">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipeline_column" data-stage="shortlisted" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'shortlisted')}>
              <div className="pipeline_header">
                <h3>⭐ Shortlisted</h3>
                <span className="candidate_count">{pipelineData.shortlisted.length}</span>
              </div>
              <div className="pipeline_candidates">
                {pipelineData.shortlisted.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="candidate_card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <div className="candidate_actions">
                      <button 
                        className="action_btn scorecard_btn"
                        onClick={() => openInterviewScorecard(candidate, { title: candidate.position })}
                        title="Interview Scorecard"
                      >
                        SC
                      </button>
                      <button 
                        className="action_btn collaboration_btn"
                        onClick={() => openTeamCollaboration(candidate, { title: candidate.position })}
                        title="Team Collaboration"
                      >
                        TC
                      </button>
                      <button 
                        className="action_btn offer_btn"
                        onClick={() => openOfferLetterGenerator(candidate, { title: candidate.position })}
                        title="Generate Offer Letter"
                      >
                        OL
                      </button>
                      <button 
                        className="action_btn cultural_btn"
                        onClick={() => openCulturalFitAssessment(candidate, { title: candidate.position })}
                        title="Cultural Fit Assessment"
                      >
                        CF
                      </button>
                    </div>
                    <div className="candidate_info">
                      <div className="candidate_avatar">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="candidate_details">
                        <h4>{candidate.name}</h4>
                        <p className="candidate_position">{candidate.position}</p>
                        <p className="candidate_company">{candidate.company}</p>
                        <div className="candidate_meta">
                          <span className="match_score">Match: {candidate.matchScore}%</span>
                          <span className="experience">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipeline_column" data-stage="hired" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'hired')}>
              <div className="pipeline_header">
                <h3>🎉 Hired</h3>
                <span className="candidate_count">{pipelineData.hired.length}</span>
              </div>
              <div className="pipeline_candidates">
                {pipelineData.hired.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="candidate_card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <div className="candidate_actions">
                      <button 
                        className="action_btn scorecard_btn"
                        onClick={() => openInterviewScorecard(candidate, { title: candidate.position })}
                        title="Interview Scorecard"
                      >
                        SC
                      </button>
                      <button 
                        className="action_btn collaboration_btn"
                        onClick={() => openTeamCollaboration(candidate, { title: candidate.position })}
                        title="Team Collaboration"
                      >
                        TC
                      </button>
                      <button 
                        className="action_btn offer_btn"
                        onClick={() => openOfferLetterGenerator(candidate, { title: candidate.position })}
                        title="Generate Offer Letter"
                      >
                        OL
                      </button>
                      <button 
                        className="action_btn cultural_btn"
                        onClick={() => openCulturalFitAssessment(candidate, { title: candidate.position })}
                        title="Cultural Fit Assessment"
                      >
                        CF
                      </button>
                    </div>
                    <div className="candidate_info">
                      <div className="candidate_avatar">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="candidate_details">
                        <h4>{candidate.name}</h4>
                        <p className="candidate_position">{candidate.position}</p>
                        <p className="candidate_company">{candidate.company}</p>
                        <div className="candidate_meta">
                          <span className="match_score">Match: {candidate.matchScore}%</span>
                          <span className="experience">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="overview_content">
            <div className="metrics_grid">
              <div className="metric_card primary">
                <div className="metric_icon">📈</div>
                <div className="metric_content">
                  <h3>Performance Overview</h3>
                  <div className="metric_stats">
                    <div className="metric_stat">
                      <span className="stat_value">{totalJobs}</span>
                      <span className="stat_label">Active Jobs</span>
                    </div>
                    <div className="metric_stat">
                      <span className="stat_value">{totalApplicants}</span>
                      <span className="stat_label">Total Applicants</span>
                    </div>
                    <div className="metric_stat">
                      <span className="stat_value">{Math.round((totalApplicants / Math.max(totalJobs, 1)) * 10) / 10}</span>
                      <span className="stat_label">Avg. per Job</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric_card success">
                <div className="metric_icon">✅</div>
                <div className="metric_content">
                  <h3>Recent Activity</h3>
                  <div className="activity_list">
                    <div className="activity_item">
                      <span className="activity_icon">👥</span>
                      <span className="activity_text">New applications today</span>
                    </div>
                    <div className="activity_item">
                      <span className="activity_icon">📅</span>
                      <span className="activity_text">{upcomingInterviews.length} upcoming interviews</span>
                    </div>
                    <div className="activity_item">
                      <span className="activity_icon">⏰</span>
                      <span className="activity_text">{urgentJobs} jobs need attention</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric_card warning">
                <div className="metric_icon">⚠️</div>
                <div className="metric_content">
                  <h3>Action Required</h3>
                  <div className="action_list">
                    {urgentJobs > 0 && (
                      <div className="action_item urgent">
                        <span className="action_icon">🚨</span>
                        <span className="action_text">{urgentJobs} jobs expiring soon</span>
                      </div>
                    )}
                    {upcomingInterviews.length > 0 && (
                      <div className="action_item">
                        <span className="action_icon">📋</span>
                        <span className="action_text">Prepare for {upcomingInterviews.length} interviews</span>
                      </div>
                    )}
                    {totalApplicants > 0 && (
                      <div className="action_item">
                        <span className="action_icon">👀</span>
                        <span className="action_text">Review new applications</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 💼 Jobs Tab Content */}
        {activeTab === 'jobs' && (
          <div className="jobs_content">
            {loading ? (
              <div className="section_loading">
                <div className="loading_spinner"></div>
                <p>Loading job postings...</p>
              </div>
            ) : error ? (
              <div className="error_message">
                <span className="error_icon">❌</span>
                <p>{error}</p>
              </div>
            ) : currentJobs.length > 0 ? (
              <div className="enhanced_job_cards">
                {currentJobs.map((job, index) => (
                  <div key={job._id} className="enhanced_job_card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="job_card_header">
                      <div className="job_status_badge" style={{ backgroundColor: getStatusColor(getJobStatus(job.application_deadline)) }}>
                        {getJobStatus(job.application_deadline).charAt(0).toUpperCase() + getJobStatus(job.application_deadline).slice(1)}
                      </div>
                      <h3 className="job_title">{job.job_title}</h3>
                      <div className="job_company">{userDetails?.companyName || "Your Company"}</div>
                    </div>
                    
                    <div className="job_card_details">
                      <div className="job_detail_item">
                        <span className="detail_icon">📍</span>
                        <span className="detail_text">{job.location}</span>
                      </div>
                      <div className="job_detail_item">
                        <span className="detail_icon">💰</span>
                        <span className="detail_text">{job.salary_range || "Not specified"}</span>
                      </div>
                      <div className="job_detail_item">
                        <span className="detail_icon">⏰</span>
                        <span className="detail_text">{job.job_type}</span>
                      </div>
                      <div className="job_detail_item">
                        <span className="detail_icon">🏠</span>
                        <span className="detail_text">{job.remote_option || "On-site"}</span>
                      </div>
                    </div>

                    <div className="job_card_stats">
                      <div className="stat_badge">
                        <span className="stat_icon">👥</span>
                        <span className="stat_value">{job.applicants?.length || 0}</span>
                        <span className="stat_label">Applicants</span>
                      </div>
                      <div className="stat_badge">
                        <span className="stat_icon">👁️</span>
                        <span className="stat_value">{Number(job.views) || 0}</span>
                        <span className="stat_label">Views</span>
                      </div>
                      <div className="stat_badge">
                        <span className="stat_icon">📅</span>
                        <span className="stat_value">{new Date(job.application_deadline).toLocaleDateString()}</span>
                        <span className="stat_label">Deadline</span>
                      </div>
                    </div>

                    <div className="job_card_actions">
                      <button 
                        className="action_button primary"
                        onClick={() => navigate(`/viewtopcandidates/${job._id}`)}
                      >
                        <span className="button_icon">⭐</span>
                        Top Candidates
                      </button>
                      <button 
                        className="action_button secondary"
                        onClick={() => navigate(`/viewallcandidates/${job._id}`)}
                      >
                        <span className="button_icon">👥</span>
                        All Candidates
                      </button>
                      <button 
                        className="action_button edit"
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                      >
                        <span className="button_icon">✏️</span>
                        Edit Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty_state">
                <div className="empty_state_icon">💼</div>
                <h3 className="empty_state_title">No Jobs Posted Yet</h3>
                <p className="empty_state_text">Start building your team by posting your first job!</p>
                <button 
                  className="cta_button"
                  onClick={() => navigate('/job-description')}
                >
                  <span className="button_icon">➕</span>
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        )}

        {/* 🗓️ Interviews Tab Content */}
        {activeTab === 'interviews' && (
          <div className="interviews_content">
            <div className="section_header">
              <h2>🗓️ Upcoming Interviews</h2>
              <p className="section_subtitle">Manage your interview schedule and candidate preparation</p>
            </div>
            
            {upcomingInterviews.length > 0 ? (
              <div className="enhanced_interview_cards">
                {upcomingInterviews.map((candidate, index) => (
                  <div key={index} className="enhanced_interview_card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="interview_card_header">
                      <div className="candidate_avatar">
                        {candidate.profileImage ? (
                          <img src={candidate.profileImage} alt="Candidate" />
                        ) : (
                          <div className="avatar_placeholder">
                            {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="interview_info">
                        <h3 className="candidate_name">{candidate.firstName} {candidate.lastName}</h3>
                        <p className="job_position">{candidate.jobTitle}</p>
                        <div className="interview_time">
                          <span className="time_icon">🕐</span>
                          <span className="time_text">
                            {new Date(candidate.interviewDate).toLocaleDateString()} at {new Date(candidate.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="interview_mode_badge">
                        {candidate.interviewMode || 'In-person'}
                      </div>
                    </div>
                    
                    <div className="interview_card_actions">
                      <button className="action_button primary">
                        <span className="button_icon">📋</span>
                        View Profile
                      </button>
                      <button className="action_button secondary">
                        <span className="button_icon">📞</span>
                        Reschedule
                      </button>
                      <button className="action_button success">
                        <span className="button_icon">✅</span>
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty_state">
                <div className="empty_state_icon">🗓️</div>
                <h3 className="empty_state_title">No Upcoming Interviews</h3>
                <p className="empty_state_text">Start shortlisting candidates to schedule interviews!</p>
              </div>
            )}
          </div>
        )}

        {/* 📈 Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="analytics_content">
            <div className="section_header">
              <h2>📈 Recruitment Analytics</h2>
              <p className="section_subtitle">Track your recruitment performance and insights</p>
                             <button 
                 className="view_full_analytics_btn"
                 onClick={() => navigate('/analytics-dashboard')}
               >
                 View Full Analytics Dashboard →
               </button>
               <button 
                 className="view_full_analytics_btn diversity_btn"
                 onClick={() => setShowDiversityAnalytics(true)}
                 style={{ marginLeft: '15px' }}
               >
                 🌍 Cultural Diversity Analytics →
               </button>
            </div>
            
            <div className="analytics_grid">
              <div className="analytics_card">
                <h3>Application Trends</h3>
                <div className="chart_placeholder">
                  <span className="chart_icon">📊</span>
                  <p>
                    {totalApplications30 > 0
                      ? `${totalApplications30} applications in last 30 days`
                      : 'No applications in last 30 days'}
                  </p>
                </div>
              </div>
              
              <div className="analytics_card">
                <h3>Job Performance</h3>
                <div className="chart_placeholder">
                  <span className="chart_icon">📈</span>
                  <p>
                    {totalViews30 > 0
                      ? `${totalViews30} views • ${(overallConversionRate).toFixed(1)}% conversion`
                      : 'No views recorded'}
                  </p>
                </div>
              </div>
              
              <div className="analytics_card">
                <h3>Candidate Quality</h3>
                <div className="chart_placeholder">
                  <span className="chart_icon">🎯</span>
                  <p>
                    {totalApplications30 > 0
                      ? `${highQualityCount} high-quality • ${highQualityRate.toFixed(1)}%`
                      : 'No data yet'}
                  </p>
                </div>
              </div>
              
              <div className="analytics_card">
                <h3>Time to Hire</h3>
                <div className="chart_placeholder">
                  <span className="chart_icon">⏱️</span>
                  <p>
                    {avgDaysToFill > 0
                      ? `${avgDaysToFill.toFixed(1)} days avg since posting`
                      : 'Not enough data'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📄 CV Browser Tab Content */}
        {activeTab === 'cv-browser' && (
          <div className="cv_browser_content">
            <div className="section_header">
              <h2>📄 CV Browser</h2>
              <p className="section_subtitle">Browse available CVs without posting jobs - Direct access to talent pool</p>
              <div className="cv_browser_info">
                <div className="info_card">
                  <span className="info_icon">🔍</span>
                  <div className="info_content">
                    <h4>Search & Filter</h4>
                    <p>Find candidates by skills, experience, location, and more</p>
                  </div>
                </div>
                <div className="info_card">
                  <span className="info_icon">📊</span>
                  <div className="info_content">
                    <h4>Match Scores</h4>
                    <p>See AI-powered match scores for each candidate</p>
                  </div>
                </div>
                <div className="info_card">
                  <span className="info_icon">💼</span>
                  <div className="info_content">
                    <h4>Direct Access</h4>
                    <p>View CVs without waiting for job applications</p>
                  </div>
                </div>
              </div>
              
              <button 
                className="cv_browser_launch_btn"
                onClick={() => navigate('/cv-browser')}
              >
                🚀 Launch CV Browser →
              </button>
            </div>
          </div>
        )}
        </div> {/* Closing main_content */}
      </div>
      
             {/* Productivity Tools Modals */}
       {showInterviewScorecard && (
         <InterviewScorecard
           candidateId={selectedCandidate?.id}
           jobId={selectedJob?._id}
           onSave={handleScorecardSave}
           onClose={closeProductivityTools}
         />
       )}
       
       {showTeamCollaboration && (
         <TeamCollaboration
           candidateId={selectedCandidate?.id}
           jobId={selectedJob?._id}
           onClose={closeProductivityTools}
         />
       )}
       
       {showOfferLetterGenerator && (
         <OfferLetterGenerator
           candidateId={selectedCandidate?.id}
           jobId={selectedJob?._id}
           candidateData={selectedCandidate}
           onClose={closeProductivityTools}
           onSend={handleOfferLetterSend}
         />
       )}

       {/* Cultural Fit Assessment Modals */}
       {showCulturalProfileBuilder && (
         <CulturalProfileBuilder
           onComplete={(profile) => {
             setCandidateCulturalProfile(profile);
             setShowCulturalProfileBuilder(false);
           }}
           onClose={() => setShowCulturalProfileBuilder(false)}
         />
       )}

       {showCompanyCultureAssessment && (
         <CompanyCultureAssessment
           companyData={userDetails}
           onComplete={(culture) => {
             setCompanyCultureData(culture);
             setShowCompanyCultureAssessment(false);
           }}
           onClose={() => setShowCompanyCultureAssessment(false)}
         />
       )}

       {showCulturalFitScore && (
         <CulturalFitScore
           candidateProfile={candidateCulturalProfile || {
             communication_style: 'mixed',
             leadership_approach: 'collaborative',
             work_environment: 'creative',
             team_dynamics: 'cross_functional',
             language_preference: 'bilingual'
           }}
           companyCulture={companyCultureData || {
             communication_style: 'formal',
             leadership_approach: 'hierarchical',
             work_environment: 'stable',
             team_dynamics: 'specialized',
             language_policy: 'english'
           }}
           onClose={() => setShowCulturalFitScore(false)}
         />
       )}

       {showDiversityAnalytics && (
         <DiversityAnalytics
           onClose={() => setShowDiversityAnalytics(false)}
         />
       )}
      
    </div>
  );
};

export default RecruiterDashboard;
