import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CompanyDetailsModal.css';

const CompanyDetailsModal = ({ isOpen, onClose, userData, role }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      // Show modal with animation
      gsap.set(modalRef.current, { display: 'flex' });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { scale: 0.8, opacity: 0, y: 50 });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(contentRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
        delay: 0.1
      });
    } else {
      // Hide modal with animation
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });

      gsap.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(modalRef.current, { display: 'none' });
        }
      });
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="company-modal"
      style={{ display: 'none' }}
    >
      <div 
        ref={overlayRef}
        className="company-modal-overlay"
        onClick={handleOverlayClick}
      />
      <div ref={contentRef} className="company-modal-content">
        <div className="company-modal-header">
          <h2 className="company-modal-title">
            {role === "recruiter" ? "Company Details" : "Contact Information"}
          </h2>
          <button 
            className="company-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="company-modal-body">
          {role === "recruiter" ? (
            <>
              {/* Company Information */}
              <div className="company-section">
                <div className="company-logo">
                  <div className="company-logo-placeholder">
                    🏢
                  </div>
                </div>
                <div className="company-info">
                  <h3 className="company-name">
                    {userData?.companyName || userData?.company || "Company Name"}
                  </h3>
                  <p className="company-industry">
                    {userData?.industry || "Technology"}
                  </p>
                </div>
              </div>

              <div className="company-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {userData?.location || userData?.city || "Location not specified"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📧</div>
                  <div className="detail-content">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{userData?.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">
                      {userData?.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🌐</div>
                  <div className="detail-content">
                    <span className="detail-label">Website</span>
                    <span className="detail-value">
                      {userData?.website || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">👥</div>
                  <div className="detail-content">
                    <span className="detail-label">Company Size</span>
                    <span className="detail-value">
                      {userData?.companySize || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">💼</div>
                  <div className="detail-content">
                    <span className="detail-label">Founded</span>
                    <span className="detail-value">
                      {userData?.foundedYear || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {userData?.companyDescription && (
                <div className="company-description">
                  <h4>About the Company</h4>
                  <p>{userData.companyDescription}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Job Seeker Contact Information */}
              <div className="contact-section">
                <div className="contact-avatar">
                  <img 
                    src={userData?.profileImage || "https://www.w3schools.com/w3images/avatar2.png"} 
                    alt="Profile"
                    className="contact-avatar-img"
                  />
                </div>
                <div className="contact-info">
                  <h3 className="contact-name">
                    {userData?.firstName} {userData?.lastName}
                  </h3>
                  <p className="contact-title">
                    {userData?.jobTitle || "Job Seeker"}
                  </p>
                </div>
              </div>

              <div className="contact-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">📧</div>
                  <div className="detail-content">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{userData?.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">
                      {userData?.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {userData?.location || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">💼</div>
                  <div className="detail-content">
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">
                      {userData?.experience || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="company-modal-footer">
          <button className="company-modal-btn primary" onClick={onClose}>
            Close
          </button>
          <button className="company-modal-btn secondary">
            {role === "recruiter" ? "View Company Profile" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsModal;
