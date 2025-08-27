import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProfileCompletionCheck = ({ children, requiredRole }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user?.token) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          if (profileData.profileCompleted) {
            setHasProfile(true);
          } else {
            // Profile not completed, redirect to profile setup
            navigate('/user-profile-setup');
            return;
          }
        } else {
          // No profile found, redirect to profile setup
          navigate('/user-profile-setup');
          return;
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
        // On error, redirect to profile setup to be safe
        navigate('/user-profile-setup');
        return;
      }

      setIsChecking(false);
    };

    checkProfileCompletion();
  }, [user?.token, navigate]);

  if (isChecking) {
    return (
      <div className="profile-check-loading">
        <LoadingSpinner 
          type="rocket" 
          size="large" 
          text="Checking your profile..." 
          showText={true}
        />
      </div>
    );
  }

  if (!hasProfile) {
    return null; // Will redirect to profile setup
  }

  return children;
};

export default ProfileCompletionCheck;
