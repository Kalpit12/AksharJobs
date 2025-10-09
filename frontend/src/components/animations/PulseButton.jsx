import React from 'react';
import { motion } from 'framer-motion';

const PulseButton = ({ 
  children, 
  pulseScale = 1.05,
  className = '',
  onClick,
  disabled = false,
  ...props 
}) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : pulseScale,
        y: disabled ? 0 : -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        transition: { duration: 0.1 }
      }}
      animate={disabled ? {} : {
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0.4)",
          "0 0 0 10px rgba(59, 130, 246, 0)",
          "0 0 0 0 rgba(59, 130, 246, 0)"
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PulseButton;
