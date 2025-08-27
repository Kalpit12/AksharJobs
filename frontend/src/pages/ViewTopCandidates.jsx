import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import "../styles/ViewTopCandidates.css";

import BackButton from "../components/BackButton";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Card = ({ candidate, updateStatus, handleScheduleChange, interviewSchedules, interviewModes, setInterviewModes }) => {
  // Safety check for candidate data
  if (!candidate || typeof candidate !== 'object' || !candidate.userId) {
    console.warn('Invalid candidate data passed to Card component:', candidate);
    return null; // Don't render anything if candidate data is invalid
  }

  return (
    <div className="candidate_card">
      <div className="candidate_header">
        <img
          src={candidate.profileImage || "https://www.w3schools.com/w3images/avatar2.png"}
          alt={candidate.name}
          className="candidate_image"
        />
        <h2>{candidate.firstName + " " + candidate.lastName}</h2>
      </div>
             <p className="info"><strong>Email:</strong> {candidate.email || "N/A"}</p>
       <p className="info"><strong>Phone:</strong> {candidate.phoneNumber || "N/A"}</p>
       <p className="info"><strong>Matched Score:</strong> {typeof candidate.final_score === 'number' ? candidate.final_score.toFixed(2) : 'N/A'}%</p>
       <p className="info"><strong>Skills Score:</strong> {typeof candidate.skill_score === 'number' && typeof candidate.skills_match === 'number' ? ((candidate.skill_score + candidate.skills_match) / 2).toFixed(2) : 'N/A'}%</p>
       <p className="info"><strong>Education Score:</strong> {typeof candidate.education_score === 'number' ? candidate.education_score.toFixed(2) : 'N/A'}%</p>
       <p className="info"><strong>Experience Score:</strong> {typeof candidate.experience_score === 'number' ? candidate.experience_score.toFixed(2) : 'N/A'}%</p>
      <div className="recruiter_insights">
        <p><strong>Hiring Recommendation:</strong> {candidate.recruiter_insights?.hiring_recommendation || "N/A"}</p>
        <p><strong>Concerns:</strong> {candidate.recruiter_insights?.concerns?.join(", ") || "No concerns listed"}</p>
        <p><strong>Key Qualifications:</strong> {candidate.recruiter_insights?.key_qualifications?.join(", ") || "Not specified"}</p>
      </div>

      <div className="action_buttons">
        {candidate.status === "accepted" ? (
          <button className="accepted" disabled>Accepted</button>
        ) : candidate.status === "rejected" ? (
          <button className="rejected" disabled>Rejected</button>
        ) : (
          <>
            <button onClick={() => updateStatus(candidate.userId, "shortlisted", interviewSchedules[candidate.userId], interviewModes[candidate.userId])} className="shortlist">Shortlist</button>
            <button onClick={() => updateStatus(candidate.userId, "accepted", interviewSchedules[candidate.userId], interviewModes[candidate.userId])} className="accept">Accept</button>
            <button onClick={() => updateStatus(candidate.userId, "rejected", interviewSchedules[candidate.userId], interviewModes[candidate.userId])} className="reject">Reject</button>
          </>
        )}
        <button onClick={() => window.open(`/profile/${candidate.userId}`, "_blank")} className="top_candidates_view_profile">View Profile</button>
      </div>

      {candidate.status === "shortlisted" && (
        <div className="schedule_interview">
          {candidate.interviewDate && candidate.interviewMode ? (
            <div>
              <p>Date: {new Date(candidate.interviewDate).toLocaleString()}</p>
              <p>Mode: {candidate.interviewMode}</p>
            </div>
          ) : (
            <>
              <label>Schedule Interview:</label>
              <input type="datetime-local" onChange={(e) => handleScheduleChange(candidate.userId, e.target.value)} />
              <select onChange={(e) => setInterviewModes(prev => ({ ...prev, [candidate.userId]: e.target.value }))}>
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="telephonic">Telephonic</option>
              </select>
              <button className="schedule_btn" onClick={() => updateStatus(candidate.userId, candidate.status, interviewSchedules[candidate.userId], interviewModes[candidate.userId])}>Confirm</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ViewTopCandidates = () => {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewSchedules, setInterviewSchedules] = useState({});
  const [interviewModes, setInterviewModes] = useState({});
  const [sortKey, setSortKey] = useState("final_score"); 

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/get_applications?jobId=${jobId}`);
        const applications = response.data.applications || [];
        const enrichedCandidates = await Promise.all(
          applications.map(async (candidate) => {
            try {
              const userResponse = await axios.get(`http://localhost:5000/api/auth/get_user?userId=${candidate.userId}`);
              // Ensure userResponse.data is valid and not an empty object
              if (userResponse.data && typeof userResponse.data === 'object' && Object.keys(userResponse.data).length > 0) {
                return { ...candidate, ...userResponse.data };
              } else {
                console.warn('Invalid user data received for candidate:', candidate.userId);
                return candidate; // Return original candidate data if user data is invalid
              }
            } catch (error) {
              console.error('Error fetching user data for candidate:', candidate.userId, error);
              return candidate; // Return original candidate data if user fetch fails
            }
          })
        );

        // Exclude candidates with empty status and filter out invalid candidates
        const sortedCandidates = enrichedCandidates
          .filter((c) => c && typeof c === 'object' && c.status && c.status !== "" && c.userId) // Filter out invalid candidates
          .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
          .slice(0, 10);

        console.log('Raw candidates:', sortedCandidates);
        console.log('Valid candidates for charts:', validCandidatesForCharts);
        setCandidates(sortedCandidates);

      } catch (err) {
        setError("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [jobId]);

  const updateStatus = async (userId, status, interviewDate, interviewMode) => {
    try {
      await axios.put("http://localhost:5000/api/applications/update_status", { userId, jobId, status, interviewDate, interviewMode });
      setCandidates((prev) => prev.map((c) => (c.userId === userId ? { ...c, status, interviewDate, interviewMode } : c)));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Filter out any candidates with empty objects or invalid data
  const validCandidatesForCharts = candidates.filter(c => 
    c && 
    typeof c === 'object' && 
    Object.keys(c).length > 0 && // Ensure not an empty object
    c.firstName && 
    c.lastName && 
    typeof c.firstName === 'string' && 
    typeof c.lastName === 'string' &&
    c.firstName.trim() !== '' &&
    c.lastName.trim() !== '' &&
    typeof c.final_score === 'number' && 
    !isNaN(c.final_score) &&
    c.final_score >= 0
  );

  const barChartData = {
    labels: validCandidatesForCharts.map((c) => `${c.firstName} ${c.lastName}`),
    datasets: [
      {
        label: "Final Score",
        data: validCandidatesForCharts.map((c) => c.final_score),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: validCandidatesForCharts.map((c) => `${c.firstName} ${c.lastName}`),
    datasets: [
      {
        label: "Skills Score",
        data: validCandidatesForCharts
          .filter(c => typeof c.skills_match === 'number' && typeof c.skill_score === 'number' && !isNaN(c.skills_match) && !isNaN(c.skill_score))
          .map((c) => (c.skills_match + c.skill_score) / 2),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
      {
        label: "Education Score",
        data: validCandidatesForCharts
          .filter(c => typeof c.education_score === 'number' && !isNaN(c.education_score))
          .map((c) => c.education_score),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
      {
        label: "Experience Score",
        data: validCandidatesForCharts
          .filter(c => typeof c.experience_score === 'number' && !isNaN(c.experience_score))
          .map((c) => c.experience_score),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
    ],
  };

  const sortedComparisonCandidates = [...candidates]
    .filter(c => c && typeof c === 'object' && c.userId) // Filter out invalid candidates
    .sort((a, b) => {
      const aValue = sortKey === "skills_avg" ? (a.skills_match + a.skill_score) / 2 : a[sortKey] || 0;
      const bValue = sortKey === "skills_avg" ? (b.skills_match + b.skill_score) / 2 : b[sortKey] || 0;
      return bValue - aValue;
    });

  // Ensure all chart data has the same length by using the same filtered candidates
  const validCandidates = sortedComparisonCandidates
    .filter(c => c && c.firstName && c.lastName && typeof c.firstName === 'string' && typeof c.lastName === 'string' && 
                  typeof c.final_score === 'number' && !isNaN(c.final_score) &&
                  typeof c.education_score === 'number' && !isNaN(c.education_score) &&
                  typeof c.experience_score === 'number' && !isNaN(c.experience_score) &&
                  typeof c.skills_match === 'number' && typeof c.skill_score === 'number' && 
                  !isNaN(c.skills_match) && !isNaN(c.skill_score));

  const chartData = {
    labels: validCandidates.map((c) => c.firstName + " " + c.lastName),
    datasets: [
      {
        label: "Overall Match",
        data: validCandidates.map((c) => c.final_score),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Education Match",
        data: validCandidates.map((c) => c.education_score),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Experience Match",
        data: validCandidates.map((c) => c.experience_score),
        backgroundColor: "rgba(255, 159, 64, 0.8)",
      },
      {
        label: "Skills Match",
        data: validCandidates.map((c) => (c.skills_match + c.skill_score) / 2),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
    ],
  };
  
  const handleScheduleChange = (userId, dateTime) => {
    setInterviewSchedules((prev) => ({ ...prev, [userId]: dateTime }));
  };

  const chartOptions = {
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          const labelToKeyMap = {
            "Overall Match": "final_score",
            "Education Match": "education_score",
            "Experience Match": "experience_score",
            "Skills Match": "skills_avg",
          };
          const selectedLabel = legendItem.text;
          const key = labelToKeyMap[selectedLabel];
          if (key) {
            setSortKey(key);
          }
        },
        labels: {
          font: {
            size: 14,
          },
          color: "black",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
          color: "black",
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
          color: "black",
        },
      },
    },
  };
  
  return (
    <div className="viewtopcandidates_container">
      <BackButton to="/recruiter-dashboard" text="Back" />
      <div className="top_candidates_container">
        <h2>Top Candidates</h2>
        {loading ? (
          <p>Loading candidates...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : candidates.length === 0 ? (
          <p>No candidates found for this job.</p>
        ) : (
          <>
            {validCandidatesForCharts.length > 0 ? (
              <>
                <div className="charts_comparison">
                  <div className="chart_box">
                    <h3>Final Score Comparison</h3>
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                  <div className="chart_box">
                    <h3>Trends in Scores</h3>
                    <Line data={lineChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="top_candidates_chart_container">
                  <h3>Comparison of Candidates</h3>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </>
            ) : (
              <div className="no-chart-data">
                <p>No valid candidate data available for charts. Please ensure candidates have complete score information.</p>
              </div>
            )}
            <div className="top_candidates_list">
              {candidates
                .filter(candidate => candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0 && candidate.userId && 
                                   candidate.firstName && candidate.lastName && 
                                   typeof candidate.firstName === 'string' && typeof candidate.lastName === 'string' &&
                                   candidate.firstName.trim() !== '' && candidate.lastName.trim() !== '') // Filter out invalid candidates
                .map((candidate) => {
                  // Additional safety check for required candidate properties
                  if (!candidate.firstName || !candidate.lastName || typeof candidate.final_score !== 'number') {
                    console.warn('Invalid candidate data:', candidate);
                    return null; // Skip rendering invalid candidates
                  }
                  
                  return (
                    <Card
                      key={candidate.userId}
                      candidate={candidate}
                      updateStatus={updateStatus}
                      handleScheduleChange={handleScheduleChange}
                      interviewSchedules={interviewSchedules}
                      interviewModes={interviewModes}
                      setInterviewModes={setInterviewModes}
                    />
                  );
                })
                .filter(Boolean) // Remove any null values
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTopCandidates;
