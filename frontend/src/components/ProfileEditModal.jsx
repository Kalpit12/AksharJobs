import React, { useState, useRef, useEffect } from 'react';
import '../styles/ProfileEditModal.css';

const ProfileEditModal = ({ isOpen, onClose, user, onSave, editMode: initialEditMode }) => {
  const [editMode, setEditMode] = useState(initialEditMode || 'name'); // 'name' or 'picture'
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profilePicture || '');
  const [customImage, setCustomImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Update editMode when prop changes
  useEffect(() => {
    setEditMode(initialEditMode || 'name');
  }, [initialEditMode]);

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    '/default-avatar.png',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1487412720507-e7f430eb9c8b?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1487412720507-e7f430eb9c8b?w=150&h=150&fit=crop&crop=face'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCustomImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setSelectedAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setCustomImage(null);
    setPreviewUrl('');
  };

  const handleSave = async () => {
    if (editMode === 'name') {
      if (!firstName.trim() || !lastName.trim()) {
        alert('Please enter both first and last name');
        return;
      }
      await onSave({ firstName: firstName.trim(), lastName: lastName.trim() });
    } else {
      await onSave({ profilePicture: selectedAvatar });
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setSelectedAvatar(user?.profilePicture || '');
    setCustomImage(null);
    setPreviewUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-edit-modal-overlay" onClick={handleCancel}>
      <div className="profile-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editMode === 'name' ? 'Edit Name' : 'Change Profile Picture'}</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-content">
          {editMode === 'name' ? (
            <div className="name-edit-section">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="name-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="name-input"
                />
              </div>
            </div>
          ) : (
            <div className="picture-edit-section">
              <div className="current-picture">
                <img 
                  src={selectedAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} 
                  alt="Current profile" 
                  className="current-avatar"
                />
                <p>Current Profile Picture</p>
              </div>

              <div className="avatar-options">
                <h3>Choose from Default Avatars</h3>
                <div className="avatar-grid">
                  {defaultAvatars.map((avatar, index) => (
                    <div
                      key={index}
                      className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="upload-section">
                  <h3>Or Upload Your Own</h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="upload-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Choose File
                  </button>
                  {previewUrl && (
                    <div className="preview-section">
                      <h4>Preview:</h4>
                      <img src={previewUrl} alt="Preview" className="preview-image" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
