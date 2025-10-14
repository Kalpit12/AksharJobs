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
  compact = false 
}) => {
  const getStatusIcon = () => {
    if (isSaving) return faSpinner;
    switch (saveStatus) {
      case 'saved': return faCheck;
      case 'error': return faExclamationTriangle;
      case 'loaded': return faCloud;
      case 'cleared': return faSave;
      default: return null;
    }
  };

  const getStatusText = () => {
    if (isSaving) return 'Saving...';
    switch (saveStatus) {
      case 'saved': return 'Auto-saved';
      case 'error': return 'Save failed';
      case 'loaded': return 'Restored from saved';
      case 'cleared': return 'Data cleared';
      default: return 'Auto-saving your progress';
    }
  };

  const getStatusClass = () => {
    if (isSaving) return 'autosave-saving';
    switch (saveStatus) {
      case 'saved': return 'autosave-saved';
      case 'error': return 'autosave-error';
      case 'loaded': return 'autosave-loaded';
      case 'cleared': return 'autosave-cleared';
      default: return 'autosave-idle';
    }
  };

  const icon = getStatusIcon();
  const text = getStatusText();
  const statusClass = getStatusClass();

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
        <span className="autosave-text">{text}</span>
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
        <span className="autosave-text">{text}</span>
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
