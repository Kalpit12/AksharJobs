import React from 'react';
import { motion } from 'framer-motion';

const GlowEffect = ({ 
  children, 
  glowColor = "rgba(59, 130, 246, 0.5)",
  intensity = 20,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        boxShadow: `0 0 ${intensity}px ${glowColor}`,
        transition: { duration: 0.3 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlowEffect;
