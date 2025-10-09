import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/ModernResumeUpload.css";
import { buildApiUrl } from "../config/api";

const ModernResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, success, error
  const [processingStep, setProcessingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user already has a resume (for display purposes only)
  useEffect(() => {
    const checkExistingResume = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get(buildApiUrl("/api/modern-resumes/profile"), {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          
          if (response.data && !response.data.is_default) {
            // User already has a resume - we'll show a message but allow them to upload a new one
            console.log("User has existing resume - allowing update/replacement");
          }
        } catch (error) {
          console.log("No existing resume found or error occurred");
        }
      }
    };

    checkExistingResume();
  }, [user, navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please select a valid file type (PDF, DOCX, DOC, or TXT)");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setErrorMessage("");
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    console.log("🚀 Upload button clicked!");
    console.log("📁 Selected file:", selectedFile);
    console.log("👤 User:", user);
    console.log("🔑 Token:", user.token ? "Present" : "Missing");
    
    if (!selectedFile || !user || !user.token) {
      setErrorMessage("Please select a file and ensure you're logged in");
      return;
    }

    console.log("✅ Starting upload process...");
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    let progressInterval; // Declare the variable

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      console.log("📤 FormData created, sending to backend...");

      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      setProcessingStep("Uploading file...");
      
      console.log("🌐 Making POST request to:", buildApiUrl("/api/modern-resumes/upload"));
      const response = await axios.post(
        buildApiUrl("/api/modern-resumes/upload"),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          timeout: 60000, // 60 second timeout
        }
      );

      console.log("✅ Upload successful! Response:", response.data);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(100);
      setUploadStatus("success");
      setSuccessData(response.data);
      
      // Show success for 3 seconds then redirect
      setTimeout(() => {
        navigate("/jobseeker-dashboard", { replace: true });
      }, 3000);

    } catch (error) {
      console.error("❌ Upload failed with error:", error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadStatus("error");
      
      if (error.response) {
        console.error("📡 Backend response error:", error.response.data);
        setErrorMessage(error.response.data.error || "Upload failed. Please try again.");
      } else if (error.request) {
        console.error("🌐 Network error:", error.request);
        setErrorMessage("Network error. Please check your connection and try again.");
      } else {
        console.error("💥 Unexpected error:", error.message);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      
      console.error("Upload error:", error);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setProcessingStep("");
    setErrorMessage("");
    setSuccessData(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("text")) return "📃";
    return "📁";
  };

  if (!user) {
    return (
      <div className="modern-upload-container">
        <div className="modern-upload-card">
          <div className="auth-required">
            <div className="auth-icon">🔒</div>
            <h2>Authentication Required</h2>
            <p>Please log in to upload your resume</p>
            <button 
              onClick={() => navigate('/login')} 
              className="auth-button"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-upload-container">
      <div className="modern-upload-card">
        {/* Header */}
        <div className="upload-header">
          <div className="header-icon">🚀</div>
          <h1>Launch Your Career Today</h1>
          <p>Upload your resume and unlock AI-powered job matching</p>
          <div className="upload-info">
            <span className="info-icon">💡</span>
            <small>You can update your existing resume anytime to get better job matches</small>
          </div>
        </div>

        {/* File Selection */}
        {uploadStatus === "idle" && (
          <div className="file-selection">
            <div className="file-drop-zone" onClick={() => document.getElementById('file-input').click()}>
              <div className="drop-zone-icon">📁</div>
              <h3>Choose your resume file</h3>
              <p>Drag & drop or click to browse</p>
              <span className="file-types">PDF, DOCX, DOC, TXT (Max 10MB)</span>
            </div>
            
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {selectedFile && (
              <div className="selected-file">
                <div className="file-info">
                  <span className="file-icon">{getFileIcon(selectedFile.type)}</span>
                  <div className="file-details">
                    <h4>{selectedFile.name}</h4>
                    <p>{formatFileSize(selectedFile.size)} • {selectedFile.type}</p>
                  </div>
                </div>
                <button onClick={resetUpload} className="remove-file">✕</button>
              </div>
            )}

            {selectedFile && (
              <div className="upload-actions">
                <button 
                  onClick={() => {
                    console.log("🧪 Test button clicked!");
                    alert("Test button works!");
                  }}
                  className="test-button"
                  style={{ marginBottom: '10px', padding: '8px 16px', backgroundColor: '#ff6b6b' }}
                >
                  🧪 Test Button
                </button>
                
                <button 
                  onClick={handleUpload}
                  className="upload-button"
                  disabled={uploadStatus === "uploading"}
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "🚀 Upload Resume"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploadStatus === "uploading" && (
          <div className="upload-progress">
            <div className="progress-header">
              <h3>Processing Your Resume</h3>
              <p>{processingStep}</p>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            
            <div className="progress-steps">
              <div className="step active">
                <span className="step-icon">📤</span>
                <span>Uploading</span>
              </div>
              <div className={`step ${uploadProgress > 30 ? 'active' : ''}`}>
                <span className="step-icon">🤖</span>
                <span>AI Processing</span>
              </div>
              <div className={`step ${uploadProgress > 70 ? 'active' : ''}`}>
                <span className="step-icon">✅</span>
                <span>Complete</span>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {uploadStatus === "success" && successData && (
          <div className="upload-success">
            <div className="success-icon">🎉</div>
            <h3>Resume Uploaded Successfully!</h3>
            
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Processing Method:</span>
                <span className="detail-value">
                  {successData.processing_method === 'ai' ? '🤖 AI-Powered' : '🔄 Intelligent Fallback'}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">File Type:</span>
                <span className="detail-value">{successData.file_info.file_type}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">File Size:</span>
                <span className="detail-value">{formatFileSize(successData.file_info.file_size)}</span>
              </div>
            </div>

            {successData.ai_recommendations && (
              <div className="ai-insights">
                <h4>🤖 AI Career Insights</h4>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h5>Suggested Roles</h5>
                    <ul>
                      {successData.ai_recommendations.career_path?.suggested_roles?.slice(0, 3).map((role, index) => (
                        <li key={index}>{role}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="insight-card">
                    <h5>Next Steps</h5>
                    <ul>
                      {successData.ai_recommendations.career_path?.next_steps?.slice(0, 2).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <p className="redirect-message">Redirecting to dashboard in a few seconds...</p>
          </div>
        )}

        {/* Error State */}
        {uploadStatus === "error" && (
          <div className="upload-error">
            <div className="error-icon">❌</div>
            <h3>Upload Failed</h3>
            <p className="error-message">{errorMessage}</p>
            <button onClick={resetUpload} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Features */}
        <div className="features-section">
          <h3>Why Choose Our AI Resume Processing?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h4>AI-Powered Extraction</h4>
              <p>Advanced AI technology extracts skills, experience, and achievements with high accuracy</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Lightning Fast</h4>
              <p>Process your resume in seconds, not minutes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Smart Insights</h4>
              <p>Get personalized career recommendations and job suggestions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h4>Reliable Fallback</h4>
              <p>Intelligent fallback processing ensures your resume is always processed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernResumeUpload;
