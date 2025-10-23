// Application constants

// Browser-compatible environment detection
const isDevelopment = globalThis.window !== undefined && 
  (globalThis.location.hostname === 'localhost' || globalThis.location.hostname === '127.0.0.1');

export const APP_CONSTANTS = {
  APP_NAME: 'Single-SPA Micro-Frontend Demo',
  VERSION: '1.0.0',
  
  // Local development URLs
  DEV_URLS: {
    SHELL: 'http://localhost:9000',
    REACT_MFE: 'http://localhost:3001',
    VUE_MFE: 'http://localhost:3002',
    ANGULAR_MFE: 'http://localhost:3003',
    SHARED_LIB: 'http://localhost:3004'
  },
  
  // Production URLs (defaults for deployed environments)
  PROD_URLS: {
    SHELL: 'https://mfe-shell-demo.vercel.app',
    REACT_MFE: 'https://react-mfe-demo.vercel.app',
    VUE_MFE: 'https://vue-mfe-demo.vercel.app',
    ANGULAR_MFE: 'https://angular-mfe-demo.vercel.app',
    SHARED_LIB: 'https://shared-mfe-demo.vercel.app'
  }
} as const;

export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_DETAILS: '/users/:id',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/products/cart',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  REPORTS: '/dashboard/reports'
} as const;

export const EVENT_TYPES = {
  // Authentication events
  AUTH_LOGIN: 'auth-login',
  AUTH_LOGOUT: 'auth-logout',
  AUTH_TOKEN_REFRESH: 'auth-token-refresh',
  AUTH_ERROR: 'auth-error',
  
  // User events
  USER_PROFILE_UPDATE: 'user-profile-update',
  USER_PREFERENCES_CHANGE: 'user-preferences-change',
  
  // Navigation events
  NAVIGATION_CHANGE: 'navigation-change',
  ROUTE_CHANGE: 'route-change',
  
  // Product events
  PRODUCT_ADD_TO_CART: 'product-add-to-cart',
  PRODUCT_REMOVE_FROM_CART: 'product-remove-from-cart',
  CART_UPDATE: 'cart-update',
  CART_CLEAR: 'cart-clear',
  
  // UI events
  THEME_CHANGE: 'theme-change',
  LANGUAGE_CHANGE: 'language-change',
  NOTIFICATION_SHOW: 'notification-show',
  
  // MFE lifecycle events
  MFE_BOOTSTRAP: 'mfe-bootstrap',
  MFE_MOUNT: 'mfe-mount',
  MFE_UNMOUNT: 'mfe-unmount',
  MFE_ERROR: 'mfe-error',
  MFE_LOAD_SUCCESS: 'mfe-load-success',
  
  // System events
  SYSTEM_ERROR: 'system-error',
  SYSTEM_WARNING: 'system-warning',
  SYSTEM_INFO: 'system-info',
  
  // Shared state events (for demo)
  COUNTER_INCREMENT: 'counter-increment',
  COUNTER_DECREMENT: 'counter-decrement',
  COUNTER_RESET: 'counter-reset',
  COUNTER_SYNC: 'counter-sync'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mfe-auth-token',
  REFRESH_TOKEN: 'mfe-refresh-token',
  USER_DATA: 'mfe-user-data',
  USER_PREFERENCES: 'mfe-user-preferences',
  CART_ITEMS: 'mfe-cart-items',
  THEME: 'mfe-theme',
  LANGUAGE: 'mfe-language',
  LAST_ROUTE: 'mfe-last-route'
} as const;

export const API_ENDPOINTS = {
  BASE_URL: isDevelopment ? 'http://localhost:3000/api' : 'https://jsonplaceholder.typicode.com',
  
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users',
    PROFILE: '/users/profile'
  },
  
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    DETAILS: '/products',
    CATEGORIES: '/products/categories'
  },
  
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    ANALYTICS: '/dashboard/analytics',
    REPORTS: '/dashboard/reports'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de'
} as const;

export const MFE_NAMES = {
  SHELL: 'shell-app',
  REACT: 'react-mfe',
  VUE: 'vue-mfe',
  ANGULAR: 'angular-mfe',
  SHARED: 'shared-library'
} as const;

// Environment detection
export const IS_DEVELOPMENT = isDevelopment;
export const IS_PRODUCTION = !isDevelopment;
export const IS_BROWSER = globalThis.window !== undefined;

// Default configuration
export const DEFAULT_CONFIG = {
  DEBUG: IS_DEVELOPMENT,
  API_TIMEOUT: 10000,
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  CART_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  LOG_RETENTION: 7 * 24 * 60 * 60 * 1000 // 7 days
} as const;