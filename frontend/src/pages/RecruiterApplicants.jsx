import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import "../styles/ViewAllCandidates.css";
import BackButton from "../components/BackButton";

const RecruiterApplicants = () => {
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
        const userId = localStorage.getItem("userId");
        const jobsResponse = await axios.get(`http://localhost:5000/api/jobs/jobs_by_user/${userId}`);
        const jobs = jobsResponse.data;
        let allCandidates = [];

        for (const job of jobs) {
          const response = await axios.get(`http://localhost:5000/api/applications/get_applications?jobId=${job._id}`);
          const applications = response.data.applications || [];
          const enrichedCandidates = await Promise.all(
            applications.map(async (candidate) => {
              try {
                const userResponse = await axios.get(`http://localhost:5000/api/auth/get_user?userId=${candidate.userId}`);
                const jobResponse = await axios.get(`http://localhost:5000/api/jobs/job/${candidate.jobId}`);
                // Ensure both userResponse.data and jobResponse.data are valid
                if (userResponse.data && typeof userResponse.data === 'object' && Object.keys(userResponse.data).length > 0 &&
                    jobResponse.data && typeof jobResponse.data === 'object' && Object.keys(jobResponse.data).length > 0) {
                  return { ...candidate, ...userResponse.data, jobTitle: jobResponse.data.job_title };
                } else {
                  console.warn('Invalid user or job data received for candidate:', candidate.userId);
                  return candidate; // Return original candidate data if data is invalid
                }
              } catch (error) {
                console.error('Error fetching user or job data for candidate:', candidate.userId, error);
                return candidate; // Return original candidate data if fetch fails
              }
            })
          );

          allCandidates = [...allCandidates, ...enrichedCandidates.filter(Boolean)];
        }

        // Filter out invalid candidates and those with empty status
        const sortedCandidates = allCandidates
          .filter((c) => c && typeof c === 'object' && c.status && c.status !== "" && c.userId) // Filter out invalid candidates
          .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
        setCandidates(sortedCandidates);
      } catch (err) {
        setError("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const updateStatus = async (userId, jobId, status, interviewDate, interviewMode) => {
    try {
      await axios.put("http://localhost:5000/api/applications/update_status", { userId, jobId, status, interviewDate, interviewMode });
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
          <h2 className="recruiter_applicant_title">All Applicants</h2>
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
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          {/*Status Analysis */}
          <div className="recruiter_status_analysis">
            <div className="recruiter_status_box recruiter_shortlisted">
              <span className="recruiter_status_title">Shortlisted</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "shortlisted").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_accepted">
              <span className="recruiter_status_title">Accepted</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "accepted").length}</span>
            </div>
            <div className="recruiter_status_box recruiter_rejected">
              <span className="recruiter_status_title">Rejected</span>
              <span className="recruiter_status_count">{candidates.filter(c => c.status === "rejected").length}</span>
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
                          {candidate.status === "accepted" || candidate.status === "rejected" ? (
                            <span>{candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}</span>
                          ) : (
                            <select onChange={(e) => updateStatus(candidate.userId, candidate.jobId, e.target.value, interviewSchedules[candidate.userId], interviewModes[candidate.userId])} value={candidate.status || "pending"}>
                              <option value="pending">Pending Review</option>
                              <option value="shortlisted">Shortlist</option>
                              <option value="accepted">Accept</option>
                              <option value="rejected">Reject</option>
                            </select>
                          )}
                        </td>

                        <td>
                          {candidate.status === "shortlisted" && (
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
