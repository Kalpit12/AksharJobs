import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import PremiumPrompt from "../components/PremiumPrompt";
import JobSeekerCulturalFit from "../components/JobSeekerCulturalFit";
import "../styles/JobSeekerDashboard.css";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const JobSeekerDashboard = () => {
    const [recommendedTitles, setRecommendedTitles] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [jobsWithMatchScore, setJobsWithMatchScore] = useState(new Map());
    const [jobTitles, setJobTitles] = useState([]);
    const [applicationStats, setApplicationStats] = useState({
        total: 0, applied: 0, shortlisted: 0, rejected: 0, accepted: 0
    });
    const [matchScoreStats, setMatchScoreStats] = useState({ high: 0, medium: 0, low: 0 });
    const [loadingApply, setLoadingApply] = useState(new Map());
    const [loadingMatch, setLoadingMatch] = useState(new Map());
    const [userName, setUserName] = useState("");
    const [userImage, setUserImage] = useState("");
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
    const [showCulturalFit, setShowCulturalFit] = useState(false);
    const [selectedJobForCulturalFit, setSelectedJobForCulturalFit] = useState(null);
    const navigate = useNavigate();
    const defaultAvatar = "https://www.w3schools.com/w3images/avatar2.png";

    const fetchJobListings = useCallback(async (titles) => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/jobs/get_jobs");
            if (response.data && Array.isArray(response.data)) {
                const filteredJobs = response.data.filter(job =>
                    titles.some(title => job.job_title.toLowerCase().includes(title.toLowerCase()))
                );
                setRecommendedTitles(filteredJobs.slice(0, 6));
            }
        } catch (error) {
            console.error("Error fetching job listings:", error);
        }
    }, []);

    const fetchAppliedJobs = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/applications/get_applications`, { params: { userId } });
            console.log(response.data.applications)
            if (!response.data || !Array.isArray(response.data.applications)) {
                console.error("Error: Expected an array but got:", response.data);
                return;
            }

            const appliedJobIds = new Set();
            const matchScoreJobs = new Map();
            const statusCounts = { total: 0, applied: 0, shortlisted: 0, rejected: 0, accepted: 0 };
            const matchScoreCounts = { high: 0, medium: 0, low: 0 };

            response.data.applications.forEach((app) => {
                statusCounts.total++;
                statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;

                if (app.status !== "") appliedJobIds.add(app.jobId);
                if (app.overall_match_score && app.status === "") matchScoreJobs.set(app.jobId, app.overall_match_score);
                // Categorizing Match Score for Bar Chart
                if (app.final_score >= 80) matchScoreCounts.high++;
                else if (app.final_score >= 50) matchScoreCounts.medium++;
                else matchScoreCounts.low++;
            });

            setAppliedJobs(appliedJobIds);
            setJobsWithMatchScore(matchScoreJobs);
            setApplicationStats(statusCounts);
            setMatchScoreStats(matchScoreCounts);
        } catch (error) {
            console.error("Error fetching application data:", error);
        }
    }, []);

    const checkResumeStatus = useCallback(async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return console.error("User ID not found. Please log in again.");

        // Always fetch user profile first, regardless of resume status
        try {
            console.log("Fetching user profile for userId:", userId);
            const userResponse = await axios.get(`http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`);
            console.log("User profile response:", userResponse);
            if (userResponse.data) {
                console.log("User profile data:", userResponse.data);
                setUserName(userResponse.data);
                setUserImage(userResponse.data.profileImage || defaultAvatar);
            } else {
                console.log("No user data in response");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Set default values if user fetch fails
            setUserName({
                firstName: "Dev",
                lastName: "Patel",
                email: "dev.patel@example.com",
                phoneNumber: "+1 (555) 123-4567",
                linkedinProfile: "https://linkedin.com/in/devpatel"
            });
            setUserImage(defaultAvatar);
        } finally {
            setIsLoadingProfile(false);
        }

        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/resumes/get_resumes/${userId}`);
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const jobTitles = response.data[0]?.jobRecommended || [];
                setRecommendedTitles(jobTitles);
                console.log("Job titles from resume:", jobTitles);
                setJobTitles(jobTitles || []);
                if (jobTitles.length > 0) fetchJobListings(jobTitles);
                await fetchAppliedJobs(userId);
            } else {
                console.log("No resume found, but staying on dashboard");
                // Still fetch applied jobs even without resume
                await fetchAppliedJobs(userId);
            }

        } catch (error) {
            console.error("Error fetching resume data:", error);
            // Still fetch applied jobs even if resume fetch fails
            try {
                await fetchAppliedJobs(userId);
            } catch (fetchError) {
                console.error("Error fetching applied jobs:", fetchError);
            }
        }

        // Always set sample data for testing - remove this when you have real data
        const sampleJobTitles = [
            "Software Developer",
            "Full Stack Engineer", 
            "React Developer",
            "Python Developer",
            "Data Analyst",
            "Product Manager"
        ];
        setJobTitles(sampleJobTitles);
        
        // Add sample job data for testing
        const sampleJobs = [
            {
                _id: "sample1",
                job_title: "Software Developer",
                company_name: "Tech Corp",
                location: "New York, NY",
                salary_range: "$80,000 - $120,000",
                job_type: "Full-time",
                remote_option: "Hybrid",
                required_skills: "JavaScript, React, Node.js, Python",
                description: "We are looking for a talented software developer...",
                education_required: "Bachelor's in Computer Science",
                experience_required: "2-5 years",
                responsibilities: "Develop and maintain web applications...",
                application_deadline: "2024-12-31"
            },
            {
                _id: "sample2", 
                job_title: "Full Stack Engineer",
                company_name: "Startup Inc",
                location: "San Francisco, CA",
                salary_range: "$100,000 - $150,000",
                job_type: "Full-time",
                remote_option: "Remote",
                required_skills: "React, Node.js, MongoDB, AWS",
                description: "Join our fast-growing startup...",
                education_required: "Bachelor's degree",
                experience_required: "3-7 years",
                responsibilities: "Build scalable web applications...",
                application_deadline: "2024-12-31"
            }
        ];
        setRecommendedTitles(sampleJobs);
        
        // Add sample application stats for testing
        setApplicationStats({
            total: 3,
            applied: 2,
            shortlisted: 1,
            rejected: 0,
            accepted: 0
        });
        
        setMatchScoreStats({
            high: 1,
            medium: 1,
            low: 0
        });
        
        // Add sample applied jobs for testing
        setAppliedJobs(new Set(["sample1", "sample2"]));
        
        // Add sample jobs with match scores for testing
        const sampleMatchScores = new Map();
        sampleMatchScores.set("sample1", 85);
        sampleMatchScores.set("sample2", 72);
        setJobsWithMatchScore(sampleMatchScores);
    }, [navigate, fetchJobListings, fetchAppliedJobs]);

    useEffect(() => {
        checkResumeStatus();
        
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
        
    }, [checkResumeStatus]);

    const handleViewMatchScore = async (jobId) => {
        setLoadingMatch((prev) => new Map(prev).set(jobId, true));
        const userId = localStorage.getItem("userId");
        try {
            await axios.post(`http://127.0.0.1:5000/api/jobs/increase_views/${jobId}`);
            console.log("View count updated successfully");
        } catch (error) {
            console.error("Failed to update job views:", error);
        }
        const matchRes = await axios.get(`http://127.0.0.1:5000/api/applications/get_applications`, { params: { userId, jobId } });

        //  If no match data exists, create a new entry 
        if (matchRes.status === 204) {
            console.log("Entered")

            try {
                const response = await axios.post(
                    "http://127.0.0.1:5000/api/applications/apply",
                    { userId, jobId, status: "" },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
                );
                console.log("New application created:", response.data);


            } catch (error) {
                console.error(" Error creating match data:", error.response?.data || error.message);
            }
        }
        setLoadingMatch((prev) => new Map(prev).set(jobId, false));
        navigate(`/match-score/${jobId}`);
    };

    const handleCulturalFitAssessment = (job) => {
        setSelectedJobForCulturalFit(job);
        setShowCulturalFit(true);
    };

    const applyForJob = async (jobId) => {
        setLoadingApply((prev) => new Map(prev).set(jobId, true));
        const userId = localStorage.getItem("userId");
        if (!userId) return console.error("You must be logged in to apply for jobs.");

        try {
            if (jobsWithMatchScore.has(jobId)) {
                await axios.put(`http://127.0.0.1:5000/api/applications/update_status`, { userId, jobId, status: "applied" });
            } else {
                await axios.post(`http://127.0.0.1:5000/api/applications/apply`, { userId, jobId, status: "applied" });
            }

            try {
                await axios.post(`http://127.0.0.1:5000/api/jobs/increase_views/${jobId}`);
                console.log("View count updated successfully");
            } catch (error) {
                console.error("Failed to update job views:", error);
            }
            try {
                await axios.post(`http://127.0.0.1:5000/api/jobs/apply/${jobId}`, {
                    applicant_id: userId,
                });
                console.log("Applicant updated")
            } catch (error) {
                console.error("Failed to apply for job:", error);
            }

            setAppliedJobs((prev) => new Set([...prev, jobId]));
            console.log("Application successful!");
            fetchAppliedJobs(userId);
        } catch (error) {
            console.error("Application failed. Please try again.");
            console.error("Application error:", error);
        }
        setLoadingApply((prev) => new Map(prev).set(jobId, false));
    };

    const pieData = {
        labels: ["Applied", "Shortlisted", "Rejected", "Accepted"],
        datasets: [
            {
                label: "Application Status",
                data: [
                    applicationStats.applied,
                    applicationStats.shortlisted,
                    applicationStats.rejected,
                    applicationStats.accepted
                ],
                backgroundColor: [
                    "rgba(0, 123, 255, 0.8)",
                    "rgba(255, 193, 7, 0.8)",
                    "rgba(220, 53, 69, 0.8)",
                    "rgba(40, 167, 69, 0.8)"
                ],
                borderColor: [
                    "rgba(0, 123, 255, 1)",
                    "rgba(255, 193, 7, 1)",
                    "rgba(220, 53, 69, 1)",
                    "rgba(40, 167, 69, 1)"
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    "rgba(0, 123, 255, 1)",
                    "rgba(255, 193, 7, 1)",
                    "rgba(220, 53, 69, 1)",
                    "rgba(40, 167, 69, 1)"
                ]
            }
        ]
    };

    const barData = {
        labels: ["High Match (80-100%)", "Medium Match (50-79%)", "Low Match (0-49%)"],
        datasets: [
            {
                label: "Number of Jobs",
                data: [matchScoreStats.high, matchScoreStats.medium, matchScoreStats.low],
                backgroundColor: [
                    "rgba(40, 167, 69, 0.8)",
                    "rgba(255, 193, 7, 0.8)",
                    "rgba(220, 53, 69, 0.8)"
                ],
                borderColor: [
                    "rgba(40, 167, 69, 1)",
                    "rgba(255, 193, 7, 1)",
                    "rgba(220, 53, 69, 1)"
                ],
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: [
                    "rgba(40, 167, 69, 1)",
                    "rgba(255, 193, 7, 1)",
                    "rgba(220, 53, 69, 1)"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    padding: 10
                }
            }
        },
        barPercentage: 0.7,
        categoryPercentage: 0.9,
        elements: {
            bar: {
                borderRadius: 8
            }
        }
    };

    return (
        <div className="jobseeker_dashboard_wrapper">
            <Header />
                        <div className="jobseeker_dashboard_container">
                
                {/* Premium Prompt - Modern Design */}
                {showPremiumPrompt && (
                  <PremiumPrompt 
                    userType="job_seeker"
                    onClose={() => setShowPremiumPrompt(false)}
                  />
                )}
                
                <div className="jobseeker_user_profile">
                    {isLoadingProfile ? (
                        <div className="profile_loading">
                            <div className="loading_spinner"></div>
                            <p>Loading profile...</p>
                        </div>
                    ) : (
                        <>
                            <div className="profile_image_container">
                                <img 
                                    src={userImage || "/default-profile.png"} 
                                    alt="Profile" 
                                    className="jobseeker_profile_image"
                                    onError={(e) => {
                                        console.log("Image failed to load, using default");
                                        e.target.src = "/default-profile.png";
                                    }}
                                />
                                <div className="profile_status_badge">
                                    <span className="status_dot"></span>
                                    Active
                                </div>
                            </div>
                            <div className="profile_info">
                                <h2 className="welcome_title">
                                    Welcome back, {userName && userName.firstName ? `${userName.firstName} ${userName.lastName || ''}` : 'User'}! 👋
                                </h2>

                                <div className="profile_details">
                                    <div className="profile_detail_item">
                                        <span className="detail_icon">📧</span>
                                        <span className="detail_label">Email:</span>
                                        <span className="detail_value">{userName && userName.email ? userName.email : 'Not provided'}</span>
                                    </div>
                                    <div className="profile_detail_item">
                                        <span className="detail_icon">📱</span>
                                        <span className="detail_label">Phone:</span>
                                        <span className="detail_value">{userName && userName.phoneNumber ? userName.phoneNumber : 'Not provided'}</span>
                                    </div>
                                    <div className="profile_detail_item">
                                        <span className="detail_icon">💼</span>
                                        <span className="detail_label">LinkedIn:</span>
                                        <span className="detail_value">
                                            {userName && userName.linkedInProfile ? (
                                                <a 
                                                    href={userName.linkedInProfile} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="linkedin_link"
                                                >
                                                    View Profile
                                                </a>
                                            ) : 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                                <div className="profile_stats">
                                    <div className="stat_item">
                                        <span className="stat_number">{applicationStats.total || 0}</span>
                                        <span className="stat_label">Total Applications</span>
                                    </div>
                                    <div className="stat_item">
                                        <span className="stat_number">{jobTitles && jobTitles.length ? jobTitles.length : 0}</span>
                                        <span className="stat_label">Job Matches</span>
                                    </div>
                                    <div className="stat_item">
                                        <span className="stat_number">{recommendedTitles && recommendedTitles.length ? recommendedTitles.length : 0}</span>
                                        <span className="stat_label">Available Jobs</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="section_header job_titles_header">
                    <h2>
                        <span className="header_icon"><i className="fas fa-bullseye"></i></span>
                        <span className="header_text">Recommended Job Titles</span>
                    </h2>
                    <p className="section_subtitle">Based on your resume analysis</p>
                </div>

                {isLoadingProfile ? (
                    <div className="section_loading">
                        <div className="loading_spinner"></div>
                        <p>Loading job recommendations...</p>
                    </div>
                ) : jobTitles && jobTitles.length > 0 ? (
                    <div className="jobseeker_dashboard_job_titles">
                        <div className="job_title_list">
                            {jobTitles.map((title, index) => (
                                <span key={index} className="job_title_item">
                                    {title}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty_state">
                        <div className="empty_state_icon">📄</div>
                        <p className="empty_state_text">No recommended titles available for your resume.</p>
                        <p className="empty_state_subtext">Upload or update your resume to get personalized job recommendations.</p>
                    </div>
                )}

                <div className="section_header">
                    <h2>
                        <span className="header_icon"><i className="fas fa-briefcase"></i></span>
                        <span className="header_text">Recommended Jobs</span>
                    </h2>
                    <p className="section_subtitle">Tailored to your skills and experience</p>
                </div>
                
                {isLoadingProfile ? (
                    <div className="section_loading">
                        <div className="loading_spinner"></div>
                        <p>Loading job listings...</p>
                    </div>
                ) : recommendedTitles && recommendedTitles.length > 0 ? (
                    <div className="jobseeker_dashboard_job_cards">
                        {recommendedTitles.map((job) => (
                            <div key={job._id || job.job_title} className="jobseeker_dashboard_job_card">
                                <div className="job_card_header">
                                    <h3 className="job_title">{job.job_title}</h3>
                                    <div className="job_company">{job.company_name}</div>
                                </div>
                                
                                <div className="job_card_details">
                                    <div className="job_detail_item">
                                        <span className="detail_icon">📍</span>
                                        <span className="detail_text">{job.location}</span>
                                    </div>
                                    <div className="job_detail_item">
                                        <span className="detail_icon">💰</span>
                                        <span className="detail_text">{job.salary_range}</span>
                                    </div>
                                    <div className="job_detail_item">
                                        <span className="detail_icon">⏰</span>
                                        <span className="detail_text">{job.job_type}</span>
                                    </div>
                                    <div className="job_detail_item">
                                        <span className="detail_icon">🏠</span>
                                        <span className="detail_text">{job.remote_option}</span>
                                    </div>
                                </div>

                                <div className="job_card_skills">
                                    <h4>Required Skills:</h4>
                                    <div className="skills_list">
                                        {job.required_skills ? job.required_skills.split(',').slice(0, 3).map((skill, index) => (
                                            <span key={index} className="skill_tag">{skill.trim()}</span>
                                        )) : 'Not specified'}
                                    </div>
                                </div>

                                <div className="job_card_actions">
                                    {appliedJobs.has(job._id) ? (
                                        <button className="applied_button" disabled>
                                            <span className="button_icon">✓</span>
                                            Applied
                                        </button>
                                    ) : (
                                        <button 
                                            className="apply_button" 
                                            onClick={() => applyForJob(job._id)} 
                                            disabled={loadingApply.get(job._id)}
                                        >
                                            {loadingApply.get(job._id) ? (
                                                <>
                                                    <span className="button_icon">⏳</span>
                                                    Applying...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="button_icon">📝</span>
                                                    Apply Now
                                                </>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        className="match_score_button"
                                        onClick={() => handleViewMatchScore(job._id)}
                                    >
                                        {loadingMatch.get(job._id) ? (
                                            <>
                                                <span className="button_icon">⏳</span>
                                                Calculating...
                                            </>
                                        ) : (
                                            <>
                                                <span className="button_icon">📊</span>
                                                View Match Score
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="cultural_fit_button"
                                        onClick={() => handleCulturalFitAssessment(job)}
                                    >
                                        <span className="button_icon">🌍</span>
                                        Cultural Fit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty_state">
                        <div className="empty_state_icon">💼</div>
                        <p className="empty_state_text">No jobs available for your recommended titles.</p>
                        <p className="empty_state_subtext">Check back later for new opportunities or browse all available jobs.</p>
                    </div>
                )}

                <div className="section_header">
                    <h2>
                        <span className="header_icon"><i className="fas fa-chart-bar"></i></span>
                        <span className="header_text">Analytics Dashboard</span>
                    </h2>
                    <p className="section_subtitle">Track your application progress and performance</p>
                </div>

                <div className="jobseeker_dashboard_charts">
                    <div className="chart_container">
                        <div className="chart_header">
                            <h3>📈 Application Status Overview</h3>
                            <p>Your current application progress</p>
                        </div>
                        {applicationStats && applicationStats.total > 0 ? (
                            <Pie data={pieData} />
                        ) : (
                            <div className="chart_empty_state">
                                <div className="chart_empty_icon">📊</div>
                                <p>No applications yet</p>
                                <p className="chart_empty_subtext">Start applying to jobs to see your progress</p>
                            </div>
                        )}
                    </div>

                    <div className="chart_container">
                        <div className="chart_header">
                            <h3>🎯 Match Score Distribution</h3>
                            <p>How well you match with job requirements</p>
                        </div>
                        {matchScoreStats && (matchScoreStats.high + matchScoreStats.medium + matchScoreStats.low) > 0 ? (
                            <Bar data={barData} options={options} />
                        ) : (
                            <div className="chart_empty_state">
                                <div className="chart_empty_icon">🎯</div>
                                <p>No match scores yet</p>
                                <p className="chart_empty_subtext">View match scores for jobs to see this data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cultural Fit Assessment Modal */}
                {selectedJobForCulturalFit && (
                    <JobSeekerCulturalFit
                        isVisible={showCulturalFit}
                        onClose={() => {
                            setShowCulturalFit(false);
                            setSelectedJobForCulturalFit(null);
                        }}
                        jobId={selectedJobForCulturalFit._id}
                        companyName={selectedJobForCulturalFit.company_name}
                    />
                )}
            </div>
        </div>
    );
};

export default JobSeekerDashboard;