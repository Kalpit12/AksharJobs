import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

import BackButton from "../components/BackButton";
import API_CONFIG from "../config/api.js";

const ProfilePage = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(
          `${API_CONFIG.BASE_URL}/api/auth/get_user?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userResponse.data);

        if (userResponse.data.userType === "jobSeeker") {
          const resumeResponse = await axios.get(
            `${API_CONFIG.BASE_URL}/api/resumes/get_resumes_for_profile/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Resume Data from API:", resumeResponse.data);
          setResumeData(resumeResponse.data || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleDownload = async () => {
    if (!resumeData || !resumeData.fileId) { 
      console.error("No valid fileId found");
      return;
    }

    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/api/resumes/download/${resumeData.fileId}`, 
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response)
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resumeData.unique_filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const recruiterAvatar = "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180"; 
  const jobSeekerAvatar = "https://www.w3schools.com/w3images/avatar2.png";

  const profileImageUrl = userData?.profileImage || (role === "recruiter" ? recruiterAvatar : jobSeekerAvatar);

  const renderOverviewTab = () => (
    <div className="profile-overview">
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h4>Education</h4>
            <p>{resumeData?.education?.length || 0} entries</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h4>Experience</h4>
            <p>{resumeData?.experience?.length || 0} entries</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h4>Projects</h4>
            <p>{resumeData?.projects?.length || 0} entries</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h4>Certifications</h4>
            <p>{resumeData?.certificates?.length || 0} entries</p>
          </div>
        </div>
      </div>

      {resumeData?.profile_summary && (
        <div className="profile-summary-section">
          <h3>Professional Summary</h3>
          <p className="profile_summary">{resumeData.profile_summary}</p>
        </div>
      )}

      {resumeData?.skills?.length > 0 && (
        <div className="skills-section">
          <h3>Key Skills</h3>
          <div className="skills-grid">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                <span className="skill-icon">⚡</span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderResumeTab = () => (
    <div className="resume-section">
      <div className="resume-actions">
        <button className="download-btn" onClick={handleDownload}>
          <span className="btn-icon">📥</span>
          Download Resume
        </button>
        {resumeData?.filename && (
          <div className="resume-info">
            <p><strong>Current Resume:</strong> {resumeData.filename}</p>
            <p><strong>Last Updated:</strong> {resumeData.upload_date || 'N/A'}</p>
          </div>
        )}
      </div>

      {resumeData?.download_url && resumeData.filename?.endsWith(".pdf") ? (
        <div className="resume-preview-container">
          <h3>Resume Preview</h3>
          <iframe
            src={`${API_CONFIG.BASE_URL}/api/resumes/preview/${resumeData.fileId}`}
            className="resume_preview"
            title="Resume Preview"
          ></iframe>
        </div>
      ) : (
        <div className="no-preview">
          <p>Preview not available for this file type. Please download it.</p>
        </div>
      )}
    </div>
  );

  const renderDetailsTab = () => (
    <div className="profile-details">
      {resumeData?.education?.length > 0 && (
        <div className="detail-section">
          <h3>Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="profile_education">
              <div className="education-header">
                <h4>{edu.degree}</h4>
                <span className="education-year">{edu.year || "N/A"}</span>
              </div>
              <p className="university-name">{edu.university}</p>
              {edu.grade && <p className="grade"><strong>Grade:</strong> {edu.grade}</p>}
            </div>
          ))}
        </div>
      )}

      {resumeData?.experience?.length > 0 && (
        <div className="detail-section">
          <h3>Work Experience</h3>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="profile_experience">
              <div className="experience-header">
                <h4>{exp.title}</h4>
                <span className="company-name">{exp.company}</span>
              </div>
              <p className="experience-location">{exp.location || "Location not specified"}</p>
              <p className="experience-duration">{exp.start_date} - {exp.end_date || "Present"}</p>
              <p className="experience-description">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {resumeData?.projects?.length > 0 && (
        <div className="detail-section">
          <h3>Projects</h3>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="profile_project">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {project.tools && (
                <div className="project-tools">
                  <strong>Tools Used:</strong>
                  <div className="tools-list">
                    {project.tools.map((tool, toolIndex) => (
                      <span key={toolIndex} className="tool-tag">{tool}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resumeData?.certificates?.length > 0 && (
        <div className="detail-section">
          <h3>Certifications</h3>
          <div className="certifications-grid">
            {resumeData.certificates.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-icon">🏆</div>
                <div className="cert-content">
                  <h4>{cert.name}</h4>
                  <p>{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="profile">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <BackButton to="/" text="Back" />
      
      <div className="profile_container">
        <div className="profile_header">
          <div className="profile_image_container">
            <img src={profileImageUrl} alt="Profile" className="profile_image" />
            <div className="profile_status">
              <span className="status-dot"></span>
              <span className="status-text">Active</span>
            </div>
          </div>
          
          <div className="profile_info">
            <div className="profile_name_section">
              <h2>{userData?.firstName} {userData?.lastName}</h2>
              <span className="user_type_badge">{role === "recruiter" ? "Recruiter" : "Job Seeker"}</span>
            </div>
            
            <div className="profile_contact">
              <div className="contact_item">
                <span className="contact_icon">📧</span>
                <span>{userData?.email}</span>
              </div>
              <div className="contact_item">
                <span className="contact_icon">📱</span>
                <span>{userData?.phoneNumber || "Phone not available"}</span>
              </div>
              {userData?.linkedInProfile && (
                <div className="contact_item">
                  <span className="contact_icon">💼</span>
                  <a href={userData.linkedInProfile} target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>

            {role === "recruiter" && userData?.companyName && (
              <div className="company_info">
                <h4>Company: {userData.companyName}</h4>
                {userData.companyWebsite && (
                  <a href={userData.companyWebsite} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {role === "jobSeeker" && userData && resumeData ? (
          <div className="profile_content">
            <div className="profile_tabs">
              <button 
                className={`tab_button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span className="tab_icon">📊</span>
                Overview
              </button>
              <button 
                className={`tab_button ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => setActiveTab('resume')}
              >
                <span className="tab_icon">📄</span>
                Resume
              </button>
              <button 
                className={`tab_button ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <span className="tab_icon">📋</span>
                Details
              </button>
            </div>

            <div className="tab_content">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'resume' && renderResumeTab()}
              {activeTab === 'details' && renderDetailsTab()}
            </div>
          </div>
        ) : role === "recruiter" && userData ? (
          <div className="recruiter_profile">
            <h3>Company Information</h3>
            <div className="company_details">
              <p><strong>Company Name:</strong> {userData.companyName || "Not specified"}</p>
              <p><strong>Website:</strong> {userData.companyWebsite ? (
                <a href={userData.companyWebsite} target="_blank" rel="noopener noreferrer">
                  {userData.companyWebsite}
                </a>
              ) : "Not specified"}</p>
            </div>
          </div>
        ) : (
          <div className="no_data_message">
            <div className="no_data_icon">📝</div>
            <h3>No Profile Data Available</h3>
            <p>Complete your profile to see your information here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
