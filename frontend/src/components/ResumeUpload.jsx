import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilePdf, faFileWord, faSpinner, faCheck, faTimes, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import '../styles/ResumeUpload.css';

const ResumeUpload = ({ onResumeUploaded, onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [processingStep, setProcessingStep] = useState('');
    const fileInputRef = useRef(null);
    const { user, isAuthenticated } = useAuth();
    const token = user?.token;
    
    // Debug authentication state
    console.log('Modern ResumeUpload - Auth state:', { user, isAuthenticated, token, hasToken: !!token });

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB (increased for modern service)

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid file type (PDF, DOCX, DOC, or TXT)');
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > maxFileSize) {
            setError('File size must be less than 10MB');
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
        console.log('🚀 Modern Resume Upload - selectedFile:', selectedFile, 'token:', token, 'user:', user);
        
        if (!selectedFile || !token) {
            setError('Please select a file and ensure you are logged in.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');
        setProcessingStep('Starting modern AI processing...');

        // Enhanced progress simulation for modern service
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev < 90) {
                    const newProgress = prev + 10;
                    // Update processing step based on progress
                    if (newProgress < 30) {
                        setProcessingStep('Uploading file...');
                    } else if (newProgress < 60) {
                        setProcessingStep('🤖 AI-powered text extraction...');
                    } else if (newProgress < 90) {
                        setProcessingStep('📊 Generating career insights...');
                    }
                    return newProgress;
                }
                return prev;
            });
        }, 200);

        console.log('🚀 Starting modern resume upload...', {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            hasToken: !!token
        });

        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);

            console.log('🚀 Sending request to modern service:', buildApiUrl('/api/modern-resumes/upload'));

            const response = await fetch(buildApiUrl('/api/modern-resumes/upload'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                mode: 'cors',
                credentials: 'include'
            });

            console.log('🚀 Modern service response status:', response.status);

            if (!response.ok) {
                clearInterval(progressInterval);
                let errorMessage = 'Modern resume processing failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
                } catch (e) {
                    errorMessage = `Modern service error: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('🚀 Modern upload successful:', data);
            console.log('🔍 Modern Upload Response Data Structure:');
            console.log('  - resume_data:', data.resume_data);
            console.log('  - ai_recommendations:', data.ai_recommendations);
            console.log('  - processing_method:', data.processing_method);
            console.log('  - ai_processed:', data.ai_processed);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setProcessingStep('✅ Modern AI processing complete!');
            setSuccess('🚀 Resume uploaded and processed with modern AI technology!');

            // Brief delay to show success message
            setTimeout(() => {
                if (onResumeUploaded) {
                    console.log('🔍 Calling onResumeUploaded with modern data:', {
                        resume_data: data.resume_data,
                        ai_recommendations: data.ai_recommendations
                    });
                    onResumeUploaded(data.resume_data, data.ai_recommendations);
                }
            }, 500);

        } catch (error) {
            clearInterval(progressInterval);
            console.error('🚀 Modern upload error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                type: typeof error
            });
            setError(`Modern AI processing failed: ${error.message}`);
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
                    <h2>
                        <FontAwesomeIcon icon={faRocket} style={{ marginRight: '10px', color: '#667eea' }} />
                        Modern AI Resume Upload
                    </h2>
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
                                <h3>🚀 Drag & Drop your resume here</h3>
                                <p>Experience the power of modern AI processing</p>
                                <button 
                                    className="btn btn_primary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choose File
                                </button>
                                <p className="file_types">PDF, DOCX, DOC, TXT (Max 10MB)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="selected_file_info">
                            <div className="file_preview">
                                <FontAwesomeIcon icon={getFileIcon(selectedFile.type)} className="file_icon" />
                                <div className="file_details">
                                    <h4>{selectedFile.name}</h4>
                                    <p>{formatFileSize(selectedFile.size)} • {selectedFile.type}</p>
                                </div>
                                <button className="remove_file_btn" onClick={removeFile}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            
                            <button 
                                className="btn btn_primary upload_btn"
                                onClick={uploadResume}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                        Processing with AI...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faRocket} />
                                        Launch AI Processing
                                    </>
                                )}
                            </button>
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
                            <span className="processing_step">{processingStep}</span>
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
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
