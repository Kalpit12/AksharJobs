import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Button from "../components/Button";
import BackButton from "../components/BackButton";
import "../styles/MatchScore.css";

const MatchScore = () => {
  const { jobId } = useParams();
  const userId = localStorage.getItem("userId");

  const [matchDetails, setMatchDetails] = useState(null);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !jobId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔍 Fetching data for userId:", userId, "jobId:", jobId);
        
        const [matchRes, resumeRes, jobRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/api/applications/get_applications`, { 
            params: { userId, jobId } 
          }),
          axios.get(`http://127.0.0.1:5000/api/resumes/get_resumes/${userId}`),
          axios.get(`http://127.0.0.1:5000/api/jobs/get_job/${jobId}`),
        ]);

        console.log("📊 Match response:", matchRes.data);
        console.log("📄 Resume response:", resumeRes.data);
        console.log("📄 Resume data structure:", {
          hasData: !!resumeRes.data,
          hasResumes: !!(resumeRes.data && resumeRes.data.resumes),
          resumesLength: resumeRes.data?.resumes?.length || 0,
          fullResponse: resumeRes.data
        });
        console.log("💼 Job response:", jobRes.data);

        // Check if we have applications data
        if (matchRes.data.applications && matchRes.data.applications.length > 0) {
          console.log("✅ Found existing application:", matchRes.data.applications[0]);
          setMatchDetails(matchRes.data.applications[0]);
        } else {
          console.log("⚠️ No applications found, creating new one...");
          
          try {
            const response = await axios.post(
              "http://127.0.0.1:5000/api/applications/apply",
              { userId, jobId, status: "" },
              { 
                headers: { 
                  Authorization: `Bearer ${localStorage.getItem("token")}`, 
                  "Content-Type": "application/json" 
                } 
              }
            );

            console.log("✅ New application created:", response.data);

            // Fetch updated match details after applying
            const updatedMatchRes = await axios.get(
              `http://127.0.0.1:5000/api/applications/get_applications`, 
              { params: { userId, jobId } }
            );
            
            if (updatedMatchRes.data.applications && updatedMatchRes.data.applications.length > 0) {
              console.log("✅ Updated application data:", updatedMatchRes.data.applications[0]);
              setMatchDetails(updatedMatchRes.data.applications[0]);
            } else {
              setError("Failed to create application data");
            }
          } catch (error) {
            console.error("❌ Error creating application:", error.response?.data || error.message);
            setError("Failed to create application: " + (error.response?.data?.error || error.message));
          }
        }

        // Set resume and job details
        if (resumeRes.data.resumes && resumeRes.data.resumes.length > 0) {
          setResumeDetails(resumeRes.data.resumes[0]);
        } else {
          setError("No resume found for this user");
        }
        
        if (jobRes.data) {
          setJobDetails(jobRes.data);
        } else {
          setError("No job found with this ID");
        }
        
      } catch (error) {
        console.error("❌ Error fetching data:", error.response?.data || error.message);
        setError("Failed to fetch data: " + (error.response?.data?.error || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, jobId]);

  const handleApply = async () => {
    if (!matchDetails || matchDetails.status !== "") return;

    console.log("🚀 Attempting to apply for job:", { userId, jobId });

    try {
      // First, process the application (this creates the application record and calculates match score)
      const processResponse = await axios.post(
        `http://127.0.0.1:5000/api/applications/apply`,
        { userId, jobId, status: "applied" }
      );
      console.log("✅ Application processed:", processResponse.data);
      setMatchDetails((prev) => ({ ...prev, status: "applied" }));

      try {
        await axios.post(`http://127.0.0.1:5000/api/jobs/apply/${jobId}`, {
          applicant_id: userId,
        });
        console.log("✅ Applicant updated in job");
      } catch (error) {
        console.error("❌ Failed to apply for job:", error);
      }
    } catch (error) {
      console.error("❌ Error processing application:", error.response?.data || error.message);
    }
  };

  if (isLoading) return (
    <div className="match_score_page">

      <div className="match_score_container">
        <p>🔄 Loading match score...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="match_score_page">

      <div className="match_score_container">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>🔄 Retry</button>
      </div>
    </div>
  );

  if (!matchDetails || !resumeDetails || !jobDetails) return (
    <div className="match_score_page">

      <div className="match_score_container">
        <h2>⚠️ Missing Data</h2>
        <p>Some required data is missing:</p>
        <ul>
          <li>Match Details: {matchDetails ? '✅' : '❌'}</li>
          <li>Resume Details: {resumeDetails ? '✅' : '❌'}</li>
          <li>Job Details: {jobDetails ? '✅' : '❌'}</li>
        </ul>
        <button onClick={() => window.location.reload()}>🔄 Retry</button>
      </div>
    </div>
  );

  // Helper function to determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 50) return "yellow";
    return "red";
  };

  // Helper function to safely get score values
  const getScore = (score, defaultValue = 0) => {
    if (score === null || score === undefined || isNaN(score)) return defaultValue;
    return score;
  };

  return (
    <div className="match_score_page">

      <BackButton to="/jobseeker-dashboard" text="Back" />
      <div className="match_score_container">
        <h2>🎯 Match Score Report</h2>
        
        {/* Debug Info */}
        <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
          <strong>Debug Info:</strong> Final Score: {getScore(matchDetails.final_score)}, 
          Skills Match: {getScore(matchDetails.skills_match)}, 
          Education Score: {getScore(matchDetails.education_score)}
        </div>
        
        <div className="match_score_job_card">
          <h3>{jobDetails.job_title}</h3>
          <p><strong>Company:</strong> {jobDetails.company_name}</p>
          <p><strong>Location:</strong> {jobDetails.location}</p>
          <p><strong>Skills Required:</strong> {jobDetails.required_skills}</p>
          <p><strong>Description:</strong>{jobDetails.description}</p>
          <p><strong>Qualification:</strong>{jobDetails.education_required}</p>
          <p><strong>Experience Required:</strong>{jobDetails.experience_required}</p>
          <p><strong>Salary:</strong>{jobDetails.salary_range}</p>
          <p><strong>Responsibilities:</strong>{jobDetails.responsibilities}</p>
          <p><strong>Deadline:</strong>{jobDetails.application_deadline}</p>
          <p><strong>Remote option:</strong>{jobDetails.remote_option}  </p>
          <p><strong>Job type:</strong>{jobDetails.job_type}</p>

          {/* ATS-Style Match Score Rings */}
          <div className="match_score_rings">
            <div className="match_score_ring">
              <div className={`ring ${getScoreColor(getScore(matchDetails.final_score))}`}>
                {Math.round(getScore(matchDetails.final_score))}%
              </div>
              <p>Overall Match</p>
            </div>

            <div className="match_score_ring">
              <div className={`ring ${getScoreColor((getScore(matchDetails.skills_match) + getScore(matchDetails.skill_score)) / 2)}`}>
                {((getScore(matchDetails.skills_match) + getScore(matchDetails.skill_score)) / 2).toFixed(2)}%
              </div>
              <p>Skills Match</p>
            </div>

            <div className="match_score_ring">
              <div className={`ring ${getScoreColor(getScore(matchDetails.education_score))}`}>
                {getScore(matchDetails.education_score)}%
              </div>
              <p>Education Match</p>
            </div>

            <div className="match_score_ring">
              <div className={`ring ${getScoreColor(getScore(matchDetails.experience_score))}`}>
                {getScore(matchDetails.experience_score)}%
              </div>
              <p>Experience Match</p>
            </div>
          </div>
        </div>

        {/* Job Seeker Insights */}
        {matchDetails.job_seeker_insights && (
          <div className="match_score_insights">
            <p><strong>Overall Feedback:</strong> {matchDetails.job_seeker_insights?.overall_feedback || 'Not available'}</p>

            <p><strong>Strengths:</strong></p>
            <ul>
              {matchDetails.job_seeker_insights?.strengths?.map((strength, index) => (
                <li key={index}>{strength}</li>
              )) || <li>No strengths data available</li>}
            </ul>

            <p><strong>Gaps:</strong></p>
            <ul>
              {matchDetails.job_seeker_insights?.gaps?.map((gap, index) => (
                <li key={index}>{gap}</li>
              )) || <li>No gaps data available</li>}
            </ul>

            <p><strong>Improvement Suggestions:</strong></p>
            <ul>
              {matchDetails.job_seeker_insights?.improvement_suggestions?.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              )) || <li>No improvement suggestions available</li>}
            </ul>
          </div>
        )}

        {/* Skill Score Explanation */}
        <div className="match_score_explanation">
          <h4>Skill Score Breakdown</h4>
          <p>{matchDetails.skill_score_why || "Skill score explanation not available."}</p>
        </div>

        <div className={`match_score_apply_button_${matchDetails.status !== "" ? "disabled" : ""}`}>
          <Button
            text={matchDetails.status === "" ? "Apply Now" : "Applied"}
            disabled={matchDetails.status !== ""}
            onClick={handleApply}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchScore;
