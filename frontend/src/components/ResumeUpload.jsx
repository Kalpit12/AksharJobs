import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faFileWord, faSpinner, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import '../styles/ResumeUpload.css';

const ResumeUpload = ({ onResumeUploaded, onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const { user, isAuthenticated } = useAuth();
    const token = user?.token;
    
    // Debug authentication state
    console.log('ResumeUpload - Auth state:', { user, isAuthenticated, token, hasToken: !!token });

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid file type (PDF, DOCX, or DOC)');
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > maxFileSize) {
            setError('File size must be less than 5MB');
            setSelectedFile(null);
            return;
        }

        setError('');
        setSelectedFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const input = fileInputRef.current;
            input.files = event.dataTransfer.files;
            handleFileSelect({ target: { files: [file] } });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const uploadResume = async () => {
        console.log('Upload attempt - selectedFile:', selectedFile, 'token:', token, 'user:', user);
        
        if (!selectedFile || !token) {
            setError('Please select a file and ensure you are logged in.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev < 90) return prev + 10;
                return prev;
            });
        }, 200);

        console.log('Starting resume upload...', {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            hasToken: !!token
        });

        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            console.log('Sending request to:', buildApiUrl('/api/resumes/upload'));

            const response = await fetch(buildApiUrl('/api/resumes/upload'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                clearInterval(progressInterval);
                let errorMessage = 'Upload failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
                } catch (e) {
                    errorMessage = `Upload failed: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Upload successful:', data);
            console.log('🔍 Upload Response Data Structure:');
            console.log('  - resume_data:', data.resume_data);
            console.log('  - ai_recommendations:', data.ai_recommendations);
            console.log('  - resume_data.skills:', data.resume_data?.skills);
            console.log('  - resume_data.skills type:', typeof data.resume_data?.skills);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setSuccess('Resume uploaded and processed successfully!');

            // Brief delay to show success message
            setTimeout(() => {
                if (onResumeUploaded) {
                    console.log('🔍 Calling onResumeUploaded with:', {
                        resume_data: data.resume_data,
                        ai_recommendations: data.ai_recommendations
                    });
                    onResumeUploaded(data.resume_data, data.ai_recommendations);
                }
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            console.error('Upload error:', error);
            setError(error.message || 'Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return faFilePdf;
        if (fileType.includes('word') || fileType.includes('document')) return faFileWord;
        return faFileWord;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="resume_upload_modal">
            <div className="resume_upload_content">
                <div className="resume_upload_header">
                    <h2>Upload Your Resume</h2>
                    <button className="close_btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="resume_upload_body">
                    {!selectedFile ? (
                        <div 
                            className="file_drop_zone"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div className="drop_zone_content">
                                <FontAwesomeIcon icon={faUpload} className="upload_icon" />
                                <h3>Drag & Drop your resume here</h3>
                                <p>or</p>
                                <button 
                                    className="btn btn_primary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choose File
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                                <div className="file_info">
                                    <p>Supported formats: PDF, DOCX, DOC</p>
                                    <p>Maximum size: 5MB</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="file_preview">
                            <div className="file_info_display">
                                <FontAwesomeIcon 
                                    icon={getFileIcon(selectedFile.type)} 
                                    className="file_type_icon"
                                />
                                <div className="file_details">
                                    <h4>{selectedFile.name}</h4>
                                    <p>{formatFileSize(selectedFile.size)}</p>
                                </div>
                                <button className="remove_file_btn" onClick={removeFile}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error_message">
                            <FontAwesomeIcon icon={faTimes} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="success_message">
                            <FontAwesomeIcon icon={faCheck} />
                            <span>{success}</span>
                        </div>
                    )}

                    {isUploading && (
                        <div className="upload_progress">
                            <FontAwesomeIcon icon={faSpinner} className="spinner" />
                            <div className="progress_bar_container">
                                <div className="progress_bar" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <span>
                                {uploadProgress < 30 ? 'Uploading file...' :
                                 uploadProgress < 60 ? 'Extracting text...' :
                                 uploadProgress < 90 ? 'Processing with AI...' :
                                 'Finalizing...'}
                            </span>
                            <span className="progress_percentage">{uploadProgress}%</span>
                        </div>
                    )}
                </div>

                <div className="resume_upload_footer">
                    <button 
                        className="btn btn_secondary"
                        onClick={onClose}
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn btn_primary"
                        onClick={uploadResume}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faUpload} />
                                Upload Resume
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
