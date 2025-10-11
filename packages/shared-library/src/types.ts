// Type definitions for the shared library

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  timezone: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface ApiResponse<T = any> {
  data: T | null;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface EventPayload {
  type: string;
  data: any;
  source: string;
  timestamp: string;
}

export interface MicroFrontendInfo {
  name: string;
  version: string;
  status: 'loading' | 'mounted' | 'unmounted' | 'error';
  url: string;
}

export interface NavigationEvent {
  from: string;
  to: string;
  user?: User;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  timestamp: string;
}

// Event type definitions
export type EventType = 
  | 'auth-changed'
  | 'auth-login'
  | 'auth-logout'
  | 'auth-token-refresh'
  | 'auth-error'
  | 'user-updated'
  | 'user-profile-update'
  | 'navigation-changed'
  | 'product-added-to-cart'
  | 'cart-updated'
  | 'theme-changed'
  | 'mfe-loaded'
  | 'mfe-error'
  | 'notification-sent'
  | 'counter-increment'
  | 'counter-decrement'
  | 'counter-reset'
  | 'counter-sync'
  | 'counter-update'
  | 'user-update'
  | string; // Allow dynamic state updates

// Storage keys
export type StorageKey = 
  | 'auth-token'
  | 'refresh-token'
  | 'user-preferences'
  | 'cart-items'
  | 'theme'
  | 'language';

// API endpoints
export interface ApiEndpoints {
  auth: {
    login: string;
    logout: string;
    refresh: string;
    profile: string;
  };
  users: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
  products: {
    list: string;
    search: string;
    details: string;
  };
  dashboard: {
    metrics: string;
    analytics: string;
  };
}

// Configuration interface
export interface SharedConfig {
  apiBaseUrl: string;
  authTokenKey: string;
  debug: boolean;
  version: string;
}

export interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export interface LogEntry {
  level: keyof LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  source: string;
}