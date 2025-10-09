import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../config/api";

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
          // Get match score directly from the match score endpoint
          axios.get(`http://localhost:3002/api/applications/match-score/${jobId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }).then(res => ({
            data: res.data.match_data || {}
          })).catch(err => {
            console.log("No existing match score, will calculate new one");
            return { data: {} };
          }),
          axios.get(`http://localhost:3002/api/modern-resumes/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`http://localhost:3002/api/jobs/get_job/${jobId}`),
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

        // Check if we have match score data
        if (matchRes.data && matchRes.data.final_score !== undefined) {
          console.log("✅ Found match score data:", matchRes.data);
          setMatchDetails({
            final_score: matchRes.data.final_score,
            skills_match: matchRes.data.skills_match,
            experience_match: matchRes.data.experience_match,
            education_match: matchRes.data.education_match,
            cached: matchRes.data.cached,
            status: "" // Not applied yet
          });
        } else {
          console.log("⚠️ No match score found - this should trigger calculation");
          // The match score endpoint should calculate it automatically
          // If it doesn't work, there might be a resume issue
          setError("Unable to calculate match score. Please ensure your resume is properly uploaded.");
        }

        // Set resume and job details
        if (resumeRes.data.resume_data && !resumeRes.data.is_default) {
          setResumeDetails(resumeRes.data);
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
      // Apply for the job using the correct endpoint
      const response = await axios.post(
        `http://localhost:3002/api/applications/apply`,
        { job_id: jobId, cover_letter: "" },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
            "Content-Type": "application/json" 
          } 
        }
      );
      
      console.log("✅ Application submitted:", response.data);
      setMatchDetails((prev) => ({ ...prev, status: "applied" }));

    } catch (error) {
      console.error("❌ Error applying for job:", error.response?.data || error.message);
      if (error.response?.status === 402) {
        alert("Application processing temporarily disabled. Please contact support if you need assistance.");
      } else {
        alert("Failed to apply for job. Please try again.");
      }
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
            <h3>📊 AI Analysis & Insights</h3>
            
            <div className="insight_section">
              <h4>🎯 Overall Feedback</h4>
              <p>{matchDetails.job_seeker_insights?.overall_feedback || 'Not available'}</p>
            </div>

            <div className="insight_section">
              <h4>✅ Your Strengths</h4>
              <ul>
                {matchDetails.job_seeker_insights?.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                )) || <li>No strengths data available</li>}
              </ul>
            </div>

            <div className="insight_section">
              <h4>⚠️ Areas for Improvement</h4>
              <ul>
                {matchDetails.job_seeker_insights?.gaps?.map((gap, index) => (
                  <li key={index}>{gap}</li>
                )) || <li>No gaps data available</li>}
              </ul>
            </div>

            <div className="insight_section">
              <h4>💡 Improvement Suggestions</h4>
              <ul>
                {matchDetails.job_seeker_insights?.improvement_suggestions?.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                )) || <li>No improvement suggestions available</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Recruiter Insights */}
        {matchDetails.recruiter_insights && (
          <div className="match_score_recruiter_insights">
            <h3>👔 Recruiter's Perspective</h3>
            
            <div className="insight_section">
              <h4>🔑 Key Qualifications</h4>
              <ul>
                {matchDetails.recruiter_insights?.key_qualifications?.map((qual, index) => (
                  <li key={index}>{qual}</li>
                )) || <li>No key qualifications data available</li>}
              </ul>
            </div>

            <div className="insight_section">
              <h4>⚠️ Areas of Concern</h4>
              <ul>
                {matchDetails.recruiter_insights?.concerns?.map((concern, index) => (
                  <li key={index}>{concern}</li>
                )) || <li>No concerns data available</li>}
              </ul>
            </div>

            <div className="insight_section">
              <h4>📋 Hiring Recommendation</h4>
              <div className={`recommendation ${matchDetails.recruiter_insights?.hiring_recommendation?.toLowerCase().replace(' ', '_')}`}>
                <strong>{matchDetails.recruiter_insights?.hiring_recommendation || 'Not available'}</strong>
              </div>
            </div>
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
