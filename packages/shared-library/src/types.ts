// Type definitions for the shared library

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
  preferences: IUserPreferences;
}

export interface IUserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  timezone: string;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface IApiResponse<T = any> {
  data: T | null;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface IEventPayload {
  type: string;
  data: any;
  source: string;
  timestamp: string;
}

export interface IMicroFrontendInfo {
  name: string;
  version: string;
  status: 'loading' | 'mounted' | 'unmounted' | 'error';
  url: string;
}

export interface INavigationEvent {
  from: string;
  to: string;
  user?: IUser;
  timestamp: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  addedAt: string;
}

export interface IDashboardMetric {
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
export interface IApiEndpoints {
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
export interface ISharedConfig {
  apiBaseUrl: string;
  authTokenKey: string;
  debug: boolean;
  version: string;
}

export interface ILogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export interface ILogEntry {
  level: keyof ILogLevel;
  message: string;
  data?: any;
  timestamp: string;
  source: string;
}
