import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";
import { buildApiUrl } from "../config/api";
import { useAuth } from "../context/AuthContext";

import BackButton from "../components/BackButton";
import { useParams } from "react-router-dom";

const ResumeProfile = () => {
  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("User ID not found in params");
        setLoading(false);
        return;
      }

      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        // First, try to get resume data from the new API endpoint
        try {
          const resumeResponse = await axios.get(
            buildApiUrl('/api/resumes/profile'),
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );

          if (resumeResponse.data && resumeResponse.data.resume_data) {
            console.log("Resume data loaded successfully:", resumeResponse.data);
            setResumeData(resumeResponse.data.resume_data);
          }
        } catch (resumeError) {
          console.log("Could not fetch resume data, trying fallback:", resumeError.message);
        }

        // Fallback: Get user data from the old endpoint
        try {
          const userResponse = await axios.get(
            buildApiUrl(`/api/auth/get_user?userId=${userId}`),
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUserData(userResponse.data);

          // If we still don't have resume data, try the old resume endpoint
          if (!resumeData && userResponse.data.userType === "jobSeeker") {
            try {
              const oldResumeResponse = await axios.get(
                buildApiUrl(`/api/resumes/get_resumes_for_profile/${userId}`),
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (oldResumeResponse.data) {
                setResumeData(oldResumeResponse.data);
              }
            } catch (oldResumeError) {
              console.log("Old resume endpoint also failed:", oldResumeError.message);
            }
          }
        } catch (userError) {
          console.error("Error fetching user data:", userError.response?.data || userError);
        }

      } catch (error) {
        console.error("Error in fetchUserData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, resumeData]);

  const handleDownload = async () => {
    if (!resumeData || !resumeData.fileId) {
      console.error("No valid fileId found");
      return;
    }

    try {
      const response = await axios.get(
        buildApiUrl(`/api/resumes/download/${resumeData.fileId}`),
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resumeData.unique_filename || "resume.pdf");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const defaultAvatar = "https://www.w3schools.com/w3images/avatar2.png";
  const profileImageUrl = userData?.profileImage || defaultAvatar;

  if (loading) {
    return (
      <div className="profile">
        <BackButton to="/jobseeker-dashboard" text="Back" />
        <div className="profile_container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no resume data, show a message
  if (!resumeData) {
    return (
      <div className="profile">
        <BackButton to="/jobseeker-dashboard" text="Back" />
        <div className="profile_container">
          <div className="profile_header">
            <img src={profileImageUrl} alt="Profile" className="profile_image" />
            <div className="profile_info">
              <h2>{userData?.firstName || 'User'} {userData?.lastName || 'Name'}</h2>
              <h4>{userData?.email || 'Email not available'}</h4>
              <h4>{userData?.phoneNumber || "Phone not available"}</h4>
            </div>
          </div>
          
          <div className="no_resume_message">
            <h3>No Resume Data Available</h3>
            <p>It looks like you haven't uploaded a resume yet, or there was an issue loading your resume data.</p>
            <p>Please try:</p>
            <ul>
              <li>Uploading a new resume from your dashboard</li>
              <li>Refreshing the page</li>
              <li>Checking if you're properly logged in</li>
            </ul>
            <button 
              onClick={() => window.location.href = '/upload'} 
              className="upload_resume_btn"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <BackButton to="/jobseeker-dashboard" text="Back" />
      <div className="profile_container">
        <div className="profile_header">
          <img src={profileImageUrl} alt="Profile" className="profile_image" />
          <div className="profile_info">
            <h2>
              {resumeData.personal_info?.name || userData?.firstName || 'User'} 
              {resumeData.personal_info?.name ? '' : ` ${userData?.lastName || 'Name'}`}
            </h2>
            <h4>{resumeData.personal_info?.email || userData?.email || 'Email not available'}</h4>
            <h4>{resumeData.personal_info?.phone || userData?.phoneNumber || "Phone not available"}</h4>
            {resumeData.personal_info?.location && (
              <h4>📍 {resumeData.personal_info.location}</h4>
            )}
          </div>
        </div>

        {resumeData && (
          <div>
            {resumeData.summary && (
              <div className="profile_summary_section">
                <h3>Professional Summary</h3>
                <p className="profile_summary">{resumeData.summary}</p>
              </div>
            )}

            {resumeData.skills && (
              <div className="skills_section">
                <h3>Skills</h3>
                {resumeData.skills.technical_skills && resumeData.skills.technical_skills.length > 0 && (
                  <div className="skills_category">
                    <h4>Technical Skills</h4>
                    <ul className="skills profile_list">
                      {resumeData.skills.technical_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {resumeData.skills.soft_skills && resumeData.skills.soft_skills.length > 0 && (
                  <div className="skills_category">
                    <h4>Soft Skills</h4>
                    <ul className="skills profile_list">
                      {resumeData.skills.soft_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {resumeData.skills.languages && resumeData.skills.languages.length > 0 && (
                  <div className="skills_category">
                    <h4>Languages</h4>
                    <ul className="skills profile_list">
                      {resumeData.skills.languages.map((lang, index) => (
                        <li key={index}>{lang}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {resumeData.education && resumeData.education.length > 0 && (
              <div className="education_section">
                <h3>Education</h3>
                <ul className="education profile_list">
                  {resumeData.education.map((edu, index) => (
                    <li key={index}>
                      <strong>{edu.degree}</strong> - {edu.university}
                      {edu.year && <span> ({edu.year})</span>}
                      {edu.grade && <span> - Grade: {edu.grade}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="experience_section">
                <h3>Experience</h3>
                <ul className="experience profile_list">
                  {resumeData.experience.map((exp, index) => (
                    <li key={index}>
                      <strong>{exp.title}</strong> at {exp.company}
                      {exp.duration && <span> ({exp.duration})</span>}
                      {exp.description && <p>{exp.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="projects_section">
                <h3>Projects</h3>
                <ul className="projects profile_list">
                  {resumeData.projects.map((project, index) => (
                    <li key={index}>
                      <strong>{project.name}</strong>
                      {project.description && <p>{project.description}</p>}
                      {project.technologies && <span>Technologies: {project.technologies.join(', ')}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="certifications_section">
                <h3>Certifications</h3>
                <ul className="certifications profile_list">
                  {resumeData.certifications.map((cert, index) => (
                    <li key={index}>
                      <strong>{cert.name}</strong>
                      {cert.issuer && <span> - {cert.issuer}</span>}
                      {cert.date && <span> ({cert.date})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <div className="achievements_section">
                <h3>Achievements</h3>
                <ul className="achievements profile_list">
                  {resumeData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.fileId && (
              <div className="resume_actions">
                <button onClick={handleDownload} className="download_btn">
                  📥 Download Resume
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeProfile;
