import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { countryCodes, getDefaultCountry, searchCountries, formatPhoneNumber } from '../data/countryCodes';
import '../styles/PhoneInput.css';

const PhoneInput = ({ value, onChange, placeholder, required, name, id }) => {
  const defaultCountry = getDefaultCountry();
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countryCodes);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const buttonRef = useRef(null);

  // Parse initial value if provided
  useEffect(() => {
    if (value && value.startsWith('+')) {
      // Find matching country code
      for (const country of countryCodes) {
        if (value.startsWith(country.dialCode)) {
          setSelectedCountry(country);
          setPhoneNumber(value.substring(country.dialCode.length));
          break;
        }
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownElement = document.querySelector('.country-dropdown');
      const isClickInsideButton = dropdownRef.current && dropdownRef.current.contains(event.target);
      const isClickInsideDropdown = dropdownElement && dropdownElement.contains(event.target);
      
      if (!isClickInsideButton && !isClickInsideDropdown) {
        setIsDropdownOpen(false);
        setSearchQuery('');
        setFilteredCountries(countryCodes);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (isDropdownOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        setSearchQuery('');
        setFilteredCountries(countryCodes);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isDropdownOpen]);

  // Add/remove class to body when dropdown is open to disable role cards
  useEffect(() => {
    if (isDropdownOpen) {
      document.body.classList.add('phone-dropdown-open');
    } else {
      document.body.classList.remove('phone-dropdown-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('phone-dropdown-open');
    };
  }, [isDropdownOpen]);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      setFilteredCountries(searchCountries(searchQuery));
    } else {
      setFilteredCountries(countryCodes);
    }
  }, [searchQuery]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setFilteredCountries(countryCodes);
    
    // Update parent with new formatted number
    const formattedNumber = formatPhoneNumber(country.dialCode, phoneNumber);
    onChange({ target: { name, value: formattedNumber } });
  };

  const handlePhoneNumberChange = (e) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    
    // Update parent with formatted number
    const formattedNumber = formatPhoneNumber(selectedCountry.dialCode, newNumber);
    onChange({ target: { name, value: formattedNumber } });
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="phone-input-container">
        <div className="phone-input-wrapper">
          {/* Country Code Selector */}
          <div className="country-selector" ref={dropdownRef}>
            <button
              ref={buttonRef}
              type="button"
              className="country-button"
              onClick={toggleDropdown}
              aria-label="Select country code"
            >
              <span className="country-flag">{selectedCountry.flag}</span>
              <span className="country-code">{selectedCountry.dialCode}</span>
              <FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>
          </div>

          {/* Phone Number Input */}
          <input
            type="tel"
            id={id}
            name={name}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={placeholder || "123 456 7890"}
            required={required}
            className="phone-number-input"
            pattern="[0-9\s\-\(\)]+"
          />
        </div>
        <div className="phone-input-hint">
          Format: {selectedCountry.dialCode} followed by your phone number
        </div>
      </div>

      {/* Dropdown Menu - Rendered via Portal */}
      {isDropdownOpen && createPortal(
        <div 
          className="country-dropdown"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="dropdown-search">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="country-list">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={`country-item ${selectedCountry.code === country.code ? 'selected' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                  <span className="country-dial-code">{country.dialCode}</span>
                </button>
              ))
            ) : (
              <div className="no-results">No countries found</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PhoneInput;

