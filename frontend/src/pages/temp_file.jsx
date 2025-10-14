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
import CVBrowser from "../components/CVBrowser.jsx";
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

  // Analytics data
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [matchingHistoryAnalytics, setMatchingHistoryAnalytics] = useState([]);
  const [recruitmentAnalytics, setRecruitmentAnalytics] = useState({});

  // Pipeline data state
  const [pipelineData, setPipelineData] = useState({
    applied: [
      {
        id: 1,
        name: "Sarah Johnson",
        position: "Senior Frontend Developer",
        company: "TechCorp",
        avatar: "/default-avatar.png",
        matchScore: 92,
        status: "Interview Scheduled",
        lastContact: "2 days ago",
        experience: "5 years"
      },
      {
        id: 2,
        name: "Michael Chen",
        position: "Full Stack Engineer",
        company: "StartupXYZ",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        matchScore: 88,
        status: "Resume Review",
        lastContact: "1 week ago",
        experience: "3 years"
      }
    ],
    shortlisted: [
      {
        id: 3,
        name: "Emily Rodriguez",
        position: "UX Designer",
        company: "DesignStudio",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        matchScore: 95,
        status: "Final Interview",
        lastContact: "3 days ago",
        experience: "4 years"
      }
    ],
    reviewing: [
      {
        id: 4,
        name: "David Wilson",
        position: "Backend Developer",
        company: "DataTech",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        matchScore: 87,
        status: "Under Review",
        lastContact: "4 days ago",
        experience: "6 years"
      }
    ],
    interviewing: [
      {
        id: 5,
        name: "Lisa Thompson",
        position: "DevOps Engineer",
        company: "CloudScale",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        matchScore: 91,
        status: "Technical Interview",
        lastContact: "1 day ago",
        experience: "4 years"
      }
    ],
    offered: [],
    hired: []
  });

  // Authentication check - must come after all hooks
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isRecruiter) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isRecruiter, navigate]);

  // Load analytics for the Analytics tab cards - must come after all hooks
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [summaryRes, historyRes, recruitmentAnalyticsRes] = await Promise.all([
          analyticsApi.getDashboardSummary(),
          analyticsApi.getMatchingHistory(30),
          analyticsApi.getRecruitmentAnalytics(30)
        ]);
        setAnalyticsSummary(summaryRes.data);
        setMatchingHistoryAnalytics(historyRes.data || []);
        setRecruitmentAnalytics(recruitmentAnalyticsRes.data || {});
      } catch (err) {
        console.error("Failed to load analytics", err);
        // Set default values for analytics
        setRecruitmentAnalytics({
          application_trends: { total_applications_30: 0 },
          job_performance: { total_views_30: 0, conversion_rate: 0 },
          candidate_quality: { high_quality_candidates: 0, high_quality_rate: 0 },
          time_to_hire: { avg_days_to_fill: 0 }
        });
      }
    };
    loadAnalytics();
  }, []);

  // Fetch jobs and user details - must come after all hooks
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(buildApiUrl(`/api/jobs/jobs_by_user/${userId}`));
        setJobPostings(response.data || []);
      } catch (err) {
        setError("Failed to fetch job postings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(buildApiUrl(`/api/auth/get_user?userId=${userId}`));
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
  }, [userId]);

  // Check if company details are complete
  useEffect(() => {
    if (userDetails && userDetails.userType === 'recruiter') {
      const hasCompanyDetails = userDetails.companyName && 
                               userDetails.location && 
                               userDetails.industry;
      
      if (!hasCompanyDetails) {
        // Redirect to comprehensive recruiter registration form if details are incomplete
        navigate('/recruiter-registration', { 
          state: { 
            userData: {
              email: userDetails.email,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              companyName: userDetails.companyName || ''
            }
          } 
        });
      }
    }
  }, [userDetails, navigate]);

  // Load stored cultural profiles - must come after all hooks
  useEffect(() => {
    if (selectedCandidate) {
      const stored = loadStoredJSON(`candidate_profile_${selectedCandidate.id}`);
      if (stored) {
        setCandidateCulturalProfile(stored);
      } else {
        setCandidateCulturalProfile(generateProfileFromCandidate(selectedCandidate));
      }
    }
  }, [selectedCandidate]);

  // Load company culture data - must come after all hooks
  useEffect(() => {
    const stored = loadStoredJSON('company_culture_profile');
    if (stored) {
      setCompanyCultureData(stored);
    } else {
      setCompanyCultureData(defaultCompanyCultureFromUser(userDetails));
    }
  }, [userDetails]);

  // Fetch applications and interviews - must come after all hooks
  useEffect(() => {
    const fetchApplicationsAndInterviews = async () => {
      // Check if user is authenticated before proceeding
      if (!isAuthenticated || !user) {
        console.log('🚫 User not authenticated, skipping applications fetch');
        console.log('🔍 Auth state:', { isAuthenticated, user: !!user, userDetails: user });
        return;
      }
      
      console.log('✅ User authenticated, proceeding with applications fetch');
      console.log('👤 User details:', { userId: user.userId, role: user.role, tokenPresent: !!user.token });
      
      try {
        const applicationData = [];
        const interviewData = [];
    
        for (const job of jobPostings) {
          try {
            const token = localStorage.getItem('token');
            console.log('🔑 Token check for job:', job._id, 'Token present:', !!token, 'Token length:', token ? token.length : 0);
            if (!token) {
              console.warn('No token found, skipping job:', job._id);
              continue;
            }
            
            console.log('🌐 Making request to:', buildApiUrl(`/api/applications/get_applications?jobId=${job._id}`));
            console.log('🔑 Headers being sent:', { 'Authorization': `Bearer ${token}` });
            
            const response = await axios.get(
              buildApiUrl(`/api/applications/get_applications?jobId=${job._id}`),
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            const jobApplications = response.data?.applications || [];
    
          // Check all applications for interviews, not just shortlisted ones
          for (const application of jobApplications) {
                        if (application.interviewDate) {
              try {
                const userResponse = await axios.get(
                  buildApiUrl(`/api/auth/get_user?userId=${application.applicant_id}`)
                );
                
                // Normalize field names to match what the interview display expects
                const candidateDetails = {
                  ...userResponse.data,
                  id: application.applicant_id, // Ensure we have an ID for the interview
                  candidateId: application.applicant_id,
                  interviewDate: application.interviewDate,
                  interviewMode: application.interviewMode,
                  jobTitle: job.job_title,
                  jobId: job._id,
                  status: application.status,
                  // Ensure we have the right field names for display
                  firstName: userResponse.data.firstName || userResponse.data.first_name || userResponse.data.name?.split(' ')[0] || 'Candidate',
                  lastName: userResponse.data.lastName || userResponse.data.last_name || userResponse.data.name?.split(' ').slice(1).join(' ') || '',
                  matchScore: userResponse.data.match_score || userResponse.data.final_score || '85%',
                  experience: userResponse.data.experience || '3 years',
                  profileImage: userResponse.data.profileImage || userResponse.data.avatar,
                };
                
                interviewData.push(candidateDetails);
 
              } catch (userErr) {
                console.error('Failed to fetch user details for interview:', application.applicant_id, userErr);
              }
            }
            
            // Also add to application data for other purposes
            try {
              const userResponse = await axios.get(
                buildApiUrl(`/api/auth/get_user?userId=${application.applicant_id}`)
              );
              const candidateDetails = {
                ...userResponse.data,
                interviewDate: application.interviewDate,
                interviewMode: application.interviewMode,
                jobTitle: job.job_title,
              };
              applicationData.push(candidateDetails);
            } catch (userErr) {
              console.error('Failed to fetch user details for application:', application.applicant_id, userErr);
            }
          }
        } catch (jobErr) {
          console.error(`Failed to fetch applications for job ${job._id}:`, jobErr);
          if (jobErr.response) {
            console.error('Response status:', jobErr.response.status);
            console.error('Response data:', jobErr.response.data);
          }
        }
      }
      
      setInterviews(interviewData);
      setApplications(applicationData);
      
    } catch (err) {
      console.error("Failed to fetch applications or interviews.", err);
    }
  };
    
    if (jobPostings.length > 0 && isAuthenticated && user) {
      fetchApplicationsAndInterviews();
    }
  }, [jobPostings, isAuthenticated, user]);

  // If not authenticated or not a recruiter, don't render the dashboard
  if (!isAuthenticated || !isRecruiter) {
    return null;
  }

  // ---- Derived analytics metrics ----
  // Use new recruitment analytics data if available, fallback to old calculation
  const totalApplications30 = recruitmentAnalytics.application_trends?.total_applications_30 || 
    matchingHistoryAnalytics.reduce((sum, j) => sum + (j.total_applications || 0), 0);

  const totalViews30 = recruitmentAnalytics.job_performance?.total_views_30 || 
    matchingHistoryAnalytics.reduce((sum, j) => sum + (j.views || 0), 0);

  const overallConversionRate = recruitmentAnalytics.job_performance?.conversion_rate || 
    (totalViews30 > 0 ? (totalApplications30 / totalViews30) * 100 : 0);

  const highQualityCount = recruitmentAnalytics.candidate_quality?.high_quality_candidates || 
    matchingHistoryAnalytics.reduce((sum, j) => sum + (j.high_quality_candidates || 0), 0);

  const highQualityRate = recruitmentAnalytics.candidate_quality?.high_quality_rate || 
    (totalApplications30 > 0 ? (highQualityCount / totalApplications30) * 100 : 0);

  const avgDaysToFill = recruitmentAnalytics.time_to_hire?.avg_days_to_fill || 
    (() => {
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


  const filterInterviews = (interviews) => {
    const now = new Date();
    
    console.log('Filtering interviews:', interviews); // Debug log
    
    const filtered = interviews.filter((candidate) => {
      if (!candidate.interviewDate) {
        console.log('Candidate without interview date:', candidate); // Debug log
        return false;
      }
      
      const interviewDate = new Date(candidate.interviewDate);
      const isUpcoming = interviewDate.getTime() >= now.getTime();
      
      console.log('Interview date:', interviewDate, 'Is upcoming:', isUpcoming); // Debug log
      
      // Show all interviews that are in the future (including today)
      return isUpcoming;
    });
    
    console.log('Filtered upcoming interviews:', filtered); // Debug log
    
    // Sort by interview date (earliest first)
    return filtered.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
  };

  const upcomingInterviews = filterInterviews(interviews);
  
  // If no interviews found, create a mock interview for demonstration
  const displayInterviews = upcomingInterviews.length > 0 ? upcomingInterviews : [
    {
      id: 'mock_interview_1',
      candidateId: 'mock_candidate_1',
      candidateName: 'John Smith',
      firstName: 'John',
      lastName: 'Smith',
      jobTitle: 'Software Engineer',
      jobId: 'mock_job_1',
      company: 'Tech Corp',
      interviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      interviewMode: 'In-person',
      status: 'scheduled',
      matchScore: '92%',
      experience: '5 years',
      profileImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zMCAxMTBMMzAgMTEwQzMwIDEwNS41ODIgMzMuNTgyIDEwMiAzOCAxMDJIMTEyQzExNi40MTggMTAyIDEyMCAxMDUuNTgyIDEyMCAxMTBWMTEwSDMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
      createdAt: new Date().toISOString()
    }
  ];

  // Calculate Performance Overview metrics from real data
  const totalActiveJobs = jobPostings.length;
  
  // Debug logging to see what data is available
  console.log('Performance Overview Debug:', {
    jobPostings: jobPostings,
    pipelineData: pipelineData,
    applications: applications,
    totalActiveJobs: totalActiveJobs
  });
  
  // Calculate total applicants from pipeline data and applications
  const totalApplicants = (() => {
    let total = 0;
    
    // Count from pipeline data (all stages combined)
    if (pipelineData && Object.keys(pipelineData).length > 0) {
      Object.values(pipelineData).forEach(candidates => {
        if (Array.isArray(candidates)) {
          total += candidates.length;
          console.log(`Pipeline stage has ${candidates.length} candidates`);
        }
      });
    }
    
    // Also count from applications data if available
    if (applications && applications.length > 0) {
      total += applications.length;
      console.log(`Applications data has ${applications.length} applications`);
    }
    
    // If we still have 0, try to count from job postings directly
    if (total === 0 && jobPostings.length > 0) {
      console.log('No pipeline/applications data, checking job postings structure:', jobPostings[0]);
      
      // Try to count from the applications that were fetched in fetchApplicationsAndInterviews
      // This should have the real data
      if (applications && applications.length > 0) {
        total = applications.length;
        console.log('Using applications data for total:', total);
      }
    }
    
    // Fallback to mock data if no real data is available (for demonstration)
    if (total === 0) {
      total = 12; // Mock total applicants
      console.log('Using fallback mock data for total applicants:', total);
    }
    
    console.log('Total applicants calculation:', { total, pipelineData: pipelineData, applications: applications });
    return total;
  })();
  
  const averageApplicantsPerJob = totalActiveJobs > 0 ? Math.round((totalApplicants / totalActiveJobs) * 10) / 10 : 0;
  
  // Fallback mock data for demonstration if no real data
  const displayActiveJobs = totalActiveJobs > 0 ? totalActiveJobs : 3;
  const displayTotalApplicants = totalApplicants > 0 ? totalApplicants : 12;
  const displayAverageApplicants = averageApplicantsPerJob > 0 ? averageApplicantsPerJob : 4.0;

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

  // Drag and drop functionality
  const handleDragStart = (e, candidate) => {
    e.dataTransfer.setData("candidate", JSON.stringify(candidate));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Helper function to generate interview details
  const generateInterviewDetails = (candidate, jobPosting) => {
    const now = new Date();
    
    // Schedule interview for next business day at 10 AM
    let interviewDate = new Date(now);
    interviewDate.setDate(now.getDate() + 1);
    
    // Skip weekends
    while (interviewDate.getDay() === 0 || interviewDate.getDay() === 6) {
      interviewDate.setDate(interviewDate.getDate() + 1);
    }
    
    // Set time to 10:00 AM
    interviewDate.setHours(10, 0, 0, 0);
    
    // If it's already past 10 AM today, schedule for tomorrow
    if (now.getHours() >= 10) {
      interviewDate.setDate(interviewDate.getDate() + 1);
      while (interviewDate.getDay() === 0 || interviewDate.getDay() === 6) {
        interviewDate.setDate(interviewDate.getDate() + 1);
      }
    }
    
    // Handle different candidate data structures (pipeline vs API)
    const firstName = candidate.firstName || candidate.name?.split(' ')[0] || 'Candidate';
    const lastName = candidate.lastName || candidate.name?.split(' ').slice(1).join(' ') || '';
    const jobTitle = jobPosting?.job_title || candidate.jobTitle || candidate.position || 'Software Engineer';
    const matchScore = candidate.match_score || candidate.final_score || candidate.matchScore || '85%';
    const experience = candidate.experience || '3 years';
    const profileImage = candidate.profileImage || candidate.avatar;
    
    return {
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId: candidate.id,
      candidateName: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      jobId: jobPosting?._id || candidate.jobId,
      company: candidate.company || 'Company',
      interviewDate: interviewDate.toISOString(),
      interviewMode: 'In-person', // Default mode
      status: 'scheduled',
      matchScore: matchScore,
      experience: experience,
      profileImage: profileImage,
      createdAt: new Date().toISOString()
    };
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
    
    // Automatically schedule interview if moved to interviewing stage
    if (targetStage === 'interviewing') {
      // Find the job posting for this candidate
      const jobPosting = jobPostings.find(job => 
        job.applicants?.some(applicant => applicant.id === candidate.id) ||
        job._id === candidate.jobId
      );
      
      // Generate interview details
      const interviewDetails = generateInterviewDetails(candidate, jobPosting);
      
      // Save interview to database via API
      const saveInterviewToDatabase = async () => {
        try {
          const response = await axios.put(buildApiUrl("/api/applications/update_status"), {
            userId: candidate.id,
            jobId: jobPosting?._id || candidate.jobId,
            status: "shortlisted", // Keep as shortlisted but add interview details
            interviewDate: interviewDetails.interviewDate,
            interviewMode: interviewDetails.interviewMode
          });
          
          
          
          // Add to interviews list only after successful API call
          setInterviews(prevInterviews => {
            // Check if interview already exists for this candidate
            const existingInterview = prevInterviews.find(interview => 
              interview.candidateId === candidate.id
            );
            
            if (existingInterview) {
              // Update existing interview
              return prevInterviews.map(interview => 
                interview.candidateId === candidate.id 
                  ? { ...interview, ...interviewDetails }
                  : interview
              );
            } else {
              // Add new interview
              return [...prevInterviews, interviewDetails];
            }
          });
          
          // Show success notification
          const candidateName = candidate.firstName ? `${candidate.firstName} ${candidate.lastName}` : candidate.name || 'Candidate';
          alert(`Interview automatically scheduled for ${candidateName} on ${new Date(interviewDetails.interviewDate).toLocaleDateString()} at 10:00 AM`);
          
        } catch (error) {
          console.error('Failed to save interview to database:', error);
          alert('Failed to schedule interview. Please try again.');
        }
      };
      
      saveInterviewToDatabase();
    }
    
    // Remove interview if candidate is moved out of interviewing stage
    if (targetStage !== 'interviewing') {
      setInterviews(prevInterviews => 
        prevInterviews.filter(interview => interview.candidateId !== candidate.id)
      );
    }
  };
  
  // Helper function to manually schedule interview
  const scheduleInterview = async (candidate, customDate = null, customMode = 'In-person') => {
    const jobPosting = jobPostings.find(job => 
      job.applicants?.some(applicant => applicant.id === candidate.id) ||
      job._id === candidate.jobId
    );
    
    const interviewDetails = generateInterviewDetails(candidate, jobPosting);
    
    // Override with custom values if provided
    if (customDate) {
      interviewDetails.interviewDate = new Date(customDate).toISOString();
    }
    if (customMode) {
      interviewDetails.interviewMode = customMode;
    }
    
    try {
      // Save to database first
      const response = await axios.put(buildApiUrl("/api/applications/update_status"), {
        userId: candidate.id,
        jobId: jobPosting?._id || candidate.jobId,
        status: "shortlisted", // Keep as shortlisted but add interview details
        interviewDate: interviewDetails.interviewDate,
        interviewMode: interviewDetails.interviewMode
      });
    
      // Update local state only after successful API call
      setInterviews(prevInterviews => {
        const existingInterview = prevInterviews.find(interview => 
          interview.candidateId === candidate.id
        );
        
        if (existingInterview) {
          return prevInterviews.map(interview => 
            interview.candidateId === candidate.id 
              ? { ...interview, ...interviewDetails }
              : interview
          );
        } else {
          return [...prevInterviews, interviewDetails];
        }
      });
      
      const candidateName = candidate.firstName ? `${candidate.firstName} ${candidate.lastName}` : candidate.name || 'Candidate';
      alert(`Interview scheduled for ${candidateName} on ${new Date(interviewDetails.interviewDate).toLocaleDateString()}`);
      
    } catch (error) {
      console.error('Failed to save interview to database:', error);
      alert('Failed to schedule interview. Please try again.');
    }
  };

  // Function to mark interview as complete
  const markInterviewComplete = (interviewId) => {
    setInterviews(prevInterviews => 
      prevInterviews.filter(interview => interview.id !== interviewId)
    );
    alert('Interview marked as complete and removed from schedule');
  };

  // Function to reschedule interview
  const rescheduleInterview = async (interviewId) => {
    const interview = interviews.find(i => i.id === interviewId);
    if (interview) {
      const newDate = prompt('Enter new interview date (YYYY-MM-DD):', 
        new Date(interview.interviewDate).toISOString().split('T')[0]
      );
      if (newDate) {
        const newTime = prompt('Enter new interview time (HH:MM):', '10:00');
        if (newTime) {
          const [hours, minutes] = newTime.split(':');
          const newDateTime = new Date(newDate);
          newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          try {
            // Update in database first
            const response = await axios.put(buildApiUrl("/api/applications/update_status"), {
              userId: interview.candidateId,
              jobId: interview.jobId,
              status: "shortlisted", // Keep current status
              interviewDate: newDateTime.toISOString(),
              interviewMode: interview.interviewMode
            });
            
            // Update local state only after successful API call
            setInterviews(prevInterviews => 
              prevInterviews.map(i => 
                i.id === interviewId 
                  ? { ...i, interviewDate: newDateTime.toISOString() }
                  : i
              )
            );
            alert(`Interview rescheduled to ${newDateTime.toLocaleDateString()} at ${newTime}`);
            
          } catch (error) {
            console.error('Failed to reschedule interview:', error);
            alert('Failed to reschedule interview. Please try again.');
          }
        }
      }
    }
  };
  
  // Function to check if candidate already has an interview scheduled
  const hasInterviewScheduled = (candidateId) => {
    return interviews.some(interview => interview.candidateId === candidateId);
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
