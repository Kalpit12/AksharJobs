import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

const ProfilePage = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          `http://127.0.0.1:5000/api/auth/get_user?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userResponse.data);

        if (userResponse.data.userType === "jobSeeker") {
          const resumeResponse = await axios.get(
            `http://127.0.0.1:5000/api/resumes/get_resumes_for_profile/${userId}`,
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
        `http://127.0.0.1:5000/api/resumes/download/${resumeData.fileId}`, 
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


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile">
      <Header />
      <BackButton 
        to={role === "recruiter" ? "/recruiter-dashboard" : "/jobseeker-dashboard"} 
        text={`Back to ${role === "recruiter" ? "Recruiter" : "Job Seeker"} Dashboard`} 
      />
      <div className="profile_container">
        <div className="profile_header">
          <img src={profileImageUrl} alt="Profile" className="profile_image" />
          <div className="profile_info">
            <h2>{userData.firstName} {userData.lastName}</h2>
            <h4>{userData.email}</h4>
            <h4>{userData.phoneNumber || "Phone not available"}</h4>
          </div>
        </div>

        {role === "jobSeeker" && userData && resumeData ? (
          <div>
            <p className="profile_summary">{resumeData.profile_summary || "No summary available"}</p>

            <h3>Skills</h3>
            <ul className="skills profile_list">
              {resumeData.skills?.length > 0 ? (
                resumeData.skills.map((skill, index) => <li key={index}>{skill}</li>)
              ) : (
                <p>No skills available</p>
              )}
            </ul>

            <h3>Education</h3>
            {resumeData.education?.length > 0 ? (
              resumeData.education.map((edu, index) => (
                <div key={index} className="profile_education">
                  <p><strong>{edu.degree}</strong></p>
                  <p>{edu.university} ({edu.year || ""})</p>
                  {edu.grade && <p><strong>Grade:</strong> {edu.grade}</p>}
                </div>
              ))
            ) : (
              <p>No education details available</p>
            )}

            <h3>Experience</h3>
            {resumeData.experience?.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={index} className="profile_experience">
                  <p><strong>{exp.title}</strong> at {exp.company} {exp.location || ""}</p>
                  <p>{exp.start_date} - {exp.end_date || "Not given"}</p>
                  <p>{exp.description}</p>
                </div>
              ))
            ) : (
              <p>No experience available</p>
            )}

            <h3>Projects</h3>
            {resumeData.projects?.length > 0 ? (
              resumeData.projects.map((project, index) => (
                <div key={index} className="profile_project">
                  <p><strong>{project.title}</strong></p>
                  <p>{project.description}</p>
                  {project.tools && (
                    <p><strong>Tools Used:</strong> {project.tools.join(", ")}</p>
                  )}
                </div>
              ))
            ) : (
              <p>No projects available</p>
            )}

            <h3>Certifications</h3>
            {resumeData.certificates?.length > 0 ? (
              resumeData.certificates.map((cert, index) => (
                <p key={index}><strong>{cert.name}</strong>  {cert.issuer}</p>
              ))
            ) : (
              <p>No certifications available</p>
            )}

            <h3>Resume</h3>
            {resumeData.filename && <p><strong>Filename:</strong> {resumeData.filename}</p>}

            {resumeData.download_url && (
              <button className="download-btn" onClick={handleDownload}>Download Resume</button>
            )}

            {resumeData.download_url && resumeData.filename.endsWith(".pdf") ? (
              <iframe
                src={`http://127.0.0.1:5000/api/resumes/preview/${resumeData.fileId}`}
                className="resume_preview"
                title="Resume Preview"
              ></iframe>
            ) : (
              <p>Preview not available for this file type. Please download it.</p>
            )}

          </div>
        ) : role === "recruiter" && userData ? (
          <div>
            <h3>Company</h3>
            <p><strong>{userData.companyName || ""}</strong></p>
            <p>Website: <a href={userData.companyWebsite} target="_blank" rel="noopener noreferrer">{userData.companyWebsite || "N/A"}</a></p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
