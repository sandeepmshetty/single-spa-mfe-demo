// Main entry point for shared library
export { EventBus, eventBus } from './event-bus';
/** @deprecated Use supabaseAuthService instead */
export { AuthService, authService } from './auth-service';
export { StorageService, storageService } from './storage-service';
export { ApiClient, apiClient } from './api-client';
export { Logger, logger } from './logger';
export { Utils } from './utils';
export { getEnvVar, isProduction, isDevelopment } from './utils/env';
export { SharedState, counterState, counterActions, userState, userActions } from './shared-state';
export { VERSION, versionInfo } from './version';
export * from './types';
export * from './constants';
export { errorLogger, type IErrorLog } from './error-handling';
export { authManager, authGuard, type IAuthGuardConfig } from './auth';
export {
  performanceMonitor,
  sentryIntegration,
  type IPerformanceMetric,
  type ISentryConfig,
  type PerformanceRating,
} from './monitoring';

// Premium Free Tier Integrations
export {
  supabase,
  isSupabaseConfigured,
  getCurrentSession,
  getCurrentUser,
  signOut as supabaseSignOut,
} from './config/supabase';
export { authService as supabaseAuthService } from './auth/SupabaseAuth';
export {
  AuthStateManager,
  type IAuthState,
  type AuthStateChangeCallback,
} from './auth/AuthStateManager';
export {
  initSentry,
  captureError,
  captureMessage,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  isSentryEnabled,
} from './monitoring/sentry';
export {
  initPostHog,
  trackEvent,
  identifyUser,
  resetUser,
  isFeatureEnabled,
  getFeatureFlag,
  analytics,
  isPostHogEnabled,
} from './analytics/posthog';

// Global types
export type { ISharedServices } from './global';

// Initialization
import {
  initializeServices,
  createAuthStateManager,
  setupGlobalServices,
  initializeAuthState,
} from './init';
import { logger } from './logger';

// Initialize services
initializeServices();

// Create and export AuthStateManager instance
const authStateManager = createAuthStateManager();
export { authStateManager };

// Setup global services (browser environment)
setupGlobalServices(authStateManager);

// Initialize auth state (browser environment)
if (globalThis.window !== undefined) {
  try {
    await initializeAuthState(authStateManager);
  } catch (error) {
    logger.error('Failed to initialize auth state:', error as Error);
  }
}
