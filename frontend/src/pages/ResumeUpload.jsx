import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faFileWord, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../styles/StaticPages.css';

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.type)) {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF or Word document.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploadedFile) {
      // Here you would typically upload the file to your server
      alert('Resume uploaded successfully!');
      navigate('/profile');
    }
  };

  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Upload Your Resume</h1>
        
        <div className="page-section">
          <p className="upload-description">
            Upload your resume to get started with AksharJobs. Our AI will analyze your skills 
            and experience to match you with the perfect job opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div 
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploadedFile ? 'file-uploaded' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="upload-success">
                <FontAwesomeIcon icon={faCheck} className="success-icon" />
                <h3>File Uploaded Successfully</h3>
                <p>{uploadedFile.name}</p>
                <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="upload-content">
                <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                <h3>Drag & Drop Your Resume</h3>
                <p>or click to browse files</p>
                <div className="supported-formats">
                  <FontAwesomeIcon icon={faFilePdf} /> PDF
                  <FontAwesomeIcon icon={faFileWord} /> DOC/DOCX
                </div>
              </div>
            )}
            
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="file-input"
            />
          </div>

          {uploadedFile && (
            <div className="upload-actions">
              <button type="button" onClick={() => setUploadedFile(null)} className="btn-secondary">
                Upload Different File
              </button>
              <button type="submit" className="btn-primary">
                Continue to Profile
              </button>
            </div>
          )}
        </form>

        <div className="page-section">
          <h2>Tips for a Great Resume</h2>
          <ul className="tips-list">
            <li>Keep it concise (1-2 pages maximum)</li>
            <li>Use clear, professional formatting</li>
            <li>Include relevant keywords for your industry</li>
            <li>Highlight your achievements with specific metrics</li>
            <li>Ensure all contact information is up-to-date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
