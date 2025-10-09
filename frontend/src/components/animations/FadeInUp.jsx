import React from 'react';
import { motion } from 'framer-motion';

const FadeInUp = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  distance = 30,
  className = '',
  ...props 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: distance,
    },
    visible: {
      opacity: 1,
      y: 0,
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

export default FadeInUp;
