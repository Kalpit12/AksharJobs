import React, { useState } from 'react';
import CollapsibleProfileCompletion from './CollapsibleProfileCompletion';
import '../styles/ProfileCompletionDemo.css';

const ProfileCompletionDemo = () => {
  const [demoUser, setDemoUser] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    position: 'Senior Recruiter',
    location: 'San Francisco, CA',
    bio: 'Experienced recruiter with 5+ years in tech talent acquisition...'
  });

  const handleProfileUpdate = () => {
    // Simulate profile update
    console.log('Profile update triggered');
    // In real app, this would open a profile edit modal
  };

  return (
    <div className="profile-demo-container">
      <div className="demo-header">
        <h2>🎯 Collapsible Profile Completion Demo</h2>
        <p>Try dragging the profile card to the right to hide it, or click the toggle button!</p>
      </div>
      
      <div className="demo-content">
        <CollapsibleProfileCompletion 
          userDetails={demoUser}
          onProfileUpdate={handleProfileUpdate}
        />
        
        <div className="demo-instructions">
          <h3>📋 How to Use:</h3>
          <ul>
            <li>🖱️ <strong>Drag Right:</strong> Click and drag the profile card to the right to hide it</li>
            <li>👆 <strong>Click Toggle:</strong> Use the floating button on the right to show/hide</li>
            <li>✏️ <strong>Edit Profile:</strong> Click "Edit Profile" to update information</li>
            <li>👁️ <strong>Hide Card:</strong> Click "Hide This Card" to collapse it</li>
          </ul>
          
          <div className="demo-features">
            <h4>✨ Features:</h4>
            <div className="feature-grid">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Drag to Hide</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>Persistent State</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Progress Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎨</span>
                <span>Smooth Animations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌓</span>
                <span>Dark Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionDemo;
