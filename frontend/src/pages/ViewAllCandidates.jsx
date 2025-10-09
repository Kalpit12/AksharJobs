import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../config/api";

import "../styles/ViewAllCandidates.css";
import BackButton from "../components/BackButton";

const ViewAllCandidates = () => {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [interviewSchedules, setInterviewSchedules] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [interviewModes, setInterviewModes] = useState({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          return;
        }
        
        // Use the new endpoint that returns all applications with user and job details
        const response = await axios.get(buildApiUrl(`/api/applications/all`));
        const applications = response.data.applications || [];
        
        // Filter applications for the specific job
        const jobApplications = applications.filter(app => app.job_id === jobId);
        
        // The applications already have user and job details, so we can use them directly
        const enrichedCandidates = jobApplications.map(candidate => ({
          ...candidate,
          // Map the fields to match what the component expects
          fullName: candidate.applicant_name,
          email: candidate.applicant_email,
          phone: candidate.applicant_phone,
          jobTitle: candidate.job_title,
          companyName: candidate.company_name,
          // Keep original fields for compatibility
          userId: candidate.applicant_id,
          jobId: candidate.job_id
        }));

        // Filter out invalid candidates and those with empty status
        const sortedCandidates = enrichedCandidates
          .filter((c) => c && typeof c === 'object' && c.status && c.applicant_id) // Filter out invalid candidates
          .sort((a, b) => (b.final_score || b.matchScore || 0) - (a.final_score || a.matchScore || 0));
        
        console.log('Raw applications:', applications);
        console.log('Enriched candidates:', enrichedCandidates);
        console.log('Final sorted candidates:', sortedCandidates);
        setCandidates(sortedCandidates);
      } catch (err) {
        setError("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const updateStatus = async (userId, jobId, status, interviewDate, interviewMode) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
      
      await axios.put(buildApiUrl("/api/applications/update_status"), 
        { userId, jobId, status, interviewDate, interviewMode },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
             setCandidates((prev) =>
         prev.map((c) => (c.applicant_id === userId && c.job_id === jobId ? { ...c, status, interviewDate, interviewMode } : c))
       );
    } catch (err) {
      alert("Failed to update status");
    }
  };
  const handleScheduleChange = (userId, dateTime) => {
    setInterviewSchedules((prev) => ({ ...prev, [userId]: dateTime }));
  };
  const handleModeChange = (userId, mode) => {
    setInterviewModes((prev) => ({ ...prev, [userId]: mode }));
  };

  const handleSort = (column, isComputed = false) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    let sortedData;
    if (isComputed) {
      sortedData = [...candidates].sort((a, b) => {
        const aValue = (a.skills_match + a.skill_score) / 2;
        const bValue = (b.skills_match + b.skill_score) / 2;
        return order === "asc" ? aValue - bValue : bValue - aValue;
      });
    } else {
      sortedData = [...candidates].sort((a, b) => {
        return order === "asc" ? a[column] - b[column] : b[column] - a[column];
      });
    }

    setCandidates(sortedData);
  };

  return (
    <div className="viewallcandidates_container">
      <BackButton to="/recruiter-dashboard" text="Back" />
      <div className="top_candidates_container">
        <h2>All Candidates</h2>

        <select onChange={(e) => setStatusFilter(e.target.value)} className="recruiter_applicants_select">
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="to_review">To Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="to_interview">To Interview</option>
          <option value="interviewed">Interviewed</option>
          <option value="rejected">Rejected</option>
          <option value="selected">Selected</option>
          <option value="hired">Hired</option>
        </select>

        {loading ? (
          <p>Loading candidates...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <table className="candidates_table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th onClick={() => handleSort("final_score")}>Match Score ⬍</th>
                  <th onClick={() => handleSort("skills_match", true)}>Skill Match ⬍</th>
                  <th>Hiring Recommendation</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>View Profile</th>
                </tr>
              </thead>
              <tbody>
                                 {candidates
                   .filter((c) => c && typeof c === 'object' && c.status) // Only show valid candidates
                   .map((candidate) => (
                     <tr key={candidate.applicant_id} onClick={() => setSelectedCandidate(candidate)}>
                      <td>
                        <img src={candidate.profileImage || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" className="table_candidate_image" />
                      </td>
                      <td>{candidate.firstName}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phoneNumber}</td>
                                             <td>{candidate.final_score ? candidate.final_score.toFixed(2) : 'N/A'}%</td>
                       <td>{candidate.skill_score && candidate.skills_match ? ((candidate.skill_score + candidate.skills_match) / 2).toFixed(2) : 'N/A'}%</td>
                      <td className="tooltip">
                        {candidate.recruiter_insights?.hiring_recommendation || "N/A"}
                        <span className="tooltiptext">
                          {candidate.recruiter_insights?.key_qualifications?.join(", ") || "No details"}
                        </span>
                      </td>
                      <td>
                        {candidate.status === "rejected" || candidate.status === "selected" || candidate.status === "hired" ? (
                          <span>{candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}</span>
                        ) : (
                                                     <select onChange={(e) => updateStatus(candidate.applicant_id, candidate.job_id, e.target.value, interviewSchedules[candidate.applicant_id], interviewModes[candidate.applicant_id])} value={candidate.status || "applied"}>
                            <option value="applied">Applied</option>
                            <option value="to_review">To Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="to_interview">To Interview</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="selected">Selected</option>
                            <option value="hired">Hired</option>
                          </select>
                        )}
                      </td>
                      <td>
                        {(candidate.status === "shortlisted" || candidate.status === "to_interview") && (
                          <div className="schedule_interview">
                            {candidate.interviewDate && candidate.interviewMode ? (
                              <div>
                                <p>Date: {new Date(candidate.interviewDate).toLocaleString()}</p>
                                <p>Mode: {candidate.interviewMode}</p>
                              </div>
                            ) : (
                              <>
                                <label>Interview:</label>
                                                                 <input
                                   type="datetime-local"
                                   onChange={(e) => handleScheduleChange(candidate.applicant_id, e.target.value)}
                                 />
                                 <select onChange={(e) => handleModeChange(candidate.applicant_id, e.target.value)}>
                                  <option value="">Select Mode</option>
                                  <option value="online">Online</option>
                                  <option value="in-person">In-Person</option>
                                </select>
                                <button
                                  className="schedule_btn"
                                                                     onClick={() =>
                                     updateStatus(
                                       candidate.applicant_id,
                                       candidate.job_id,
                                       candidate.status,
                                       interviewSchedules[candidate.applicant_id],
                                       interviewModes[candidate.applicant_id]
                                     )
                                   }
                                >
                                  Confirm
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                                                 <button onClick={() => window.open(`/profile/${candidate.applicant_id}`, "_blank")} className="view_profile">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {selectedCandidate && (
              <div className="candidate_details">
                <h3>Candidate Details</h3>
                <img src={selectedCandidate.profileImage || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" className="candidate_large_image" />
                <p><strong>Name:</strong> {selectedCandidate.firstName}</p>
                <p><strong>Email:</strong> {selectedCandidate.email}</p>
                <p><strong>Phone:</strong> {selectedCandidate.phoneNumber}</p>
                <p><strong>LinkedIn:</strong> {selectedCandidate.linkedInProfile}</p>

                <h4>Match Scores</h4>
                                 <p><strong>Final Match Score:</strong> {selectedCandidate.final_score ? selectedCandidate.final_score.toFixed(2) : 'N/A'}%</p>
                 <p><strong>Skill Match:</strong> {selectedCandidate.skill_score && selectedCandidate.skills_match ? ((selectedCandidate.skill_score + selectedCandidate.skills_match) / 2).toFixed(2) : 'N/A'}%</p>
                 <p><strong>Education Match:</strong> {selectedCandidate.education_score ? selectedCandidate.education_score.toFixed(2) : 'N/A'}%</p>
                 <p><strong>Experience Match:</strong> {selectedCandidate.experience_score ? selectedCandidate.experience_score.toFixed(2) : 'N/A'}%</p>

                <h4>Insights</h4>
                <p><strong>AI Recommendation:</strong> {selectedCandidate.recruiter_insights?.hiring_recommendation || "N/A"}</p>
                <p><strong>Concerns:</strong> {selectedCandidate.recruiter_insights?.concerns?.join(", ") || "N/A"}</p>
                <p><strong>Key Qualifications:</strong> {selectedCandidate.recruiter_insights?.key_qualifications?.join(", ") || "N/A"}</p>
                <p><strong>Feedback:</strong> {selectedCandidate.job_seeker_insights?.overall_feedback}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAllCandidates;
