import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
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
        const response = await axios.get(`http://localhost:5000/api/applications/get_applications?jobId=${jobId}`);
        const applications = response.data.applications || [];
        const enrichedCandidates = await Promise.all(
          applications.map(async (candidate) => {
            const userResponse = await axios.get(`http://localhost:5000/api/auth/get_user?userId=${candidate.userId}`);
            return { ...candidate, ...userResponse.data };
          })
        );

        const sortedCandidates = enrichedCandidates
          .filter((c) => c.status !== "")
          .sort((a, b) => b.final_score - a.final_score);
        console.log(sortedCandidates);
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
    <div className="viewallcandidates_container">
      <Header />
      <BackButton to="/recruiter-dashboard" text="Back to Dashboard" />
      <div className="top_candidates_container">
        <h2>All Candidates</h2>

        <select onChange={(e) => setStatusFilter(e.target.value)} className="recruiter_applicants_select">
          <option value="">All Status</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
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
                  .filter((c) => !statusFilter || c.status === statusFilter)
                  .map((candidate) => (
                    <tr key={candidate.userId} onClick={() => setSelectedCandidate(candidate)}>
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
  );
};

export default ViewAllCandidates;
