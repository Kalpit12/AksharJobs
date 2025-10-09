import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/SmartSearch.css';

const SmartSearch = ({ onSearch, placeholder = "Job title, keywords, or company" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([
    'Software Engineer',
    'Data Analyst',
    'Marketing Manager',
    'Sales Representative',
    'Project Manager',
    'UX Designer',
    'DevOps Engineer',
    'Product Manager'
  ]);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const allSuggestions = [
      ...trendingSearches,
      'Remote Jobs',
      'Full-time',
      'Part-time',
      'Contract',
      'Nairobi',
      'Mombasa',
      'Kisumu',
      'Eldoret',
      'Thika'
    ];

    const filtered = allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8);

    setSuggestions(filtered);
  }, [query, trendingSearches]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    saveRecentSearch(suggestion);
    onSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="smart_search_container" ref={suggestionsRef}>
      <form className="smart_search_form" onSubmit={handleSubmit}>
        <div className="smart_search_input_wrapper">
          <FontAwesomeIcon icon={faSearch} className="smart_search_icon" />
          <input
            ref={searchRef}
            type="text"
            className="smart_search_input"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
        <button type="submit" className="smart_search_button">
          Search
        </button>
      </form>

      {showSuggestions && (
        <div className="smart_search_suggestions">
          {suggestions.length > 0 && (
            <div className="suggestions_section">
              <div className="suggestions_header">
                <FontAwesomeIcon icon={faSearch} />
                <span>Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion_item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FontAwesomeIcon icon={faSearch} />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="suggestions_section">
              <div className="suggestions_header">
                <FontAwesomeIcon icon={faClock} />
                <span>Recent Searches</span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="suggestion_item recent"
                  onClick={() => handleSuggestionClick(search)}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {query.length < 2 && (
            <div className="suggestions_section">
              <div className="suggestions_header">
                <FontAwesomeIcon icon={faArrowTrendUp} />
                <span>Trending Searches</span>
              </div>
              {trendingSearches.slice(0, 6).map((trend, index) => (
                <button
                  key={index}
                  className="suggestion_item trending"
                  onClick={() => handleSuggestionClick(trend)}
                >
                  <FontAwesomeIcon icon={faArrowTrendUp} />
                  <span>{trend}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
