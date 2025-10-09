import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedCounter = ({ 
  end, 
  duration = 1, 
  delay = 0, 
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const tl = gsap.timeline({ delay });
    
    tl.fromTo(counter, 
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.3,
        ease: "back.out(1.7)"
      }
    );

    // Animate the counter value
    gsap.to({ value: 0 }, {
      value: end,
      duration,
      delay: delay + 0.3,
      ease: "power2.out",
      onUpdate: function() {
        setCount(Math.round(this.targets()[0].value));
      }
    });

  }, [end, duration, delay]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default AnimatedCounter;
