const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key, forceRefresh = false) {
    if (forceRefresh) {
      this.clear(key);
      return null;
    }

    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Clear all expired items
  clearExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > CACHE_EXPIRY) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
