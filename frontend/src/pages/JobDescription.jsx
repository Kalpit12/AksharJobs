import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import InputField from "../components/InputField";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import "../styles/JobDescription.css";
import Header from "../components/Header";

const JobDescription = () => {
  const userId=localStorage.getItem("userId")
  const [formData, setFormData] = useState({
    recruiter_id: userId,
    jobTitle: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    location: "",
    remoteOption: "On-site",
    jobType: "Full-time",
    salaryRange: "",
    experience: "",
    skills: "",
    responsibilities: "",
    education: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/jobs/add_job", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setMessage("Job posted successfully!");
        setFormData({
          recruiter_id: "",
          jobTitle: "",
          companyName: "",
          companyWebsite: "",
          industry: "",
          location: "",
          remoteOption: "On-site",
          jobType: "Full-time",
          salaryRange: "",
          experience: "",
          skills: "",
          responsibilities: "",
          education: "",
          deadline: "",
          description: "",
        });

        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 2000);
      } else {
        setMessage("Failed to post job.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage("Error: Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="job_description_wrapper">
        <BackButton to="/recruiter-dashboard" text="Back" />
        <div className="job_description_container">
          {/* 🎯 Section Header */}
          <div className="section_header">
            <h2>
              <span className="header_icon"><i className="fas fa-briefcase"></i></span>
              <span className="header_text">Post a Job</span>
            </h2>
            <p className="section_subtitle">Create a compelling job posting to attract top talent</p>
          </div>

          {/* 📝 Enhanced Job Form */}
          <div className="enhanced_job_form_container">
            {message && (
              <div className={`message_banner ${message.includes('successfully') ? 'success' : 'error'}`}>
                <span className="message_icon">
                  {message.includes('successfully') ? '✅' : '❌'}
                </span>
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="enhanced_job_form">
              <div className="form_section">
                <h3 className="section_title">📋 Basic Information</h3>
                <div className="form_grid">
                  <InputField 
                    label="Job Title" 
                    type="text" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., Senior Software Engineer"
                  />
                  <InputField 
                    label="Company Name" 
                    type="text" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., TechCorp Inc."
                  />
                  <InputField 
                    label="Company Website" 
                    type="url" 
                    name="companyWebsite" 
                    value={formData.companyWebsite} 
                    onChange={handleChange} 
                    placeholder="https://company.com"
                  />
                  <InputField 
                    label="Industry" 
                    type="text" 
                    name="industry" 
                    value={formData.industry} 
                    onChange={handleChange} 
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
              </div>

              <div className="form_section">
                <h3 className="section_title">📍 Location & Work Details</h3>
                <div className="form_grid">
                  <InputField 
                    label="Location" 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., New York, NY or Remote"
                  />
                  <InputField 
                    label="Salary Range" 
                    type="text" 
                    name="salaryRange" 
                    value={formData.salaryRange} 
                    onChange={handleChange} 
                    placeholder="e.g., $80,000 - $120,000"
                  />
                  
                  <div className="form_field">
                    <label className="form_label">🏠 Work Mode</label>
                    <select 
                      name="remoteOption" 
                      className="enhanced_select" 
                      onChange={handleChange} 
                      value={formData.remoteOption}
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form_field">
                    <label className="form_label">⏰ Job Type</label>
                    <select 
                      name="jobType" 
                      className="enhanced_select" 
                      onChange={handleChange} 
                      value={formData.jobType}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form_section">
                <h3 className="section_title">🎯 Requirements & Skills</h3>
                <div className="form_grid">
                  <InputField 
                    label="Experience Required" 
                    type="text" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., 3-5 years"
                  />
                  <InputField 
                    label="Required Skills" 
                    type="text" 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <InputField 
                    label="Education Requirements" 
                    type="text" 
                    name="education" 
                    value={formData.education} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                  <InputField 
                    label="Application Deadline" 
                    type="date" 
                    name="deadline" 
                    value={formData.deadline} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form_section">
                <h3 className="section_title">📝 Job Details</h3>
                <div className="form_grid_full">
                  <div className="form_field">
                    <label className="form_label">📋 Job Responsibilities</label>
                    <textarea 
                      name="responsibilities" 
                      className="enhanced_textarea" 
                      onChange={handleChange} 
                      value={formData.responsibilities} 
                      required
                      placeholder="List the key responsibilities and duties for this position..."
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="form_field">
                    <label className="form_label">📖 Detailed Job Description</label>
                    <textarea 
                      name="description" 
                      className="enhanced_textarea" 
                      onChange={handleChange} 
                      value={formData.description} 
                      required
                      placeholder="Provide a comprehensive description of the role, company culture, and what makes this opportunity special..."
                      rows="6"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="form_actions">
                
                <Button 
                  type="submit" 
                  label={loading ? "Posting..." : "Post Job"} 
                  disabled={loading} 
                  text={loading ? "⏳ Posting..." : "🚀 Post Job"} 
                  className="enhanced_submit_button"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
