import { useState, useEffect, useRef } from 'react';

const useCountUp = (end, start = 0, duration = 2000, isVisible = false) => {
  const [count, setCount] = useState(start);
  const [isCounting, setIsCounting] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    if (!isVisible || isCounting) return;

    setIsCounting(true);
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(start + (end - start) * easeOutCubic);
      
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsCounting(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, start, duration, isVisible, isCounting]);

  return count;
};

export default useCountUp;
