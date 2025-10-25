import React, { useState, useRef, useEffect } from 'react';

const LinkedInStyleSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...",
  required = false,
  searchable = true,
  multiple = false,
  disabled = false,
  allowCustom = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt => 
        (typeof opt === 'string' ? opt : opt.label || opt.name || opt)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    if (multiple) {
      const valueArray = Array.isArray(value) ? value : [];
      const optValue = typeof option === 'string' ? option : (option.value || option.code || option);
      
      if (valueArray.includes(optValue)) {
        onChange(valueArray.filter(v => v !== optValue));
      } else {
        onChange([...valueArray, optValue]);
      }
    } else {
      const selectedValue = typeof option === 'string' ? option : (option.value || option.code || option);
      onChange(selectedValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && allowCustom && searchTerm.trim()) {
      e.preventDefault();
      
      // Check if the search term already exists in options
      const exactMatch = options.find(opt => {
        const optText = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.value);
        return optText.toLowerCase() === searchTerm.trim().toLowerCase();
      });

      // If no exact match and it's a multiple select, add as custom skill
      if (!exactMatch && multiple) {
        const valueArray = Array.isArray(value) ? value : [];
        const customSkill = searchTerm.trim();
        
        // Check if already added
        if (!valueArray.includes(customSkill)) {
          onChange([...valueArray, customSkill]);
          setSearchTerm('');
        }
      }
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      const valueArray = Array.isArray(value) ? value : [];
      return valueArray.length > 0 ? `${valueArray.length} selected` : placeholder;
    }
    
    if (!value) return placeholder;
    
    const selected = options.find(opt => 
      (typeof opt === 'string' ? opt : (opt.value || opt.code)) === value
    );
    
    if (typeof selected === 'string') return selected;
    return selected ? (selected.label || selected.name || selected.value || selected.code) : value;
  };

  const isSelected = (option) => {
    if (multiple) {
      const valueArray = Array.isArray(value) ? value : [];
      const optValue = typeof option === 'string' ? option : (option.value || option.code || option);
      return valueArray.includes(optValue);
    }
    return (typeof option === 'string' ? option : (option.value || option.code)) === value;
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 text-left bg-white border rounded-lg focus:outline-none transition-all ${
            disabled 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
              : isOpen 
                ? 'border-blue-500 ring-2 ring-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {getDisplayValue()}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={allowCustom ? "Search or type to add custom..." : "Search..."}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}
            
            <div className="overflow-y-auto max-h-64">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-center">
                  <div className="text-gray-500">No options found</div>
                  {allowCustom && searchTerm.trim() && (
                    <div className="text-blue-600 mt-1 text-xs">
                      Press Enter to add "{searchTerm.trim()}" as custom skill
                    </div>
                  )}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const displayText = typeof option === 'string' 
                    ? option 
                    : (option.label || option.name || option.value || option.code);
                  const subText = typeof option === 'object' 
                    ? (option.symbol || option.description) 
                    : null;
                  const selected = isSelected(option);

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2.5 cursor-pointer transition-colors ${
                        selected 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{displayText}</div>
                          {subText && (
                            <div className="text-xs text-gray-500 mt-0.5">{subText}</div>
                          )}
                        </div>
                        {multiple && selected && (
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected items display for multiple select */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((val, idx) => {
            const selected = options.find(opt => 
              (typeof opt === 'string' ? opt : (opt.value || opt.code)) === val
            );
            const displayText = typeof selected === 'string' 
              ? selected 
              : (selected ? (selected.label || selected.name || val) : val);

            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {displayText}
                <button
                  type="button"
                  onClick={() => handleSelect(selected || val)}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LinkedInStyleSelect;

