/**
 * Storage service for persisting data across micro-frontends
 * Provides a unified interface for localStorage, sessionStorage, and memory storage
 */
export class StorageService {
  private memoryStore = new Map<string, string>();
  
  constructor(private useMemoryFallback = true) {}

  /**
   * Set item in storage
   */
  setItem(key: string, value: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else if (this.useMemoryFallback) {
        this.memoryStore.set(key, value);
      }
    } catch (error) {
      console.warn('Failed to set storage item:', error);
      if (this.useMemoryFallback) {
        this.memoryStore.set(key, value);
      }
    }
  }

  /**
   * Get item from storage
   */
  getItem(key: string): string | null {
    try {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      } else if (this.useMemoryFallback) {
        return this.memoryStore.get(key) || null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get storage item:', error);
      if (this.useMemoryFallback) {
        return this.memoryStore.get(key) || null;
      }
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch (error) {
      console.warn('Failed to remove storage item:', error);
    }
  }

  /**
   * Clear all storage
   */
  clear(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.clear();
      }
      this.memoryStore.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    try {
      if (this.isLocalStorageAvailable()) {
        return Object.keys(localStorage);
      } else {
        return Array.from(this.memoryStore.keys());
      }
    } catch (error) {
      console.warn('Failed to get storage keys:', error);
      return Array.from(this.memoryStore.keys());
    }
  }

  /**
   * Set object in storage (JSON serialization)
   */
  setObject(key: string, value: any): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to set object in storage:', error);
    }
  }

  /**
   * Get object from storage (JSON deserialization)
   */
  getObject<T = any>(key: string): T | null {
    try {
      const item = this.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to get object from storage:', error);
      return null;
    }
  }

  /**
   * Check if key exists in storage
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get storage size (number of items)
   */
  size(): number {
    try {
      if (this.isLocalStorageAvailable()) {
        return localStorage.length;
      } else {
        return this.memoryStore.size;
      }
    } catch (error) {
      console.warn('Failed to get storage size:', error);
      return this.memoryStore.size;
    }
  }

  /**
   * Session storage methods
   */
  setSessionItem(key: string, value: string): void {
    try {
      if (this.isSessionStorageAvailable()) {
        sessionStorage.setItem(key, value);
      } else if (this.useMemoryFallback) {
        this.memoryStore.set(`session:${key}`, value);
      }
    } catch (error) {
      console.warn('Failed to set session storage item:', error);
    }
  }

  getSessionItem(key: string): string | null {
    try {
      if (this.isSessionStorageAvailable()) {
        return sessionStorage.getItem(key);
      } else if (this.useMemoryFallback) {
        return this.memoryStore.get(`session:${key}`) || null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get session storage item:', error);
      return null;
    }
  }

  removeSessionItem(key: string): void {
    try {
      if (this.isSessionStorageAvailable()) {
        sessionStorage.removeItem(key);
      }
      this.memoryStore.delete(`session:${key}`);
    } catch (error) {
      console.warn('Failed to remove session storage item:', error);
    }
  }

  /**
   * Storage availability checks
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Storage event listener for cross-tab synchronization
   */
  onStorageChange(callback: (event: StorageEvent) => void): () => void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    }
    return () => {};
  }
}

// Create and export singleton instance
export const storageService = new StorageService();