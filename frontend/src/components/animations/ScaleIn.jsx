import React from 'react';
import { motion } from 'framer-motion';

const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  scale = 0.8,
  className = '',
  ...props 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      scale: scale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
