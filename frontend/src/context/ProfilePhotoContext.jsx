import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfilePhotoContext = createContext();

export const useProfilePhoto = () => {
  const context = useContext(ProfilePhotoContext);
  if (!context) {
    throw new Error('useProfilePhoto must be used within a ProfilePhotoProvider');
  }
  return context;
};

export const ProfilePhotoProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile photo from localStorage on mount
  useEffect(() => {
    const loadProfilePhoto = () => {
      try {
        const currentUserId = localStorage.getItem('userId');
        if (currentUserId) {
          const localPhotoKey = `profile_photo_${currentUserId}`;
          const savedPhoto = localStorage.getItem(localPhotoKey);
          if (savedPhoto) {
            setProfilePhoto(savedPhoto);
          }
        }
      } catch (error) {
        console.error('Error loading profile photo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfilePhoto();
  }, []);

  // Update profile photo and save to localStorage
  const updateProfilePhoto = (photoUrl) => {
    try {
      setProfilePhoto(photoUrl);
      const currentUserId = localStorage.getItem('userId');
      if (currentUserId) {
        const localPhotoKey = `profile_photo_${currentUserId}`;
        if (photoUrl) {
          localStorage.setItem(localPhotoKey, photoUrl);
        } else {
          localStorage.removeItem(localPhotoKey);
        }
      }
    } catch (error) {
      console.error('Error saving profile photo:', error);
    }
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    updateProfilePhoto(null);
  };

  // Get user initials for fallback
  const getUserInitials = (firstName = '', lastName = '') => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial) || 'U';
  };

  const value = {
    profilePhoto,
    updateProfilePhoto,
    removeProfilePhoto,
    getUserInitials,
    isLoading
  };

  return (
    <ProfilePhotoContext.Provider value={value}>
      {children}
    </ProfilePhotoContext.Provider>
  );
};

export default ProfilePhotoContext;
