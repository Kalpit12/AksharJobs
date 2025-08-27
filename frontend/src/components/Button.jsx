import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = `btn btn-${variant} btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  const finalClassName = `${baseClasses} ${widthClass} ${loadingClass} ${className}`.trim();

  const buttonVariants = {
    hover: {
      scale: disabled ? 1 : 1.05,
      y: disabled ? 0 : -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: disabled ? 1 : 0.95,
      transition: { duration: 0.1 }
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = (
      <FontAwesomeIcon 
        icon={icon} 
        className={`btn-icon ${iconPosition === 'right' ? 'btn-icon-right' : 'btn-icon-left'}`}
      />
    );

    return iconElement;
  };

  const renderContent = () => {
    if (iconPosition === 'right') {
      return (
        <>
          <span className="btn-text">{children}</span>
          {renderIcon()}
        </>
      );
    }

    return (
      <>
        {renderIcon()}
        <span className="btn-text">{children}</span>
      </>
    );
  };

  return (
    <motion.button
      className={finalClassName}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default Button;
