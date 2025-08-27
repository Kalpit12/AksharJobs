import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import BackButton from "../components/BackButton";
import LoadingSpinner from "../components/LoadingSpinner";
import JobCardSkeleton from "../components/JobCardSkeleton";
import "../styles/AllJobs.css";

const AllJobs = () => {
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("deadline");

  const userId = localStorage.getItem("userId");

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

    if (userId) fetchJobs();
  }, [userId]);

  const filteredJobs = jobPostings
    .filter(job => filterType === "all" || job.job_type === filterType)
    .filter(job => job.job_title.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortType === "deadline") return new Date(a.application_deadline) - new Date(b.application_deadline);
    if (sortType === "applicants") return (b.applicants?.length || 0) - (a.applicants?.length || 0);
    if (sortType === "views") return (Number(b.views) || 0) - (Number(a.views) || 0);
    return 0;
  });

  return (
    <>
      <Header />
      <div className="all_jobs_page">
        <BackButton to="/recruiter-dashboard" text="Back" />
        <div className="all_jobs_content">
          <h2>All Job Postings</h2>

          <div className="all_jobs_filters_container">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="all_jobs_search_input"
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="all_jobs_filter_select">
              <option value="all">All Jobs</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="all_jobs_sort_select">
              <option value="deadline">Sort by Deadline</option>
              <option value="applicants">Sort by Applicants</option>
              <option value="views">Sort by Views</option>
            </select>
          </div>

          {loading ? (
            <JobCardSkeleton count={8} />
          ) : error ? (
            <p className="error">{error}</p>
          ) : sortedJobs.length > 0 ? (
            <div className="all_jobs_cards_container">
              {sortedJobs.map((job) => (
                <div key={job._id} className="all_jobs_card">
                  <h3>{job.job_title}</h3>
                  <p><strong>Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</p>
                  <p><strong>Salary:</strong> {job.salary_range || "Not specified"}</p>
                  <p><strong>Applicants:</strong> {job.applicants?.length || 0}</p>
                  <p><strong>Views:</strong> {Number(job.views) || 0}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Job Type:</strong> {job.job_type}</p>
                  <p><strong>Description:</strong>{job.description}</p>
                  <p><strong>Qualification:</strong>{job.education_required}</p>
                  <p><strong>Experience Required:</strong>{job.experience_required}</p>
                  <p><strong>Remote option:</strong>{job.remote_option}  </p>
                  <div className="buttons">
                  <button onClick={() => navigate(`/viewtopcandidates/${job._id}`)}>View top candidates</button>
                  <button onClick={() => navigate(`/viewallcandidates/${job._id}`)}>View all candidates</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllJobs;
