import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faSpinner, 
  faExclamationTriangle,
  faSave,
  faCloud
} from '@fortawesome/free-solid-svg-icons';
import './AutoSaveStatus.css';

const AutoSaveStatus = ({ 
  isSaving, 
  saveStatus, 
  onClearData, 
  showClearButton = true,
  position = 'top-right',
  compact = false,
  lastBackendSaveTime = null
}) => {
  const getStatusIcon = () => {
    if (isSaving) return faSpinner;
    switch (saveStatus) {
      case 'saved': return faCheck;
      case 'saved-backend': return faCloud;
      case 'saving-backend': return faSpinner;
      case 'error': return faExclamationTriangle;
      case 'error-backend': return faExclamationTriangle;
      case 'loaded': return faCloud;
      case 'cleared': return faSave;
      default: return null;
    }
  };

  const getStatusText = () => {
    if (isSaving) return saveStatus === 'saving-backend' ? 'Saving to cloud...' : 'Saving...';
    switch (saveStatus) {
      case 'saved': return 'Auto-saved locally';
      case 'saved-backend': return 'Saved to cloud ☁️';
      case 'error': return 'Save failed';
      case 'error-backend': return 'Cloud save failed';
      case 'loaded': return 'Restored from saved';
      case 'cleared': return 'Data cleared';
      default: return 'Auto-saving your progress';
    }
  };

  const getStatusClass = () => {
    if (isSaving) return 'autosave-saving';
    switch (saveStatus) {
      case 'saved': return 'autosave-saved';
      case 'saved-backend': return 'autosave-saved';
      case 'error': return 'autosave-error';
      case 'error-backend': return 'autosave-error';
      case 'loaded': return 'autosave-loaded';
      case 'cleared': return 'autosave-cleared';
      default: return 'autosave-idle';
    }
  };
  
  const formatLastSaveTime = () => {
    if (!lastBackendSaveTime) return null;
    const now = new Date();
    const diff = Math.floor((now - lastBackendSaveTime) / 1000); // seconds
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return lastBackendSaveTime.toLocaleDateString();
  };

  const icon = getStatusIcon();
  const text = getStatusText();
  const statusClass = getStatusClass();
  const lastSaveDisplay = formatLastSaveTime();

  if (compact) {
    return (
      <div className={`autosave-status autosave-compact autosave-${position} ${statusClass}`}>
        {icon && (
          <FontAwesomeIcon 
            icon={icon} 
            spin={isSaving}
            className="autosave-icon"
          />
        )}
        <span className="autosave-text">
          {text}
          {lastSaveDisplay && <span style={{ fontSize: '0.85em', marginLeft: '5px', opacity: 0.8 }}>
            (Cloud: {lastSaveDisplay})
          </span>}
        </span>
      </div>
    );
  }

  return (
    <div className={`autosave-status autosave-${position} ${statusClass}`}>
      <div className="autosave-content">
        {icon && (
          <FontAwesomeIcon 
            icon={icon} 
            spin={isSaving}
            className="autosave-icon"
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span className="autosave-text">{text}</span>
          {lastSaveDisplay && (
            <span style={{ fontSize: '0.75em', opacity: 0.7 }}>
              Last cloud save: {lastSaveDisplay}
            </span>
          )}
        </div>
      </div>
      
      {showClearButton && onClearData && (
        <button 
          className="autosave-clear-btn"
          onClick={onClearData}
          title="Clear saved form data"
        >
          Clear Form Data
        </button>
      )}
    </div>
  );
};

export default AutoSaveStatus;
