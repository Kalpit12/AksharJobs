import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import "../styles/ViewTopCandidates.css";
import Header from "../components/Header";
import BackButton from "../components/BackButton";


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Card = ({ candidate, updateStatus, handleScheduleChange, interviewSchedules, interviewModes, setInterviewModes }) => (
  <div className="candidate_card">
    <div className="candidate_header">
      <img
        src={candidate.profileImage || "https://www.w3schools.com/w3images/avatar2.png"}
        alt={candidate.name}
        className="candidate_image"
      />
      <h2>{candidate.firstName + " " + candidate.lastName}</h2>
    </div>
    <p className="info"><strong>Email:</strong> {candidate.email}</p>
    <p className="info"><strong>Phone:</strong> {candidate.phoneNumber}</p>
    <p className="info"><strong>Matched Score:</strong> {candidate.final_score.toFixed(2)}%</p>
    <p className="info"><strong>Skills Score:</strong> {((candidate.skill_score + candidate.skills_match) / 2).toFixed(2)}%</p>
    <p className="info"><strong>Education Score:</strong> {candidate.education_score.toFixed(2)}%</p>
    <p className="info"><strong>Experience Score:</strong> {candidate.experience_score.toFixed(2)}%</p>
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
            const userResponse = await axios.get(`http://localhost:5000/api/auth/get_user?userId=${candidate.userId}`);
            return { ...candidate, ...userResponse.data };
          })
        );

        // Exclude candidates with empty status
        const sortedCandidates = enrichedCandidates
          .filter((c) => c.status !== "")
          .sort((a, b) => b.final_score - a.final_score)
          .slice(0, 10);

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


  const updateStatus = async (userId, status, interviewDate, interviewMode) => {
    try {
      await axios.put("http://localhost:5000/api/applications/update_status", { userId, jobId, status, interviewDate, interviewMode });
      setCandidates((prev) => prev.map((c) => (c.userId === userId ? { ...c, status, interviewDate, interviewMode } : c)));
    } catch (err) {
      alert("Failed to update status");
    }
  };
  const barChartData = {
    labels: candidates.map((c) => `${c.firstName} ${c.lastName}` || "Candidate"),
    datasets: [
      {
        label: "Final Score",
        data: candidates.map((c) => c.final_score || 0),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  const lineChartData = {
    labels: candidates.map((c) => `${c.firstName} ${c.lastName}` || "Candidate"),
    datasets: [
      {
        label: "Skills Score",
        data: candidates.map((c) => ((c.skills_match + c.skill_score) / 2) || 0),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
      {
        label: "Education Score",
        data: candidates.map((c) => c.education_score || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
      {
        label: "Experience Score",
        data: candidates.map((c) => c.experience_score || 0),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        fill: true,
        pointHoverRadius: 8,
      },
    ],
  };
  const sortedComparisonCandidates = [...candidates].sort((a, b) => {
    const aValue = sortKey === "skills_avg" ? (a.skills_match + a.skill_score) / 2 : a[sortKey] || 0;
    const bValue = sortKey === "skills_avg" ? (b.skills_match + b.skill_score) / 2 : b[sortKey] || 0;
    return bValue - aValue;
  });
  

  const chartData = {
    labels: sortedComparisonCandidates.map((c) => c.firstName + " " + c.lastName || "Candidate"),
    datasets: [
      {
        label: "Overall Match",
        data: sortedComparisonCandidates.map((c) => c.final_score || 0),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Education Match",
        data: sortedComparisonCandidates.map((c) => c.education_score || 0),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Experience Match",
        data: sortedComparisonCandidates.map((c) => c.experience_score || 0),
        backgroundColor: "rgba(255, 159, 64, 0.8)",
      },
      {
        label: "Skills Match",
        data: sortedComparisonCandidates.map((c) => ((c.skills_match + c.skill_score) / 2) || 0),
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
      <Header />
      <BackButton to="/recruiter-dashboard" text="Back to Dashboard" />
      <div className="top_candidates_container">
        <h2>Top Candidates</h2>
        {loading ? (
          <p>Loading candidates...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
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
            <div className="top_candidates_list">
                             {candidates.map((candidate) => (
                 <Card
                   key={candidate.userId}
                   candidate={candidate}
                   updateStatus={updateStatus}
                   handleScheduleChange={handleScheduleChange}
                   interviewSchedules={interviewSchedules}
                   interviewModes={interviewModes}
                   setInterviewModes={setInterviewModes}
                 />
               ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTopCandidates;
