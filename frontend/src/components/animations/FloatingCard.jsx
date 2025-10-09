import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ 
  children, 
  delay = 0, 
  intensity = 10,
  duration = 3,
  className = '',
  ...props 
}) => {
  const floatingAnimation = {
    y: [-intensity, intensity, -intensity],
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay }
      }}
      animate={floatingAnimation}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCard;
