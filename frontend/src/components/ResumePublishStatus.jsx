import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faCheck, faTimes, faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ResumePublishStatus.css';

const ResumePublishStatus = ({ onStatusChange }) => {
  const navigate = useNavigate();
  const [publishStatus, setPublishStatus] = useState({
    published: false,
    publishedAt: null,
    unpublishedAt: null,
    hasResume: false,
    loading: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPublishStatus();
  }, []);

  const fetchPublishStatus = async () => {
    try {
      setPublishStatus(prev => ({ ...prev, loading: true }));
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/modern-resumes/publish-status')
      );
      
      if (response && response.ok) {
        const data = await response.json();
        setPublishStatus({
          published: data.published || false,
          publishedAt: data.publishedAt,
          unpublishedAt: data.unpublishedAt,
          hasResume: data.hasResume || false,
          loading: false
        });
      } else {
        setPublishStatus(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching publish status:', error);
      setPublishStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePublish = async () => {
    if (!publishStatus.hasResume) {
      setMessage('Please upload a resume first');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/modern-resumes/publish'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setPublishStatus(prev => ({
          ...prev,
          published: true,
          publishedAt: new Date().toISOString()
        }));
        setMessage('Resume published successfully! It\'s now visible to recruiters.');
        if (onStatusChange) onStatusChange(true);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to publish resume');
      }
    } catch (error) {
      console.error('Error publishing resume:', error);
      setMessage('Failed to publish resume. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/modern-resumes/unpublish'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setPublishStatus(prev => ({
          ...prev,
          published: false,
          unpublishedAt: new Date().toISOString()
        }));
        setMessage('Resume unpublished successfully! It\'s now hidden from recruiters.');
        if (onStatusChange) onStatusChange(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to unpublish resume');
      }
    } catch (error) {
      console.error('Error unpublishing resume:', error);
      setMessage('Failed to unpublish resume. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };


  const handleEditResume = () => {
    navigate('/modern-upload');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  if (publishStatus.loading) {
    return (
      <div className="resume-publish-status loading">
        <div className="status-content">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <span>Loading resume status...</span>
        </div>
      </div>
    );
  }

  if (!publishStatus.hasResume) {
    return (
      <div className="resume-publish-status no-resume">
        <div className="status-content">
          <FontAwesomeIcon icon={faTimes} className="status-icon error" />
          <div className="status-text">
            <h4>No Resume Uploaded</h4>
            <p>Upload your resume first to publish it</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-publish-status">
      <div className="status-content">
        <div className="status-header">
          <FontAwesomeIcon 
            icon={publishStatus.published ? faEye : faEyeSlash} 
            className={`status-icon ${publishStatus.published ? 'published' : 'unpublished'}`} 
          />
          <div className="status-text">
            <h4>
              {publishStatus.published ? 'Resume Published' : 'Resume Unpublished'}
            </h4>
            <p>
              {publishStatus.published 
                ? 'Your resume is visible to recruiters' 
                : 'Your resume is hidden from recruiters'
              }
            </p>
          </div>
        </div>


        <div className="status-actions">
          <div className="primary-actions">
            {publishStatus.published ? (
              <button
                className="btn btn-unpublish"
                onClick={handleUnpublish}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
                {isUpdating ? 'Unpublishing...' : 'Unpublish Resume'}
              </button>
            ) : (
              <button
                className="btn btn-publish"
                onClick={handlePublish}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
                {isUpdating ? 'Publishing...' : 'Publish Resume'}
              </button>
            )}
          </div>
          
          <div className="secondary-actions">
            <button
              className="btn btn-edit"
              onClick={handleEditResume}
              title="Edit Resume"
            >
              <FontAwesomeIcon icon={faUpload} />
              Edit Resume
            </button>
            <button
              className="btn btn-view"
              onClick={handleViewProfile}
              title="View Profile"
            >
              <FontAwesomeIcon icon={faEdit} />
              View Profile
            </button>
          </div>
        </div>

        {message && (
          <div className={`status-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePublishStatus;
