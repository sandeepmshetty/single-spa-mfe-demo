/**
 * Configuration
 * Application-wide configuration and constants
 */

export const CONFIG = {
  app: {
    name: 'React MFE',
    version: '1.0.0',
    basename: '/users',
  },

  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },

  auth: {
    providers: ['email', 'google', 'github'] as const,
    sessionTimeout: 3600, // 1 hour in seconds
    passwordMinLength: 8,
    emailConfirmationRequired: true,
  },

  features: {
    enableMockAuth: process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableErrorReporting: process.env.NODE_ENV === 'production',
  },

  ui: {
    toastDuration: 3000, // 3 seconds
    modalAnimationDuration: 300, // 300ms
    debounceDelay: 300, // 300ms
  },
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * Event types for event bus
 */
export const EVENT_TYPES = {
  AUTH: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    REGISTER: 'auth:register',
    SESSION_EXPIRED: 'auth:session_expired',
  },
  COUNTER: {
    INCREMENT: 'counter-increment',
    DECREMENT: 'counter-decrement',
    RESET: 'counter-reset',
  },
  UI: {
    MODAL_OPEN: 'ui:modal_open',
    MODAL_CLOSE: 'ui:modal_close',
    TOAST_SHOW: 'ui:toast_show',
  },
} as const;

/**
 * Analytics event names
 */
export const ANALYTICS_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILURE: 'signup_failure',
  LOGOUT: 'logout_success',
  OAUTH_INITIATED: 'oauth_initiated',
  COUNTER_INCREMENT: 'counter_increment',
  COUNTER_DECREMENT: 'counter_decrement',
  COUNTER_RESET: 'counter_reset',
} as const;
