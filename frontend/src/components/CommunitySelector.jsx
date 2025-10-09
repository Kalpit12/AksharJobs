import React, { useState, useEffect } from 'react';
import CommunityApi from '../api/communityApi';
import '../styles/CommunitySelector.css';

const CommunitySelector = ({ 
  selectedCommunities = [], 
  onSelectionChange, 
  multiple = true, 
  showDescription = true,
  placeholder = "Select communities...",
  className = ""
}) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await CommunityApi.getAllCommunities();
      if (response.success) {
        setCommunities(response.communities || []);
      } else {
        setError('Failed to fetch communities');
      }
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityToggle = (communityId) => {
    if (multiple) {
      const newSelection = selectedCommunities.includes(communityId)
        ? selectedCommunities.filter(id => id !== communityId)
        : [...selectedCommunities, communityId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([communityId]);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    const allCommunityIds = communities.map(c => c._id);
    if (selectedCommunities.length === allCommunityIds.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allCommunityIds);
    }
  };

  const getSelectedCommunitiesInfo = () => {
    if (selectedCommunities.length === 0) return null;
    if (selectedCommunities.length === communities.length) return "All Communities";
    
    const selectedNames = selectedCommunities
      .map(id => communities.find(c => c._id === id)?.name)
      .filter(Boolean)
      .slice(0, 2);
    
    if (selectedNames.length === 1) return selectedNames[0];
    if (selectedNames.length === 2 && selectedCommunities.length === 2) {
      return selectedNames.join(', ');
    }
    return `${selectedNames.join(', ')} +${selectedCommunities.length - 2} more`;
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`community-selector ${className}`}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading communities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`community-selector ${className}`}>
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchCommunities} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`community-selector ${className}`}>
      <div className="selector-header">
        <label className="selector-label">
          {multiple ? 'Select Communities' : 'Select Community'}
        </label>
        {multiple && selectedCommunities.length > 0 && (
          <span className="selection-count">
            {selectedCommunities.length} selected
          </span>
        )}
      </div>

      <div className="dropdown-container">
        <div 
          className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="trigger-content">
            <span className="trigger-text">
              {getSelectedCommunitiesInfo() || placeholder}
            </span>
            <span className="dropdown-arrow">
              {isOpen ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
                style={{ minWidth: '200px' }}
              />
            </div>

            {multiple && (
              <div className="select-all-option" onClick={handleSelectAll}>
                <span className="option-icon">🌍</span>
                <span className="option-name">All Communities</span>
                <span className="option-description">Access to all job opportunities</span>
                <div className="checkbox">
                  {selectedCommunities.length === communities.length ? '✓' : ''}
                </div>
              </div>
            )}

            <div className="communities-list">
              {filteredCommunities.map(community => (
                <div
                  key={community._id}
                  className={`community-option ${selectedCommunities.includes(community._id) ? 'selected' : ''}`}
                  onClick={() => handleCommunityToggle(community._id)}
                >
                  <div className="option-content">
                    <span className="option-icon">{community.icon}</span>
                    <div className="option-details">
                      <span className="option-name">{community.name}</span>
                      <span className="option-category">{community.category}</span>
                      {showDescription && community.description && (
                        <span className="option-description">{community.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="checkbox">
                    {selectedCommunities.includes(community._id) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            {filteredCommunities.length === 0 && (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <span>No communities found matching "{searchTerm}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCommunities.length > 0 && (
        <div className="selected-summary">
          <span className="summary-label">Selected:</span>
          <div className="selected-tags">
            {selectedCommunities.slice(0, 3).map(communityId => {
              const community = communities.find(c => c._id === communityId);
              return (
                <span key={communityId} className="selected-tag">
                  {community?.icon} {community?.name}
                </span>
              );
            })}
            {selectedCommunities.length > 3 && (
              <span className="selected-tag more">
                +{selectedCommunities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySelector;
