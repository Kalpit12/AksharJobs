// URL Interceptor - Automatically fixes hardcoded localhost URLs
import API_CONFIG from '../config/api.js';

// Store original functions
const originalFetch = window.fetch;
const originalAxios = window.axios;
let originalAxiosRequest = null; // Declare globally

// Function to fix URLs
const fixUrl = (url) => {
  if (typeof url === 'string') {
    let fixedUrl = url;
    
    // Get the dynamic base URL from API config - Global accessibility
    const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
        const currentHost = window.location.hostname;
        
        // For development, use the backend port 3002
        if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
          return 'http://localhost:3002';
        }
        
        // Use relative path for production (Nginx proxy)
        return '';
      }
      // Fallback for SSR - use localhost for development
      return 'http://localhost:3002';
    };
    
    const baseUrl = getBaseUrl();
    
    // Only fix URLs that need fixing - don't break working URLs
    if (fixedUrl.includes('undefined') || fixedUrl.includes('/undefined/')) {
      // Fix undefined URLs by replacing with proper base URL
      fixedUrl = fixedUrl.replace(/\/undefined\//g, '/api/');
      if (!fixedUrl.startsWith('http')) {
        fixedUrl = baseUrl + fixedUrl;
      }
    } else {
      // Replace all variations of hardcoded localhost URLs with dynamic base URL
      const patterns = [
        /http:\/\/(127\.0\.0\.1|localhost):5000/g,
        /http:\/\/(127\.0\.0\.1|localhost):3001/g,
        /http:\/\/(127\.0\.0\.1|localhost):3002/g,
        /http:\/\/(127\.0\.0\.1|localhost):3004/g,
        /http:\/\/(127\.0\.0\.1|localhost):3005/g,
        /http:\/\/(127\.0\.0\.1|localhost):8000/g,
        /http:\/\/(127\.0\.0\.1|localhost):8080/g
      ];
      
      patterns.forEach(pattern => {
        fixedUrl = fixedUrl.replace(pattern, baseUrl);
      });
    }
    
    // Also fix any URLs without protocol
    if (fixedUrl.startsWith('//127.0.0.1:5000') || fixedUrl.startsWith('//localhost:5000')) {
      fixedUrl = fixedUrl.replace(/\/\/(127\.0\.0\.1|localhost):5000/g, baseUrl.replace('http:', ''));
    }
    
    // Log all URL changes for debugging
    if (fixedUrl !== url) {
      console.log(`[URL Interceptor] Fixed: ${url} -> ${fixedUrl}`);
      console.log(`[URL Interceptor] Using base URL: ${baseUrl}`);
    }
    
    return fixedUrl;
  }
  return url;
};

// Override fetch function
window.fetch = function(url, options = {}) {
  const fixedUrl = fixUrl(url);
  return originalFetch(fixedUrl, options);
};

// Override axios if it exists
if (window.axios) {
  originalAxiosRequest = window.axios.request;
  window.axios.request = function(config) {
    if (config.url) {
      config.url = fixUrl(config.url);
    }
    return originalAxiosRequest.call(this, config);
  };
  
  // Also override individual methods
  window.axios.get = function(url, config) {
    return window.axios.request({ ...config, method: 'get', url: fixUrl(url) });
  };
  
  window.axios.post = function(url, data, config) {
    return window.axios.request({ ...config, method: 'post', url: fixUrl(url), data });
  };
  
  window.axios.put = function(url, data, config) {
    return window.axios.request({ ...config, method: 'put', url: fixUrl(url), data });
  };
  
  window.axios.delete = function(url, data, config) {
    return window.axios.request({ ...config, method: 'delete', url: fixUrl(url), data });
  };
  
  // Override axios.create instances
  const originalAxiosCreate = window.axios.create;
  window.axios.create = function(config) {
    const instance = originalAxiosCreate.call(this, config);
    
    // Override the instance methods
    const originalInstanceRequest = instance.request;
    instance.request = function(config) {
      if (config.url) {
        config.url = fixUrl(config.url);
      }
      return originalInstanceRequest.call(this, config);
    };
    
    // Also override individual methods on the instance
    instance.get = function(url, config) {
      return instance.request({ ...config, method: 'get', url: fixUrl(url) });
    };
    
    instance.post = function(url, data, config) {
      return instance.request({ ...config, method: 'post', url: fixUrl(url), data });
    };
    
    instance.put = function(url, data, config) {
      return instance.request({ ...config, method: 'put', url: fixUrl(url), data });
    };
    
    instance.delete = function(url, config) {
      return instance.request({ ...config, method: 'delete', url: fixUrl(url) });
    };
    
    return instance;
  };
}

// Also intercept XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  const fixedUrl = fixUrl(url);
  return originalXHROpen.call(this, method, fixedUrl, ...args);
};

// More aggressive interception - catch any remaining hardcoded URLs
let interceptCount = 0;
const aggressiveIntercept = () => {
  interceptCount++;
  
  // Only log every 10th time to reduce spam
  const shouldLog = interceptCount % 10 === 0;
  
  // Intercept any remaining fetch calls
  if (window.fetch !== originalFetch) {
    if (shouldLog) console.log('[URL Interceptor] Fetch already intercepted');
  } else {
    window.fetch = function(url, options = {}) {
      const fixedUrl = fixUrl(url);
      return originalFetch(fixedUrl, options);
    };
  }
  
  // Intercept any remaining axios calls
  if (window.axios && originalAxiosRequest && window.axios.request !== originalAxiosRequest) {
    if (shouldLog) console.log('[URL Interceptor] Axios already intercepted');
  }
  
  // Intercept any remaining XMLHttpRequest calls
  if (XMLHttpRequest.prototype.open !== originalXHROpen) {
    if (shouldLog) console.log('[URL Interceptor] XMLHttpRequest already intercepted');
  } else {
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      const fixedUrl = fixUrl(url);
      return originalXHROpen.call(this, method, fixedUrl, ...args);
    };
  }
};

// Run aggressive interception immediately and also on DOM ready
aggressiveIntercept();

// Also run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', aggressiveIntercept);
} else {
  aggressiveIntercept();
}

// Run periodically to catch any late-loaded components (reduced frequency)
// Disabled for localhost development
// setInterval(aggressiveIntercept, 5000);

// Log that interceptor is active
console.log('[URL Interceptor] Active - Automatically fixing ALL hardcoded localhost URLs to use dynamic backend URL');
console.log('[URL Interceptor] Periodic interception disabled for localhost development');

export default { fixUrl };
