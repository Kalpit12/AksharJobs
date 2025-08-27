// URL Interceptor - Automatically fixes hardcoded localhost URLs
import API_CONFIG from '../config/api.js';

// Store original fetch function
const originalFetch = window.fetch;
const originalAxios = window.axios;

// Function to fix URLs
const fixUrl = (url) => {
  if (typeof url === 'string') {
    let fixedUrl = url;
    
    // Replace all variations of hardcoded localhost URLs
    const patterns = [
      /http:\/\/(127\.0\.0\.1|localhost):5000/g,
      /http:\/\/(127\.0\.0\.1|localhost):3001/g,
      /http:\/\/(127\.0\.0\.1|localhost):3004/g,
      /http:\/\/(127\.0\.0\.1|localhost):3005/g,
      /http:\/\/(127\.0\.0\.1|localhost):8000/g,
      /http:\/\/(127\.0\.0\.1|localhost):8080/g
    ];
    
    patterns.forEach(pattern => {
      fixedUrl = fixedUrl.replace(pattern, 'http://localhost:3002');
    });
    
    // Also fix any URLs without protocol
    if (fixedUrl.startsWith('//127.0.0.1:5000') || fixedUrl.startsWith('//localhost:5000')) {
      fixedUrl = fixedUrl.replace(/\/\/(127\.0\.0\.1|localhost):5000/g, '//localhost:3002');
    }
    
    // Log all URL changes for debugging
    if (fixedUrl !== url) {
      console.log(`[URL Interceptor] Fixed: ${url} -> ${fixedUrl}`);
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
  const originalAxiosRequest = window.axios.request;
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
  
  window.axios.delete = function(url, config) {
    return window.axios.request({ ...config, method: 'delete', url: fixUrl(url) });
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
    
    return instance;
  };
}

// Also intercept XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  const fixedUrl = fixUrl(url);
  return originalXHROpen.call(this, method, fixedUrl, ...args);
};

// Log that interceptor is active
console.log('[URL Interceptor] Active - Automatically fixing ALL hardcoded localhost URLs to use port 3002');

export default { fixUrl };
