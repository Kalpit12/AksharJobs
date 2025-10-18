// Performance optimization utilities

// Image lazy loading
export const lazyLoadImage = (img, src) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = src;
        image.classList.remove('lazy');
        imageObserver.unobserve(image);
      }
    });
  });

  imageObserver.observe(img);
  return imageObserver;
};

// Debounce function for search inputs
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Virtual scrolling helper
export const getVisibleItems = (items, containerHeight, itemHeight, scrollTop) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    items: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    console.group('Bundle Analysis');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    
    scripts.forEach(script => {
      const size = script.getAttribute('data-size') || 'Unknown';
      console.log(`Script: ${script.src} (${size})`);
    });
    
    styles.forEach(style => {
      console.log(`Style: ${style.href}`);
    });
    console.groupEnd();
  }
};

// Memory usage monitor
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = performance.memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    });
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/AK_logo.png',
    '/static/css/main.css',
    '/static/js/bundle.js'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.js') ? 'script' : 'image';
    document.head.appendChild(link);
  });
};

// Optimize images
export const optimizeImage = (src, width, height, quality = 0.8) => {
  // This would typically use a service like Cloudinary or ImageKit
  // For now, return the original src
  return src;
};

// Cache API responses
export const cacheApiResponse = async (key, fetchFn, ttl = 300000) => { // 5 minutes default
  const cached = localStorage.getItem(`cache_${key}`);
  const now = Date.now();
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < ttl) {
      return data;
    }
  }
  
  try {
    const data = await fetchFn();
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: now
    }));
    return data;
  } catch (error) {
    console.error('API cache error:', error);
    throw error;
  }
};

// Performance metrics
export const getPerformanceMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    totalTime: navigation.loadEventEnd - navigation.fetchStart
  };
};
