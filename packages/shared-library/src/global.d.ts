/**
 * Type definitions for global sharedServices
 * This provides proper typing for the shared library services exposed globally
 */

import type { EventBus } from './event-bus';
import type { StorageService } from './storage-service';
import type { ApiClient } from './api-client';
import type { Logger } from './logger';
import type { Utils } from './utils';
import type { SharedState } from './shared-state';
import type { IErrorLog } from './error-handling/ErrorLogger';
import type { IPerformanceMetric, PerformanceRating } from './monitoring/PerformanceMonitor';
import type { ISentryConfig } from './monitoring/SentryIntegration';
import type { IAuthGuardConfig } from './auth/AuthGuard';
import type { AuthStateManager, AuthState } from './auth/AuthStateManager';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

/**
 * Global shared services interface
 * Exposed on window.sharedServices for all micro-frontends
 */
export interface ISharedServices {
  // Core info
  version: string;
  versionInfo: {
    version: string;
    buildDate: string;
    commit?: string;
  };

  // Core services
  eventBus: EventBus;
  authService: any; // Legacy - to be removed
  storageService: StorageService;
  apiClient: ApiClient;
  logger: Logger;
  utils: typeof Utils;

  // State management
  counterState: SharedState<number>;
  counterActions: {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  };
  userState: SharedState<any>;
  userActions: {
    setUser: (user: any) => void;
    clearUser: () => void;
  };

  // Error handling
  errorLogger: {
    logError: (
      error: Error,
      mfeName: string,
      severity?: 'low' | 'medium' | 'high' | 'critical',
      metadata?: Record<string, any>
    ) => void;
    getLogs: () => IErrorLog[];
    clearLogs: () => void;
    subscribe: (listener: (log: IErrorLog) => void) => () => void;
  };

  // Auth
  authManager: any;
  authGuard: {
    canActivate: (config?: IAuthGuardConfig) => boolean;
    getRedirectUrl: () => string | null;
  };

  // Performance monitoring
  performanceMonitor: {
    init: (mfeName: string) => void;
    trackCustomMetric: (name: string, value: number, mfeName: string) => void;
    getMetrics: () => IPerformanceMetric[];
    cleanup: () => void;
  };
  sentryIntegration: any;

  // Supabase
  supabase: SupabaseClient;
  supabaseAuthService: any;
  authStateManager: AuthStateManager;
  getCurrentSession: () => Promise<Session | null>;
  getCurrentUser: () => Promise<User | null>;
  supabaseSignOut: () => Promise<void>;
  isSupabaseConfigured: () => boolean;

  // Sentry
  initSentry: (config: ISentryConfig) => void;
  captureError: (error: Error, context?: any) => void;
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => void;
  setUserContext: (user: { id: string; email?: string; username?: string }) => void;
  clearUserContext: () => void;
  addBreadcrumb: (breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    data?: any;
  }) => void;
  isSentryEnabled: () => boolean;

  // PostHog
  initPostHog: (apiKey: string, config?: any) => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  identifyUser: (userId: string, properties?: Record<string, any>) => void;
  resetUser: () => void;
  isFeatureEnabled: (featureKey: string) => boolean;
  getFeatureFlag: (flagKey: string) => boolean | string | undefined;
  analytics: any;
  isPostHogEnabled: () => boolean;
}

/**
 * Extend globalThis to include sharedServices
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    sharedServices: ISharedServices;
  }

  // For both browser and Node.js environments
  // eslint-disable-next-line no-var
  var sharedServices: ISharedServices | undefined;
}

export {};
