import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEyeSlash, 
  faCheckCircle, 
  faExclamationTriangle,
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../styles/InputField.css';

const InputField = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  required = false,
  disabled = false,
  readOnly = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  searchable = false,
  passwordToggle = false,
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getInputClasses = () => {
    const baseClasses = `input-field input-${size}`;
    const widthClass = fullWidth ? 'input-full-width' : '';
    const stateClass = error ? 'input-error' : success ? 'input-success' : '';
    const focusClass = isFocused ? 'input-focused' : '';
    
    return `${baseClasses} ${widthClass} ${stateClass} ${focusClass} ${className}`.trim();
  };

  const getIconElement = () => {
    if (!icon) return null;
    
    return (
      <FontAwesomeIcon 
        icon={icon} 
        className={`input-icon input-icon-${iconPosition}`}
      />
    );
  };

  const getStatusIcon = () => {
    if (error) {
      return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon error" />;
    }
    if (success) {
      return <FontAwesomeIcon icon={faCheckCircle} className="status-icon success" />;
    }
    return null;
  };

  const getActionButtons = () => {
    const buttons = [];

    if (clearable && value && !disabled && !readOnly) {
      buttons.push(
        <motion.button
          key="clear"
          type="button"
          className="input-action-btn clear-btn"
          onClick={handleClear}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Clear input"
        >
          <FontAwesomeIcon icon={faTimes} />
        </motion.button>
      );
    }

    if (passwordToggle && type === 'password') {
      buttons.push(
        <motion.button
          key="password"
          type="button"
          className="input-action-btn password-btn"
          onClick={togglePassword}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </motion.button>
      );
    }

    return buttons;
  };

  return (
    <div className={getInputClasses()}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && getIconElement()}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="input-element"
          {...props}
        />
        
        {icon && iconPosition === 'right' && getIconElement()}
        
        <AnimatePresence>
          {getStatusIcon() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {getStatusIcon()}
            </motion.div>
          )}
        </AnimatePresence>
        
        {getActionButtons().length > 0 && (
          <div className="input-actions">
            {getActionButtons()}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            className="input-error-message"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {searchable && (
        <motion.div
          className="search-suggestions"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: isFocused && isHovered ? 1 : 0, 
            y: isFocused && isHovered ? 0 : -10 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="suggestion-item">
            <FontAwesomeIcon icon={faSearch} />
            <span>Recent searches</span>
          </div>
          <div className="suggestion-item">
            <FontAwesomeIcon icon={faSearch} />
            <span>Popular jobs</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InputField;
