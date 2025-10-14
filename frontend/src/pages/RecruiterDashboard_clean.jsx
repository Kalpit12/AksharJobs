import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl } from "../config/api";

import PremiumPrompt from "../components/PremiumPrompt";
import InterviewScorecard from "../components/InterviewScorecard";
import TeamCollaboration from "../components/TeamCollaboration";
import OfferLetterGenerator from "../components/OfferLetterGenerator";
import CulturalProfileBuilder from "../components/CulturalProfileBuilder";
import CompanyCultureAssessment from "../components/CompanyCultureAssessment";
import CulturalFitScore from "../components/CulturalFitScore";
import DiversityAnalytics from "../components/DiversityAnalytics";
import PromoCodeCard from "../components/PromoCodeCard";
import UsePromoCode from "../components/UsePromoCode";
import AdvertisementSystem from "../components/AdvertisementSystem";
import GeminiChatbot from "../components/GeminiChatbot";

import { analyticsApi } from "../api/analyticsApi";
import "../styles/RecruiterDashboard.css";
import "../styles/PromoSection.css";
import Header from "../components/Header";

// New components for modern dashboard
import PostJobModal from "../components/PostJobModal";
import CVBrowser from "../components/CVBrowser/index.jsx";
import ApplicationTracker from "../components/ApplicationTracker";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";

const RecruiterDashboard = () => {
  const { user, isAuthenticated, isRecruiter } = useAuth();
  const navigate = useNavigate();
  
  // All hooks must be called before any conditional logic
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("deadline");
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  
  // Modern Dashboard State
  const [currentView, setCurrentView] = useState("overview");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showCVBrowser, setShowCVBrowser] = useState(false);
  const [showApplicationTracker, setShowApplicationTracker] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
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

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${userId}`));
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Fetch job postings
  const fetchJobPostings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`/api/jobs/jobs_by_user/${userId}`));
      setJobPostings(response.data || []);
    } catch (err) {
      setError("Failed to fetch job postings");
      console.error("Error fetching job postings:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const jobsResponse = await axios.get(buildApiUrl(`/api/jobs/jobs_by_user/${userId}`));
        const jobs = jobsResponse.data;
        let allApplications = [];

        for (const job of jobs) {
          const response = await axios.get(buildApiUrl(`/api/applications/get_applications?jobId=${job._id}`));
          const jobApplications = response.data.applications || [];
          const enrichedApplications = await Promise.all(
            jobApplications.map(async (application) => {
              try {
                const userResponse = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${application.userId}`));
                const jobResponse = await axios.get(buildApiUrl(`/api/jobs/job/${application.jobId}`));
                
                if (userResponse.data && typeof userResponse.data === 'object' && Object.keys(userResponse.data).length > 0) {
                  return { 
                    ...application, 
                    ...userResponse.data, 
                    jobTitle: jobResponse.data.job_title,
                    appliedDate: application.created_at
                  };
                } else {
                  return application;
                }
              } catch (error) {
                console.error('Error fetching user or job data:', error);
                return application;
              }
            })
          );

          allApplications = [...allApplications, ...enrichedApplications.filter(Boolean)];
        }

        setApplications(allApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  // Filter and sort jobs
  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || job.job_type === filterType;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortType) {
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      case "applicants":
        return (b.total_applications || 0) - (a.total_applications || 0);
      case "views":
        return (b.views || 0) - (a.views || 0);
      case "created":
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return 0;
    }
  });

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
    const storedCompanyCulture = loadStoredJSON('companyCulture');

    if (storedCandidateProfile) {
      setCandidateCulturalProfile(storedCandidateProfile);
    } else {
      const generatedProfile = generateProfileFromCandidate(candidate);
      setCandidateCulturalProfile(generatedProfile);
    }

    if (storedCompanyCulture) {
      setCompanyCultureData(storedCompanyCulture);
    } else {
      const defaultCulture = defaultCompanyCultureFromUser(userDetails);
      setCompanyCultureData(defaultCulture);
    }

    setShowCulturalFitScore(true);
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

  const handleScorecardSave = (scorecardData) => {
    console.log("Scorecard saved:", scorecardData);
    // Handle scorecard save logic here
  };

  const handleOfferLetterSend = (offerData) => {
    console.log("Offer letter sent:", offerData);
    // Handle offer letter send logic here
  };

  // Function to get interview details for a candidate
  const getInterviewDetails = (candidateId) => {
    return interviews.find(interview => interview.candidateId === candidateId);
  };
  
  return (
    <React.Fragment>
      <Header />
      
      {/* 🚨 ATTENTION-GRABBING NOTIFICATION BANNER */}
      {showBanner && (
        <div className="attention-banner">
          <div className="banner-content">
            <div className="banner-icon">🚨</div>
            <div className="banner-text">
              <strong>BREAKING NEWS:</strong> Access 70% MORE Kenyan talent with our revolutionary Swahili & Local Language Resume Analysis! 
              <span className="banner-highlight"> NO OTHER PLATFORM HAS THIS!</span>
            </div>
            <div className="banner-action">
              <button className="banner-btn" onClick={() => navigate('/local-language-analysis')}>Learn More</button>
            </div>
            <button 
              className="banner-close-btn" 
              onClick={() => setShowBanner(false)}
              title="Close banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="recruiter_dashboard_wrapper">
        <div className="recruiter_dashboard_container">
        
        {/* Premium Prompt - Modern Design */}
        {showPremiumPrompt && (
          <PremiumPrompt 
            userType="recruiter"
            onClose={() => setShowPremiumPrompt(false)}
          />
        )}
        
        {/* Modern Dashboard Layout */}
        <div className="modern-dashboard">
          {/* Sidebar Navigation */}
          <div className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="user-profile">
                <div className="user-avatar">
                  <img src={userDetails?.avatar || '/default-avatar.png'} alt={userDetails?.name} />
                </div>
                <div className="user-info">
                  <h3>{userDetails?.name || 'Recruiter'}</h3>
                  <p>{userDetails?.company || 'Company'}</p>
                </div>
              </div>
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
                onClick={() => setCurrentView('overview')}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Overview</span>
              </button>
              
              <button 
                className={`nav-item ${currentView === 'post-job' ? 'active' : ''}`}
                onClick={() => setShowPostJobModal(true)}
              >
                <span className="nav-icon">➕</span>
                <span className="nav-text">Post Job</span>
              </button>
              
              <button 
                className={`nav-item ${currentView === 'cv-browser' ? 'active' : ''}`}
                onClick={() => setCurrentView('cv-browser')}
              >
                <span className="nav-icon">📄</span>
                <span className="nav-text">CV Browser</span>
              </button>
              
              <button 
                className={`nav-item ${currentView === 'application-tracker' ? 'active' : ''}`}
                onClick={() => setCurrentView('application-tracker')}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Application Tracker</span>
              </button>
              
              <button 
                className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => setCurrentView('analytics')}
              >
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </button>
            </nav>
            
            <div className="sidebar-footer">
              <AdvertisementSystem placement="sidebar" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            {/* Overview Tab */}
            {currentView === 'overview' && (
              <div className="overview-content">
                <div className="content-header">
                  <h1>Welcome back, {userDetails?.name || 'Recruiter'}! 👋</h1>
                  <p>Ready to find your next great hire? Let's get started!</p>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <h3>{jobPostings.length}</h3>
                      <p>Active Jobs</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <h3>{applications.length}</h3>
                      <p>Total Applications</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <h3>{interviews.length}</h3>
                      <p>Scheduled Interviews</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                      <h3>{Math.round(applications.length / Math.max(jobPostings.length, 1))}</h3>
                      <p>Avg. Applications/Job</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                  <h2>Recent Activity</h2>
                  <div className="activity-list">
                    {applications.slice(0, 5).map((app, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">👤</div>
                        <div className="activity-content">
                          <p><strong>{app.name}</strong> applied for <strong>{app.jobTitle}</strong></p>
                          <span className="activity-time">{new Date(app.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performing Jobs */}
                <div className="jobs-section">
                  <h2>Top Performing Jobs</h2>
                  <div className="jobs-list">
                    {jobPostings
                      .filter(job => job.total_applications > 0)
                      .sort((a, b) => b.total_applications - a.total_applications)
                      .slice(0, 3)
                      .map((job, index) => (
                        <div key={index} className="job-item">
                          <div className="job-title">{job.job_title}</div>
                          <div className="job-applications">{job.total_applications} applications</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* CV Browser Tab */}
            {currentView === 'cv-browser' && (
              <div className="cv-browser-content">
                <div className="content-header">
                  <h1>📄 CV Browser</h1>
                  <p>Browse and download candidate profiles and resumes</p>
                </div>
                <CVBrowser />
              </div>
            )}

            {/* Application Tracker Tab */}
            {currentView === 'application-tracker' && (
              <div className="application-tracker-content">
                <div className="content-header">
                  <h1>📝 Application Tracker</h1>
                  <p>Monitor and manage candidate applications in real-time</p>
                </div>
                <ApplicationTracker />
              </div>
            )}

            {/* Analytics Tab */}
            {currentView === 'analytics' && (
              <div className="analytics-content">
                <AnalyticsDashboard />
              </div>
            )}
          </div>
        </div>

        {/* Post Job Modal */}
        {showPostJobModal && (
          <PostJobModal
            isOpen={showPostJobModal}
            onClose={() => setShowPostJobModal(false)}
            onJobPosted={() => {
              // Refresh job postings
              fetchJobPostings();
            }}
          />
        )}

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

        {/* AI Chatbot */}
        <GeminiChatbot userType="recruiter" />

      </div>
    </div>
    </React.Fragment>
  );
};

export default RecruiterDashboard;
