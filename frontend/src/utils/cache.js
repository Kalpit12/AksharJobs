// Simple in-memory cache for API responses
class APICache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  generateKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create cache instances for different types of data
export const userCache = new APICache(50, 10 * 60 * 1000); // 10 minutes for user data
export const jobCache = new APICache(200, 5 * 60 * 1000); // 5 minutes for job data
export const generalCache = new APICache(100, 5 * 60 * 1000); // 5 minutes for general data

// Cache cleanup interval
setInterval(() => {
  userCache.cleanup();
  jobCache.cleanup();
  generalCache.cleanup();
}, 60000); // Cleanup every minute

// Enhanced fetch with caching
export const cachedFetch = async (url, options = {}, cacheType = 'general') => {
  const cache = cacheType === 'user' ? userCache : 
                cacheType === 'job' ? jobCache : generalCache;
  
  const key = cache.generateKey(url, options);
  
  // Try to get from cache first
  const cachedData = cache.get(key);
  if (cachedData && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
    return cachedData;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Cache successful responses
    if (response.ok) {
      cache.set(key, data);
    }
    
    return data;
  } catch (error) {
    console.error('Cached fetch error:', error);
    throw error;
  }
};

export default APICache;
