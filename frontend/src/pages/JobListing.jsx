import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import "../styles/JobListing.css";
import { buildApiUrl } from '../config/api';

const JobListing = () => {
    const [jobListings, setJobListings] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [jobsWithMatchScore, setJobsWithMatchScore] = useState(new Map());
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortType, setSortType] = useState("deadline");
    const [loadingApply, setLoadingApply] = useState(new Map());
    const [loadingMatch, setLoadingMatch] = useState(new Map());
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobListings();
        fetchAppliedJobs();
    }, []);

    /** Fetch All Job Listings */
    const fetchJobListings = async () => {
        try {
            setIsLoadingJobs(true);
            const response = await axios.get(buildApiUrl("/api/jobs/get_jobs"));
            setJobListings(response.data);
            setFilteredJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobListings([]);
            setFilteredJobs([]);
        } finally {
            setIsLoadingJobs(false);
        }
    };

    const updateJobViews = async (jobId) => {
        const userId = localStorage.getItem("userId");
        try {
            await axios.post(buildApiUrl(`/api/jobs/increase_views/${jobId}`));
            console.log("View count updated successfully");
        } catch (error) {
            console.error("Failed to update job views:", error);
        }
        const matchRes = await axios.get(buildApiUrl("/api/applications/get_applications"), { params: { userId, jobId } });

        //  If no match data exists, create a new entry 
        if (matchRes.data.length === 0) {
            try {
                const response = await axios.post(
                    buildApiUrl("/api/applications/apply"),
                    { userId, jobId, status: "" },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" } }
                );
                console.log("Match data created successfully:", response.data);
            } catch (error) {
                console.error("Failed to create match data:", error);
            }
        }
    };

    const fetchAppliedJobs = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const response = await axios.get(buildApiUrl("/api/applications/get_applications"), {
                params: { userId },
            });

            if (!response.data || !Array.isArray(response.data.applications)) return;

            const appliedJobIds = new Set();
            const matchScoreJobs = new Map();

            response.data.applications.forEach((app) => {
                if (app.status !== "") appliedJobIds.add(app.jobId);
                if (app.matchScore && app.status === "") matchScoreJobs.set(app.jobId, app.matchScore);
            });

            setAppliedJobs(appliedJobIds);
            setJobsWithMatchScore(matchScoreJobs);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
        }
    };

    /**  Handle Apply for Job */
    const applyForJob = async (jobId) => {
        setLoadingApply((prev) => new Map(prev).set(jobId, true));
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            if (appliedJobs.has(jobId)) {
                await axios.put(buildApiUrl("/api/applications/update_status"), { userId, jobId, status: "applied" });
            } else {
                await axios.post(buildApiUrl("/api/applications/apply"), { userId, jobId, status: "applied" });
            }

            try {
                await axios.post(buildApiUrl(`/api/jobs/increase_views/${jobId}`));
                console.log("View count updated successfully");
            } catch (error) {
                console.error("Failed to update job views:", error);
            }
            try {
                await axios.post(buildApiUrl(`/api/jobs/apply/${jobId}`), {
                    applicant_id: userId,
                });
                console.log("Applicant updated")
            } catch (error) {
                console.error("Failed to apply for job:", error);
            }

            setAppliedJobs((prev) => new Set([...prev, jobId]));
            fetchAppliedJobs(); // Refresh application status
            
            // Redirect to job details page after successful application
            navigate(`/job-details/${jobId}`);
            
        } catch (error) {
            console.error("Application error:", error);
        }
        setLoadingApply((prev) => new Map(prev).set(jobId, false));
    };

    /**  Filter & Sort Jobs */
    useEffect(() => {
        let filtered = jobListings.filter((job) =>
            job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterType !== "all") {
            filtered = filtered.filter((job) => job.job_type === filterType);
        }

        filtered.sort((a, b) => {
            if (sortType === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
            if (sortType === "company") return a.company_name.localeCompare(b.company_name);
            return 0;
        });

        setFilteredJobs(filtered);
    }, [searchTerm, filterType, sortType, jobListings]);

    return (
        <div className="job_listing_wrapper">
            {isLoadingJobs ? (
                <div className="loading-container">
                    <LoadingSpinner
                        type="skeleton"
                        size="large"
                        text="Loading job opportunities..."
                        showText={true}
                        color="primary"
                    />
                </div>
            ) : (
            <div className="job_listing_container">
                <h2>All Job Listings</h2>

                {/*  Filters & Search */}
                <div className="job_listing_search_filters_container">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="job_listing_search_input"
                    />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="job_listing_filter_select">
                        <option value="all">All Jobs</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                    <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="job_listing_sort_select">
                        <option value="deadline">Sort by Deadline</option>
                        <option value="company">Sort by Company</option>
                    </select>
                </div>

                {/*  Job Listings */}
                {filteredJobs.length > 0 ? (
                    <div className="job_listing_job_cards">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="job_listing_job_card">
                                <h3>{job.job_title}</h3>
                                <p><strong>Company:</strong> {job.company_name}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Skills:</strong> {job.required_skills ? job.required_skills : "Not specified"}</p>
                                <p><strong>Description:</strong>{job.description}</p>
                            <p><strong>Qualification:</strong>{job.education_required}</p>
                            <p><strong>Experience Required:</strong>{job.experience_required}</p>
                            <p><strong>Salary:</strong>{job.salary_range}</p>
                            <p><strong>Responsibilities:</strong>{job.responsibilities}</p>
                            <p><strong>Deadline:</strong>{job.application_deadline}</p>
                            <p><strong>Remote option:</strong>{job.remote_option}  </p>
                            <p><strong>Job type:</strong>{job.job_type}</p>

                                {/*  Action Buttons */}
                                <div className="job_actions">
                                    <button 
                                        onClick={() => navigate(`/job-details/${job._id}`)} 
                                        className="view_details_button"
                                    >
                                        View Details
                                    </button>
                                    
                                    {appliedJobs.has(job._id) ? (
                                        <Button variant="secondary" disabled className="applied_button">Applied</Button>
                                    ) : (
                                        <Button 
                                            onClick={() => applyForJob(job._id)} 
                                            loading={loadingApply.get(job._id)}
                                            variant="primary"
                                            className="apply_button"
                                        >
                                            Apply Now
                                        </Button>
                                    )}
                                </div>

                                {/*  Match Score */}
                                <Button
                                    variant="outline"
                                    className="jobseeker_dashboard_match_score_btn"
                                    onClick={() => updateJobViews(job._id)}
                                    loading={loadingMatch.get(job._id)}
                                >
                                    View Match Score
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No jobs found.</p>
                )}
            </div>
            )}
        </div>
    );
};

export default JobListing;
