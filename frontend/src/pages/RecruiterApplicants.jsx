import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../config/api";

import Header from "../components/Header";
import "../styles/ViewAllCandidates.css";
import BackButton from "../components/BackButton";

const RecruiterApplicants = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [interviewSchedules, setInterviewSchedules] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewModes, setInterviewModes] = useState({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Use the new endpoint that returns all applications with user and job details
        const response = await axios.get(buildApiUrl(`/api/applications/all`));
        const applications = response.data.applications || [];
        
        // The applications already have user and job details, so we can use them directly
        const enrichedCandidates = applications.map(candidate => ({
          ...candidate,
          // Map the fields to match what the component expects
          fullName: candidate.applicant_name,
          firstName: candidate.applicant_name, // For table display
          email: candidate.applicant_email,
          phoneNumber: candidate.applicant_phone,
          jobTitle: candidate.job_title,
          companyName: candidate.company_name,
          // Keep original fields for compatibility
          userId: candidate.applicant_id,
          jobId: candidate.job_id,
          // Add missing fields that the component expects
          final_score: candidate.matchScore || 0,
          skill_score: candidate.matchScore || 0,
          skills_match: candidate.matchScore || 0,
          profileImage: "https://www.w3schools.com/w3images/avatar2.png" // Default avatar
        }));
        
        console.log('Raw applications:', applications);
        console.log('Enriched candidates:', enrichedCandidates);
        
        // Debug each filter condition
        const debugFilter = (c) => {
          const checks = {
            exists: c && typeof c === 'object',
            hasStatus: c.status && c.status !== "",
            hasApplicantId: c.applicant_id,
            statusValue: c.status,
            applicantIdValue: c.applicant_id
          };
          console.log('Filter check for candidate:', c.applicant_name, checks);
          return checks.exists && checks.hasStatus && checks.hasApplicantId;
        };
        
        // Filter out invalid candidates and those with empty status
        const sortedCandidates = enrichedCandidates
          .filter(debugFilter) // Filter out invalid candidates
          .sort((a, b) => (b.final_score || b.matchScore || 0) - (a.final_score || a.matchScore || 0));
        
        console.log('Filtered candidates:', sortedCandidates);
        setCandidates(sortedCandidates);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const updateStatus = async (userId, jobId, status, interviewDate, interviewMode) => {
    try {
              await axios.put(buildApiUrl("/api/applications/update_status"), { userId, jobId, status, interviewDate, interviewMode });
      setCandidates((prev) =>
        prev.map((c) => (c.userId === userId && c.jobId === jobId ? { ...c, status, interviewDate, interviewMode } : c))
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
    <>
      <Header />
      <div className="viewallcandidates_container">
        <BackButton to="/recruiter-dashboard" text="Back" />
        <div className="top_candidates_container">
          <div className="header_section">
            <h2 className="recruiter_applicant_title">All Applicants</h2>
            <button 
              className="tracker_btn"
              onClick={() => navigate('/modern-application-tracker')}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📊 View in Application Tracker
            </button>
          </div>
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search by Job Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search_input_jobTitle"
          />

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
          {/*Status Analysis */}
          <div className="recruiter_status_analysis">
            <div className="recruiter_status_box recruiter_applied">
              <span className="recruiter_status_title">Applied</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "applied").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_to_review">
              <span className="recruiter_status_title">To Review</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "to_review").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_shortlisted">
              <span className="recruiter_status_title">Shortlisted</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "shortlisted").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_to_interview">
              <span className="recruiter_status_title">To Interview</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "to_interview").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_interviewed">
              <span className="recruiter_status_title">Interviewed</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "interviewed").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_rejected">
              <span className="recruiter_status_title">Rejected</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "rejected").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_selected">
              <span className="recruiter_status_title">Selected</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "selected").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_hired">
              <span className="recruiter_status_title">Hired</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "hired").length}</span>
            </div>
          </div>

          {loading ? (
            <p>Loading candidates...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              <table className="candidates_table">
                <thead>
                  <tr>
                    <th>Job Title</th>
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
                    .filter((c) => c && typeof c === 'object' && c.status && c.status !== "") // Only show valid candidates with non-empty status
                    .map((candidate) => (
                      <tr key={`${candidate.userId}-${candidate.jobId}`} onClick={() => setSelectedCandidate(candidate)}>
                        <td>{candidate.jobTitle}</td>
                        <td>
                          <img src={candidate.profileImage || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" className="table_candidate_image" />
                        </td>
                        <td>{candidate.firstName}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.phoneNumber}</td>
                        <td>{candidate.final_score.toFixed(2)}%</td>
                        <td>{((candidate.skill_score + candidate.skills_match) / 2).toFixed(2)}%</td>
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
                            <select onChange={(e) => updateStatus(candidate.userId, candidate.jobId, e.target.value, interviewSchedules[candidate.userId], interviewModes[candidate.userId])} value={candidate.status || "applied"}>
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
                                    onChange={(e) => handleScheduleChange(candidate.userId, e.target.value)}
                                  />
                                  <select onChange={(e) => handleModeChange(candidate.userId, e.target.value)}>
                                    <option value="">Select Mode</option>
                                    <option value="online">Online</option>
                                    <option value="in-person">In-Person</option>
                                  </select>
                                  <button
                                    className="schedule_btn"
                                    onClick={() =>
                                      updateStatus(
                                        candidate.userId,
                                        candidate.jobId,
                                        candidate.status,
                                        interviewSchedules[candidate.userId],
                                        interviewModes[candidate.userId]
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
                          <button onClick={() => window.open(`/profile/${candidate.userId}`, "_blank")} className="view_profile">
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
                  <p><strong>Final Match Score:</strong> {selectedCandidate.final_score.toFixed(2)}%</p>
                  <p><strong>Skill Match:</strong> {((selectedCandidate.skill_score + selectedCandidate.skills_match) / 2).toFixed(2)}%</p>
                  <p><strong>Education Match:</strong> {selectedCandidate.education_score.toFixed(2)}%</p>
                  <p><strong>Experience Match:</strong> {selectedCandidate.experience_score.toFixed(2)}%</p>

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
    </>
  );
};

export default RecruiterApplicants;
