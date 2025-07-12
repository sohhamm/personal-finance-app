import type { User } from '@/db';
import { Logger } from './logger';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      Logger.debug('Cache cleanup completed', { cleanedEntries: cleanedCount });
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
const cache = new InMemoryCache();

// Clean up expired entries every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);

export class UserCache {
  private static readonly USER_PREFIX = 'user:';
  private static readonly TTL_SECONDS = 300; // 5 minutes

  static set(userId: string, user: Omit<User, 'password_hash'>): void {
    const key = `${this.USER_PREFIX}${userId}`;
    cache.set(key, user, this.TTL_SECONDS);
  }

  static get(userId: string): Omit<User, 'password_hash'> | null {
    const key = `${this.USER_PREFIX}${userId}`;
    return cache.get<Omit<User, 'password_hash'>>(key);
  }

  static delete(userId: string): void {
    const key = `${this.USER_PREFIX}${userId}`;
    cache.delete(key);
  }

  static clear(): void {
    // Clear all user cache entries
    for (const key of Array.from((cache as any).cache.keys())) {
      if (key.startsWith(this.USER_PREFIX)) {
        cache.delete(key);
      }
    }
  }
}

export { cache };