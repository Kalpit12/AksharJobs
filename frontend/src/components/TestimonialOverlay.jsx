import React, { useState, useEffect } from 'react';
import './TestimonialOverlay.css';

const TestimonialOverlay = ({ items, onHover, onLeave }) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    if (onHover) onHover(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
    if (onLeave) onLeave();
  };

  return (
    <div className="testimonial-overlay">
      {items.map((item, index) => (
        <div
          key={index}
          className={`testimonial-card ${hoveredIndex === index ? 'visible' : ''}`}
          style={{
            left: mousePosition.x - 150, // Center the card
            top: mousePosition.y - 200,  // Center the card
            display: hoveredIndex === index ? 'flex' : 'none'
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="testimonial-quote">
            "{item.quote}"
          </div>
          <div className="testimonial-name">
            {item.name}
          </div>
          <div className="testimonial-role">
            {item.role}
          </div>
          <div className={`testimonial-company ${item.text.toLowerCase().replace(/\s+/g, '')}`}>
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialOverlay;
