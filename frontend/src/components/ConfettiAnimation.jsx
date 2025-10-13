import React, { useEffect, useState } from 'react';
import '../styles/ConfettiAnimation.css';

const ConfettiAnimation = ({ trigger, duration = 3000, particleCount = 50 }) => {
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      // Generate confetti particles
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        color: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'][i % 8],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
      }));
      
      setParticles(newParticles);
      setIsActive(true);

      // Clear animation after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, particleCount]);

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`confetti-particle ${particle.type}`}
          style={{
            backgroundColor: particle.color,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            '--rotation': `${particle.rotation}deg`,
            '--scale': particle.scale,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;

