import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../styles/JobListing.css";

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
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobListings();
        fetchAppliedJobs();
    }, []);

    /** Fetch All Job Listings */
    const fetchJobListings = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/api/jobs/get_jobs");
            setJobListings(response.data);
            setFilteredJobs(response.data);
        } catch (error) {
            console.error("Error fetching job listings:", error);
        }
    };
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
                console.log(" New application created:", response.data);


            } catch (error) {
                console.error(" Error creating match data:", error.response?.data || error.message);
            }}
            setLoadingMatch((prev) => new Map(prev).set(jobId, false));
             navigate(`/match-score/${jobId}`);
        };
        
        /**  Fetch Applied Jobs */
        const fetchAppliedJobs = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const response = await axios.get("http://127.0.0.1:5000/api/applications/get_applications", {
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
                if (jobsWithMatchScore.has(jobId)) {
                    await axios.put("http://127.0.0.1:5000/api/applications/update_status", { userId, jobId, status: "applied" });
                } else {
                    await axios.post("http://127.0.0.1:5000/api/applications/apply", { userId, jobId, status: "applied" });
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
                fetchAppliedJobs(); // Refresh application status
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
                                 <Header />
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

                                    {/*  Apply Button Logic */}
                                    {appliedJobs.has(job._id) ? (
                                        <button className="applied_button" disabled>Applied</button>
                                    ) : (
                                        <button onClick={() => applyForJob(job._id)} disabled={loadingApply.get(job._id)}>
                                        {loadingApply.get(job._id) ? "Applying..." : "Apply Now"}</button>
                                    )}

                                    {/*  Match Score */}
                                    <button
                                        className="jobseeker_dashboard_match_score_btn"
                                        onClick={() => handleViewMatchScore(job._id)}
                                    >
                                        {loadingMatch.get(job._id) ? "Matching score..." : "View Match Score"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No jobs found.</p>
                    )}
                </div>
            </div>
        );
    };

    export default JobListing;
