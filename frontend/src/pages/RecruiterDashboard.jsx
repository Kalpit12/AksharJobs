import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl } from "../config/api";
import apiService from "../services/apiService";
import ModernCompanyProfile from "../components/ModernCompanyProfile";
import SplitText from "../components/SplitText";
import AnimatedCounter from "../components/AnimatedCounter";
import RecruiterStatsMagicBento from "../components/RecruiterStatsMagicBento";

import PremiumPrompt from "../components/PremiumPrompt";
import InterviewScorecard from "../components/InterviewScorecard";
import TeamCollaboration from "../components/TeamCollaboration";
import OfferLetterGenerator from "../components/OfferLetterGenerator";
import CulturalProfileBuilder from "../components/CulturalProfileBuilder";
import CompanyCultureAssessment from "../components/CompanyCultureAssessment";
import CulturalFitScore from "../components/CulturalFitScore";
import DiversityAnalytics from "../components/DiversityAnalytics";
import GeminiChatbot from "../components/GeminiChatbot";

import { analyticsApi } from "../api/analyticsApi";
import "../styles/RecruiterDashboard.css";
import Header from "../components/Header";

// New components for modern dashboard
import PostJobModal from "../components/PostJobModal";
import CVBrowser from "../components/CVBrowser.jsx";
import ApplicationTracker from "../components/ApplicationTracker";
import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import AIJobDescriptionGenerator from "../components/AIJobDescriptionGenerator";
import AIApplicationReview from "../components/AIApplicationReview";
import AIOfferPredictor from "../components/AIOfferPredictor";

// New Enhanced Components
import QuickActionsWidget from "../components/QuickActionsWidget";
import HiringFunnelVisualization from "../components/HiringFunnelVisualization";
import NotificationCenter from "../components/NotificationCenter";
import DarkModeToggle from "../components/DarkModeToggle";
import ActivityFeed from "../components/ActivityFeed";
import ConfettiAnimation from "../components/ConfettiAnimation";
import FloatingActionMenu from "../components/FloatingActionMenu";
import EnhancedSkeletonLoader from "../components/EnhancedSkeletonLoader";
import ParticleEffects from "../components/ParticleEffects";
import Card3D from "../components/Card3D";

const RecruiterDashboard = () => {
  const { user, isAuthenticated, isRecruiter } = useAuth();
  const navigate = useNavigate();
  
  // Helper function to get display name
  const getDisplayName = () => {
    // Try localStorage first (most reliable)
    const storedFirstName = localStorage.getItem('userFirstName');
    const storedLastName = localStorage.getItem('userLastName');
    
    if (storedFirstName && storedLastName && storedFirstName !== 'undefined' && storedLastName !== 'undefined') {
      return `${storedFirstName} ${storedLastName}`;
    }
    
    if (userDetails?.name) {
      return userDetails.name;
    }
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName} ${userDetails.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Sarah Johnson';
  };
  
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  
  const userId = localStorage.getItem("userId") || user?.userId;

  // Trigger confetti on successful actions
  const triggerSuccessAnimation = () => {
    setConfettiTrigger(prev => prev + 1);
  };

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
        // If API fails, try to use user data from auth context
        if (user) {
          setUserDetails(user);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    } else {
      if (user) {
        setUserDetails(user);
      }
      setIsLoadingProfile(false);
    }
  }, [userId, user]);

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

  // Close profile dropdown when clicking outside

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Use the new endpoint that returns all applications with user and job details
        const response = await axios.get(buildApiUrl('/api/applications/all'));
        const applications = response.data.applications || [];
        
        // The applications already have user and job details, so we can use them directly
        const enrichedApplications = applications.map(application => ({
          ...application,
          // Map the fields to match what the component expects
          fullName: application.applicant_name,
          email: application.applicant_email,
          phone: application.applicant_phone,
          jobTitle: application.job_title,
          companyName: application.company_name,
          appliedDate: application.applied_at || application.created_at,
          // Keep original fields for compatibility
          userId: application.applicant_id,
          jobId: application.job_id
        }));

        setApplications(enrichedApplications);
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
    // Handle scorecard save logic here
  };

  const handleOfferLetterSend = (offerData) => {
    // Handle offer letter send logic here
  };

  // Function to get interview details for a candidate
  const getInterviewDetails = (candidateId) => {
    return interviews.find(interview => interview.candidateId === candidateId);
  };
  
  // Show loading skeleton while data is loading
  if (loading && jobPostings.length === 0) {
    return (
      <React.Fragment>
        <Header />
        <div className="recruiter_dashboard_wrapper">
          <div className="recruiter_dashboard_container">
            <EnhancedSkeletonLoader type="dashboard" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header />
      
      {/* Particle Background Effect */}
      <ParticleEffects density={30} color="#667eea" maxSpeed={0.3} interactive={true} />
      
      {/* Confetti Animation */}
      <ConfettiAnimation trigger={confettiTrigger} duration={3000} particleCount={100} />
      
      <div className="recruiter_dashboard_wrapper">
        <div className="recruiter_dashboard_container particle-container">
        
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
              <ModernCompanyProfile userDetails={userDetails} />
              
              {/* Dark Mode Toggle & Notifications */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
                <DarkModeToggle />
                <NotificationCenter />
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
                className="nav-item"
                onClick={() => navigate('/post-job')}
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
                </div>
              </div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            {/* Overview Tab */}
            {currentView === 'overview' && (
              <div className="overview-content">
                <div className="content-header">
                  <SplitText
                    text={`Welcome back, ${getDisplayName() || 'Sarah Johnson'}! 👋`}
                    tag="h1"
                    className="welcome-title"
                    delay={50}
                    duration={0.8}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 60, rotationX: 90 }}
                    to={{ opacity: 1, y: 0, rotationX: 0 }}
                    threshold={0.1}
                    rootMargin="-50px"
                    textAlign="left"
                    onLetterAnimationComplete={() => {
                      // Animation completed
                    }}
                  />
                  <SplitText
                    text="Ready to find your next great hire? Let's get started!"
                    tag="p"
                    className="welcome-subtitle"
                    delay={200}
                    duration={0.6}
                    ease="power2.out"
                    splitType="words"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-50px"
                    textAlign="left"
                  />
              </div>

                {/* Quick Actions Widget */}
                <QuickActionsWidget
                  onPostJob={() => navigate('/post-job')}
                  onViewCandidates={() => setCurrentView('cv-browser')}
                  onScheduleInterview={() => console.log('Schedule Interview')}
                  onViewAnalytics={() => setCurrentView('analytics')}
                />

                {/* Dashboard Grid Layout */}
                <div className="dashboard-grid-layout">
                  {/* Left Column - Stats */}
                  <div className="stats-column">
                    <Card3D intensity={10}>
                      <RecruiterStatsMagicBento 
                        jobPostings={jobPostings}
                        applications={applications}
                        interviews={interviews}
                        textAutoHide={true}
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={true}
                        enableMagnetism={true}
                        clickEffect={true}
                        spotlightRadius={200}
                        particleCount={8}
                        glowColor="132, 0, 255"
                      />
                    </Card3D>
                  </div>
                  
                </div>

                {/* Hiring Funnel Visualization */}
                <HiringFunnelVisualization applications={applications} />

                {/* Activity Feed */}
                <ActivityFeed />

                    
                {/* AI Features Section */}
                <div className="ai-features-section">
                  <h2>🤖 AI-Powered Tools</h2>
                  <div className="ai-tools-grid">
                    <div className="ai-tool-card">
                      <AIJobDescriptionGenerator 
                        onGenerated={(data) => {
                          console.log('JD generated:', data);
                          // Can be used in post job form
                        }}
                      />
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
              // Trigger success animation
              triggerSuccessAnimation();
            }}
          />
        )}

        {/* Floating Action Menu */}
        <FloatingActionMenu
          onPostJob={() => navigate('/post-job')}
          onAIAssist={() => console.log('AI Assist')}
          onBulkAction={() => console.log('Bulk Action')}
          onExport={() => console.log('Export Data')}
        />
      
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
