import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BackButton from "../components/BackButton";
import "../styles/UploadResume.css";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Check if user already has a resume and redirect if they do
  useEffect(() => {
    const checkExistingResume = async () => {
      if (userId && token) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/api/resumes/get_resumes/${userId}`);
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            // User already has a resume, redirect to dashboard
            navigate("/jobseeker-dashboard", { replace: true });
          }
        } catch (error) {
          console.log("No existing resume found or error occurred");
        }
      }
    };

    checkExistingResume();
  }, [userId, token, navigate]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!userId) {
      setMessage("You must be logged in to upload a resume.");
      return;
    }

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    setUploading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/resumes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Resume uploaded successfully! Redirecting to dashboard...");
      setFile(null);

      // Navigate to jobseeker dashboard after successful upload
      // Increased delay to ensure backend processing is complete
      setTimeout(() => {
        navigate("/jobseeker-dashboard", { replace: true });
      }, 2000); // Increased delay for better backend processing
      
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload_resume_container">
      <BackButton />
      
      <div className="upload_resume_card">
        <div className="upload_resume_header">
          <h2>
            <span className="rocket_icon">🚀</span>
            <span className="rocket_fallback"><i className="fas fa-rocket"></i></span>
            Launch Your Career Today!
          </h2>
          <p>Upload your resume and unlock amazing job opportunities</p>
        </div>
        
        {userId ? (
          <div className="upload_resume_form">
            <div className="file_input_container">
              <label htmlFor="resume_file" className="file_input_label">
                <div className="file_input_icon">📁</div>
                <div className="file_input_text">
                  <span className="file_input_title">Choose your resume file</span>
                  <span className="file_input_subtitle">
                    {file ? file.name : "PDF, DOC, or DOCX files accepted"}
                  </span>
                </div>
              </label>
              <input 
                id="resume_file"
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange}
                className="file_input"
              />
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={uploading || !file}
              className="upload_button"
            >
              {uploading ? (
                <>
                  <span className="upload_spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="upload_icon">⬆️</span>
                  Upload Resume
                </>
              )}
            </button>
            
            {message && (
              <div className={`upload_message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
                {message.includes("Redirecting") && (
                  <span className="loading-dots">...</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="upload_resume_error">
            <div className="error_icon">🔒</div>
            <p>Please log in to upload your resume.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="login_button"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
