import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ModernProfile.css";

// import BackButton from "../components/BackButton"; // Removed back button from job seeker profile
import PremiumBadge from "../components/PremiumBadge";
import CompanyProfileCard from "../components/CompanyProfileCard";
import ProfileCard from "../components/ProfileCard";
import CompanyDetailsModal from "../components/CompanyDetailsModal";
import BackendStatus from "../components/BackendStatus";
import CommunityVerificationStatus from "../components/CommunityVerificationStatus";
import { buildApiUrl, makeAuthenticatedRequest } from "../config/api.js";

const ProfilePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [internDetails, setInternDetails] = useState(null);

  // Handle contact me button click
  const handleContactClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/contact/${userId}`);
  };

  // Check if profile is complete
  const checkProfileCompleteness = (user, resume) => {
    const hasBasicInfo = user?.firstName && user?.lastName && user?.email;
    const hasResumeInfo = resume?.personal_info?.name && resume?.personal_info?.phone;
    const hasExperience = resume?.experience && resume?.experience.length > 0;
    const hasSkills = resume?.skills && (
      (resume.skills.technical_skills && resume.skills.technical_skills.length > 0) ||
      (resume.skills.soft_skills && resume.skills.soft_skills.length > 0)
    );

    return hasBasicInfo && hasResumeInfo && hasExperience && hasSkills;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await makeAuthenticatedRequest(
          buildApiUrl('/api/profile/profile')
        );

        if (userResponse && userResponse.ok) {
          const userData = await userResponse.json();
          // Map the profile data to match the expected structure
          const mappedUserData = {
            firstName: userData.fullName ? userData.fullName.split(' ')[0] : '',
            lastName: userData.fullName ? userData.fullName.split(' ').slice(1).join(' ') : '',
            email: userData.email,
            phoneNumber: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            bloodGroup: userData.bloodGroup,
            location: userData.location,
            skills: userData.skills,
            ...userData // Include any other fields
          };
          setUserData(mappedUserData);

          // Check subscription status
          if (userData.subscription) {
            setSubscriptionData(userData.subscription);
            setIsPremium(userData.subscription.plan !== 'Basic' && userData.subscription.status === 'active');
          }

          if (userData.userType === "jobSeeker") {
                        const resumeResponse = await makeAuthenticatedRequest(
                            buildApiUrl(`/api/modern-resumes/profile`)
                        );
            
            if (resumeResponse && resumeResponse.ok) {
              const resumeData = await resumeResponse.json();
              console.log("Resume Data from API:", resumeData);
              console.log("Experience data:", resumeData?.experience);
              console.log("Skills data:", resumeData?.skills);
              console.log("Personal info:", resumeData?.personal_info);
              setResumeData(resumeData || null);
              
              // Check profile completeness for job seekers
              const isComplete = checkProfileCompleteness(userData, resumeData);
              setIsProfileComplete(isComplete);
            }
          } else           if (userData.userType === "intern") {
            // Fetch intern details
            const internResponse = await makeAuthenticatedRequest(
              buildApiUrl('/api/interns/profile')
            );
            
            if (internResponse && internResponse.ok) {
              const internData = await internResponse.json();
              console.log("Intern Details from API:", internData);
              setInternDetails(internData);
              setResumeData(internData); // Use intern data as resume data for display
              
              // Update userData with intern-specific fields
              setUserData(prev => ({
                ...prev,
                phoneNumber: internData.mobile || prev.phoneNumber,
                location: internData.currentLocation || prev.location,
                dateOfBirth: internData.dateOfBirth || prev.dateOfBirth,
                gender: internData.gender || prev.gender
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        // If it's a network error, show a helpful message
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.warn('Backend server may not be running. Please check if the backend is started.');
          // You could show a user-friendly message here
        }
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
      const response = await makeAuthenticatedRequest(
        buildApiUrl(`/api/resumes/download/${resumeData.fileId}`)
      );
      
      if (!response || !response.ok) {
        throw new Error('Failed to download resume');
      }
      
      const blob = await response.blob();
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

  const handleCloseModal = () => {
    setShowCompanyModal(false);
  };

  const recruiterAvatar = "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180"; 
  const jobSeekerAvatar = "https://www.w3schools.com/w3images/avatar2.png";

  const profileImageUrl = userData?.profileImage || (role === "recruiter" ? recruiterAvatar : jobSeekerAvatar);

  const renderOverviewTab = () => (
    <div className="profile-overview">
      {/* Basic User Information */}
      <div className="user-info-section">
        <h3>Personal Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{userData?.firstName} {userData?.lastName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{userData?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{userData?.phoneNumber || "Not provided"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role:</span>
            <span className="info-value">{role === "recruiter" ? "Recruiter" : "Job Seeker"}</span>
          </div>
          {userData?.dateOfBirth && (
            <div className="info-item">
              <span className="info-label">Date of Birth:</span>
              <span className="info-value">{userData.dateOfBirth}</span>
            </div>
          )}
          {userData?.gender && (
            <div className="info-item">
              <span className="info-label">Gender:</span>
              <span className="info-value">{userData.gender}</span>
            </div>
          )}
          {userData?.bloodGroup && (
            <div className="info-item">
              <span className="info-label">Blood Group:</span>
              <span className="info-value">{userData.bloodGroup}</span>
            </div>
          )}
          {userData?.location && (
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{userData.location}</span>
            </div>
          )}
          {userData?.skills && userData.skills.length > 0 && (
            <div className="info-item">
              <span className="info-label">Skills:</span>
              <span className="info-value">
                <div className="skills-tags">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </span>
            </div>
          )}
          {userData?.jobPreferences && Object.keys(userData.jobPreferences).length > 0 && (
            <div className="info-item">
              <span className="info-label">Job Preferences:</span>
              <span className="info-value">
                {userData.jobPreferences.jobType && <div>Type: {userData.jobPreferences.jobType}</div>}
                {userData.jobPreferences.workMode && <div>Mode: {userData.jobPreferences.workMode}</div>}
                {userData.jobPreferences.experienceLevel && <div>Level: {userData.jobPreferences.experienceLevel}</div>}
                {userData.jobPreferences.industry && <div>Industry: {userData.jobPreferences.industry}</div>}
                {userData.jobPreferences.companySize && <div>Company Size: {userData.jobPreferences.companySize}</div>}
              </span>
            </div>
          )}
          {userData?.salaryExpectations && (userData.salaryExpectations.minSalary || userData.salaryExpectations.maxSalary) && (
            <div className="info-item">
              <span className="info-label">Salary Expectations:</span>
              <span className="info-value">
                {userData.salaryExpectations.minSalary && userData.salaryExpectations.maxSalary && (
                  <div>{userData.salaryExpectations.minSalary} - {userData.salaryExpectations.maxSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}</div>
                )}
                {userData.salaryExpectations.minSalary && !userData.salaryExpectations.maxSalary && (
                  <div>Min: {userData.salaryExpectations.minSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}</div>
                )}
                {!userData.salaryExpectations.minSalary && userData.salaryExpectations.maxSalary && (
                  <div>Max: {userData.salaryExpectations.maxSalary} {userData.salaryExpectations.currency} {userData.salaryExpectations.period}</div>
                )}
              </span>
            </div>
          )}
          {userData?.linkedinProfile && (
            <div className="info-item">
              <span className="info-label">LinkedIn:</span>
              <span className="info-value">
                <a href={userData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="profile-link">
                  {userData.linkedinProfile}
                </a>
              </span>
            </div>
          )}
          {userData?.portfolio && (
            <div className="info-item">
              <span className="info-label">Portfolio:</span>
              <span className="info-value">
                <a href={userData.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link">
                  {userData.portfolio}
                </a>
              </span>
            </div>
          )}
          {userData?.bio && (
            <div className="info-item full-width">
              <span className="info-label">Bio:</span>
              <span className="info-value bio-text">{userData.bio}</span>
            </div>
          )}
          {userData?.companyName && (
            <div className="info-item">
              <span className="info-label">Company:</span>
              <span className="info-value">{userData.companyName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Intern Details Section */}
      {role === "intern" && internDetails && (
        <div className="intern-details-section">
          <h3>🎓 Intern Profile</h3>
          
          {/* Educational Details */}
          <div className="info-section">
            <h4>📚 Educational Background</h4>
            <div className="info-grid">
              {internDetails.collegeName && (
                <div className="info-item">
                  <span className="info-label">College/University:</span>
                  <span className="info-value">{internDetails.collegeName}</span>
                </div>
              )}
              {internDetails.degree && (
                <div className="info-item">
                  <span className="info-label">Degree:</span>
                  <span className="info-value">{internDetails.degree}</span>
                </div>
              )}
              {internDetails.currentYear && (
                <div className="info-item">
                  <span className="info-label">Current Year:</span>
                  <span className="info-value">{internDetails.currentYear}</span>
                </div>
              )}
              {internDetails.graduationYear && (
                <div className="info-item">
                  <span className="info-label">Graduation Year:</span>
                  <span className="info-value">{internDetails.graduationYear}</span>
                </div>
              )}
              {internDetails.cgpa && (
                <div className="info-item">
                  <span className="info-label">CGPA/Percentage:</span>
                  <span className="info-value">{internDetails.cgpa}</span>
                </div>
              )}
              {internDetails.majorSubjects && (
                <div className="info-item full-width">
                  <span className="info-label">Major Subjects:</span>
                  <span className="info-value">{internDetails.majorSubjects}</span>
                </div>
              )}
            </div>
          </div>

          {/* Internship Preferences */}
          <div className="info-section">
            <h4>💼 Internship Preferences</h4>
            <div className="info-grid">
              {internDetails.internshipType && internDetails.internshipType.length > 0 && (
                <div className="info-item">
                  <span className="info-label">Internship Type:</span>
                  <span className="info-value">
                    {internDetails.internshipType.join(', ')}
                  </span>
                </div>
              )}
              {internDetails.workDomains && internDetails.workDomains.length > 0 && (
                <div className="info-item full-width">
                  <span className="info-label">Work Domains:</span>
                  <span className="info-value">
                    <div className="skills-tags">
                      {internDetails.workDomains.map((domain, index) => (
                        <span key={index} className="skill-tag">{domain}</span>
                      ))}
                    </div>
                  </span>
                </div>
              )}
              {internDetails.desiredRole && (
                <div className="info-item">
                  <span className="info-label">Desired Role:</span>
                  <span className="info-value">{internDetails.desiredRole}</span>
                </div>
              )}
              {internDetails.duration && (
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{internDetails.duration}</span>
                </div>
              )}
              {internDetails.weeklyAvailability && (
                <div className="info-item">
                  <span className="info-label">Availability:</span>
                  <span className="info-value">{internDetails.weeklyAvailability}</span>
                </div>
              )}
              {internDetails.stipendExpectation && (
                <div className="info-item">
                  <span className="info-label">Stipend Expectation:</span>
                  <span className="info-value">{internDetails.stipendExpectation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Technical Skills */}
          {internDetails.technicalSkills && internDetails.technicalSkills.length > 0 && (
            <div className="info-section">
              <h4>🛠️ Technical Skills</h4>
              <div className="skills-tags">
                {internDetails.technicalSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {internDetails.softSkills && internDetails.softSkills.length > 0 && (
            <div className="info-section">
              <h4>💡 Soft Skills</h4>
              <div className="skills-tags">
                {internDetails.softSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Prior Experience */}
          {internDetails.priorExperience && (
            <div className="info-section">
              <h4>📝 Prior Experience</h4>
              <p className="experience-text">{internDetails.priorExperience}</p>
            </div>
          )}

          {/* Career Goals */}
          <div className="info-section">
            <h4>🚀 Career Goals</h4>
            {internDetails.postGradRoles && (
              <div className="goal-item">
                <strong>Post-Graduation Interests:</strong>
                <p>{internDetails.postGradRoles}</p>
              </div>
            )}
            {internDetails.learningGoals && (
              <div className="goal-item">
                <strong>Learning Goals:</strong>
                <p>{internDetails.learningGoals}</p>
              </div>
            )}
            {internDetails.careerVision && (
              <div className="goal-item">
                <strong>Career Vision (2-3 years):</strong>
                <p>{internDetails.careerVision}</p>
              </div>
            )}
          </div>

          {/* Resume Download */}
          {internDetails.resumePath && (
            <div className="info-section">
              <h4>📄 Resume</h4>
              <a 
                href={buildApiUrl(`/${internDetails.resumePath.replace(/\\/g, '/')}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-download-btn"
              >
                📥 Download Resume
              </a>
            </div>
          )}
        </div>
      )}

      {/* Resume Data Stats (if available) - For Job Seekers */}
      {role !== "intern" && resumeData && (
        <div className="profile-stats">
          <h3>Resume Statistics</h3>
          <div className="stats-grid">
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
        </div>
      )}

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

      {/* Call to Action if no resume data */}
      {!resumeData && role === "jobSeeker" && (
        <div className="cta-section">
          <div className="cta-card">
            <div className="cta-icon">📄</div>
            <h3>Upload Your Resume</h3>
            <p>Complete your profile by uploading your resume to get better job matches.</p>
            <button 
              className="cta-button upload-resume-cta"
              onClick={() => navigate('/modern-upload')}
            >
              <span className="upload-icon">📄</span>
              Upload Resume
              <span className="ai-badge">AI-Powered</span>
            </button>
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
            src={buildApiUrl(`/api/resumes/preview/${resumeData.fileId}`)}
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
      {/* Personal Information Table */}
      {resumeData?.personal_info && (
        <div className="detail-section">
          <h3>Personal Information</h3>
          <div className="info-table-container">
            <table className="info-table">
              <tbody>
                {resumeData.personal_info.name && (
                  <tr>
                    <td className="table-label">Full Name</td>
                    <td className="table-value">{resumeData.personal_info.name}</td>
                  </tr>
                )}
                {resumeData.personal_info.email && (
                  <tr>
                    <td className="table-label">Email</td>
                    <td className="table-value">{resumeData.personal_info.email}</td>
                  </tr>
                )}
                {resumeData.personal_info.phone && (
                  <tr>
                    <td className="table-label">Phone</td>
                    <td className="table-value">{resumeData.personal_info.phone}</td>
                  </tr>
                )}
                {resumeData.personal_info.location && (
                  <tr>
                    <td className="table-label">Location</td>
                    <td className="table-value">{resumeData.personal_info.location}</td>
                  </tr>
                )}
                {resumeData.personal_info.linkedin && (
                  <tr>
                    <td className="table-label">LinkedIn</td>
                    <td className="table-value">
                      <a href={resumeData.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                        {resumeData.personal_info.linkedin}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skills Table */}
      {resumeData?.skills && (
        <div className="detail-section">
          <h3>Skills</h3>
          <div className="info-table-container">
            <table className="info-table">
              <tbody>
                {resumeData.skills.technical_skills && resumeData.skills.technical_skills.length > 0 && (
                  <tr>
                    <td className="table-label">Technical Skills</td>
                    <td className="table-value">
                      <div className="skills-tags">
                        {resumeData.skills.technical_skills.map((skill, index) => (
                          <span key={index} className="skill-tag technical">{skill}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                {resumeData.skills.soft_skills && resumeData.skills.soft_skills.length > 0 && (
                  <tr>
                    <td className="table-label">Soft Skills</td>
                    <td className="table-value">
                      <div className="skills-tags">
                        {resumeData.skills.soft_skills.map((skill, index) => (
                          <span key={index} className="skill-tag soft">{skill}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                {resumeData.skills.languages && resumeData.skills.languages.length > 0 && (
                  <tr>
                    <td className="table-label">Languages</td>
                    <td className="table-value">
                      <div className="skills-tags">
                        {resumeData.skills.languages.map((language, index) => (
                          <span key={index} className="skill-tag language">{language}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Education Table */}
      {resumeData?.education?.length > 0 && (
        <div className="detail-section">
          <h3>Education</h3>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Degree</th>
                  <th>Institution</th>
                  <th>Year</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.education.map((edu, index) => (
                  <tr key={index}>
                    <td className="table-value">{edu.degree || "N/A"}</td>
                    <td className="table-value">{edu.university || "N/A"}</td>
                    <td className="table-value">{edu.year || "N/A"}</td>
                    <td className="table-value">{edu.grade || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Work Experience Table */}
      {resumeData?.experience?.length > 0 && (
        <div className="detail-section">
          <h3>Work Experience</h3>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.experience.map((exp, index) => (
                  <tr key={index}>
                    <td className="table-value">{exp.title || "N/A"}</td>
                    <td className="table-value">{exp.company || "N/A"}</td>
                    <td className="table-value">{exp.location || "N/A"}</td>
                    <td className="table-value">
                      {exp.start_date || "N/A"} - {exp.end_date || "Present"}
                    </td>
                    <td className="table-value description-cell">{exp.description || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects Table */}
      {resumeData?.projects?.length > 0 && (
        <div className="detail-section">
          <h3>Projects</h3>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Tools Used</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.projects.map((project, index) => (
                  <tr key={index}>
                    <td className="table-value">{project.title || "N/A"}</td>
                    <td className="table-value description-cell">{project.description || "N/A"}</td>
                    <td className="table-value">
                      {project.tools && project.tools.length > 0 ? (
                        <div className="tools-tags">
                          {project.tools.map((tool, toolIndex) => (
                            <span key={toolIndex} className="tool-tag">{tool}</span>
                          ))}
                        </div>
                      ) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certifications Table */}
      {resumeData?.certificates?.length > 0 && (
        <div className="detail-section">
          <h3>Certifications</h3>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Certification</th>
                  <th>Issuer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.certificates.map((cert, index) => (
                  <tr key={index}>
                    <td className="table-value">{cert.name || "N/A"}</td>
                    <td className="table-value">{cert.issuer || "N/A"}</td>
                    <td className="table-value">{cert.date || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Achievements Table */}
      {resumeData?.achievements?.length > 0 && (
        <div className="detail-section">
          <h3>Achievements</h3>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Achievement</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.achievements.map((achievement, index) => (
                  <tr key={index}>
                    <td className="table-value">{achievement.title || "N/A"}</td>
                    <td className="table-value description-cell">{achievement.description || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompleteProfileTab = () => (
    <div className="complete-profile-section">
      <div className="complete-profile-header">
        <h3>Complete Your Profile</h3>
        <p>Add more information to make your profile stand out to employers.</p>
      </div>

      <div className="profile-completion-grid">
        {/* Job Seeker specific fields */}
        {role === "jobSeeker" && (
          <>
            <div className="completion-card">
              <div className="completion-icon">📄</div>
              <h4>Upload Resume</h4>
              <p>Upload your resume to get better job matches and showcase your experience.</p>
              <button 
                className="completion-btn primary upload-resume-cta"
                onClick={() => navigate('/modern-upload')}
              >
                <span className="upload-icon">📄</span>
                Upload Resume
                <span className="ai-badge">AI-Powered</span>
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">🎯</div>
              <h4>Add Skills</h4>
              <p>Add your technical and soft skills to improve your profile visibility.</p>
              <button 
                className="completion-btn secondary"
                onClick={() => window.location.href = '/settings'}
              >
                Add Skills
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">🎓</div>
              <h4>Education Details</h4>
              <p>Add your educational background and certifications.</p>
              <button 
                className="completion-btn secondary"
                onClick={() => window.location.href = '/settings'}
              >
                Add Education
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">💼</div>
              <h4>Work Experience</h4>
              <p>Detail your professional experience and achievements.</p>
              <button 
                className="completion-btn secondary"
                onClick={() => window.location.href = '/settings'}
              >
                Add Experience
              </button>
            </div>
          </>
        )}

        {/* Recruiter specific fields */}
        {role === "recruiter" && (
          <>
            <div className="completion-card">
              <div className="completion-icon">🏢</div>
              <h4>Company Information</h4>
              <p>Complete your company profile with detailed information.</p>
              <button 
                className="completion-btn primary"
                onClick={() => window.location.href = '/recruiter-registration'}
              >
                Complete Company Profile
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">📝</div>
              <h4>Post Jobs</h4>
              <p>Start posting job opportunities to find the best candidates.</p>
              <button 
                className="completion-btn primary"
                onClick={() => window.location.href = '/post-job'}
              >
                Post a Job
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">🔍</div>
              <h4>Browse Candidates</h4>
              <p>Search and discover talented professionals for your open positions.</p>
              <button 
                className="completion-btn secondary"
                onClick={() => window.location.href = '/all-candidates'}
              >
                Browse Candidates
              </button>
            </div>

            <div className="completion-card">
              <div className="completion-icon">📊</div>
              <h4>Analytics Dashboard</h4>
              <p>Track your recruitment performance and job posting analytics.</p>
              <button 
                className="completion-btn secondary"
                onClick={() => window.location.href = '/recruiter-dashboard'}
              >
                View Analytics
              </button>
            </div>
          </>
        )}

        {/* Common fields for both roles */}
        <div className="completion-card">
          <div className="completion-icon">📱</div>
          <h4>Contact Information</h4>
          <p>Update your phone number and contact preferences.</p>
          <button 
            className="completion-btn secondary"
            onClick={() => window.location.href = '/settings'}
          >
            Update Contact Info
          </button>
        </div>

        <div className="completion-card">
          <div className="completion-icon">🔒</div>
          <h4>Privacy Settings</h4>
          <p>Manage your privacy settings and data preferences.</p>
          <button 
            className="completion-btn secondary"
            onClick={() => window.location.href = '/settings'}
          >
            Privacy Settings
          </button>
        </div>
      </div>

      {/* Profile completion progress */}
      <div className="profile-progress">
        <h4>Profile Completion</h4>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
        <p className="progress-text">60% Complete - Keep going!</p>
      </div>
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

  // Show error state if no user data and not loading
  if (!userData && !loading) {
    return (
      <div className="profile">
        <div className="error-container" style={{
          textAlign: 'center',
          padding: '2rem',
          margin: '2rem auto',
          maxWidth: '500px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Unable to Load Profile</h2>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            The backend server may not be running or there's a connection issue.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn_primary" 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button 
              className="btn btn_secondary" 
              onClick={() => window.history.back()}
              style={{
                padding: '0.5rem 1rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-profile">
      <BackendStatus />
      
      <div className="profile-card-container">
        <ProfileCard
          name={`${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User'}
          title={(() => {
            if (role === "intern") {
              return internDetails?.desiredRole || "Intern";
            }
            const jobTitle = resumeData?.personal_info?.job_title ||
                           resumeData?.job_title ||
                           resumeData?.experience?.[0]?.title ||
                           resumeData?.personal_info?.title;
            return jobTitle || (role === "recruiter" ? "Recruiter" : "Job Seeker");
          })()}
          handle={userData?.email?.split('@')[0] || 'user'}
          status="Online"
          contactText="Contact Me"
          onContactClick={handleContactClick}
          avatarUrl={userData?.profileImage || (role === "recruiter" ? 
            "https://tse1.mm.bing.net/th?id=OIP.SLlIMAFQM9EeKfUS610FdwAAAA&pid=Api&P=0&h=180" : 
            "https://www.w3schools.com/w3images/avatar2.png")}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
        />
        
        {/* Community Verification Status */}
        {userData && userData._id && (
          <CommunityVerificationStatus 
            userId={userData._id} 
            communities={userData.communities || []} 
          />
        )}
        
        {/* Complete Profile Button for Job Seekers */}
        {role === "jobSeeker" && !isProfileComplete && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ 
              color: 'white', 
              marginBottom: '1rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              📝 Complete Your Profile
            </div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              Your profile is incomplete. Add your experience, skills, and contact information to attract more employers.
            </p>
            <button
              onClick={() => navigate('/complete-profile')}
              style={{
                background: 'white',
                color: '#f59e0b',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              Complete Profile Now
            </button>
          </div>
        )}
      </div>

      <CompanyDetailsModal
        isOpen={showCompanyModal}
        onClose={handleCloseModal}
        userData={userData}
        role={role}
      />
    </div>
  );
};

export default ProfilePage;
