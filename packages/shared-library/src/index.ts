// Main entry point for shared library
export { EventBus, eventBus } from './event-bus';
export { AuthService, authService } from './auth-service';
export { StorageService, storageService } from './storage-service';
export { ApiClient, apiClient } from './api-client';
export { Logger, logger } from './logger';
export { Utils } from './utils';
export { SharedState, counterState, counterActions, userState, userActions } from './shared-state';
export { VERSION, versionInfo } from './version';
export * from './types';
export * from './constants';
export { errorLogger, type IErrorLog } from './error-handling';
export { authManager, authGuard, type IAuthGuardConfig } from './auth';
export { performanceMonitor, sentryIntegration, type IPerformanceMetric, type ISentryConfig, type PerformanceRating } from './monitoring';

// Premium Free Tier Integrations
export { supabase, isSupabaseConfigured, getCurrentSession, getCurrentUser, signOut as supabaseSignOut } from './config/supabase';
export { authService as supabaseAuthService } from './auth/SupabaseAuth';
export { 
  initSentry, 
  captureError, 
  captureMessage, 
  setUserContext, 
  clearUserContext, 
  addBreadcrumb,
  isSentryEnabled 
} from './monitoring/sentry';
export { 
  initPostHog, 
  trackEvent, 
  identifyUser, 
  resetUser, 
  isFeatureEnabled, 
  getFeatureFlag,
  analytics,
  isPostHogEnabled 
} from './analytics/posthog';

// Global initialization
import { logger } from './logger';
import { eventBus } from './event-bus';
import { authService } from './auth-service';
import { storageService } from './storage-service';
import { apiClient } from './api-client';
import { Utils } from './utils';
import { counterState, counterActions, userState, userActions } from './shared-state';
import { VERSION, versionInfo } from './version';
import { errorLogger } from './error-handling';
import { authManager, authGuard } from './auth';
import { performanceMonitor, sentryIntegration } from './monitoring';
import { supabase, getCurrentSession, getCurrentUser, signOut as supabaseSignOut, isSupabaseConfigured } from './config/supabase';
import { authService as supabaseAuthService } from './auth/SupabaseAuth';
import { initSentry, captureError, captureMessage, setUserContext, clearUserContext, addBreadcrumb, isSentryEnabled } from './monitoring/sentry';
import { initPostHog, trackEvent, identifyUser, resetUser, isFeatureEnabled, getFeatureFlag, analytics, isPostHogEnabled } from './analytics/posthog';

logger.info(`🔗 Shared Library v${VERSION} initialized`);

// Debug: Log premium services availability
console.log('🔍 Premium services loaded:', {
  supabase: typeof supabase,
  initSentry: typeof initSentry,
  initPostHog: typeof initPostHog,
  supabaseAuthService: typeof supabaseAuthService
});

// Make services globally available for Single-SPA
if (typeof window !== 'undefined') {
  (window as any).sharedServices = {
    version: VERSION,
    versionInfo,
    eventBus,
    authService,
    storageService,
    apiClient,
    logger,
    utils: Utils,
    counterState,
    counterActions,
    userState,
    userActions,
    errorLogger,
    authManager,
    authGuard,
    performanceMonitor,
    sentryIntegration,
    // Premium services - Supabase
    supabase,
    supabaseAuthService,
    getCurrentSession,
    getCurrentUser,
    supabaseSignOut,
    isSupabaseConfigured,
    // Premium services - Sentry
    initSentry,
    captureError,
    captureMessage,
    setUserContext,
    clearUserContext,
    addBreadcrumb,
    isSentryEnabled,
    // Premium services - PostHog
    initPostHog,
    trackEvent,
    identifyUser,
    resetUser,
    isFeatureEnabled,
    getFeatureFlag,
    analytics,
    isPostHogEnabled
  };
  
  console.log('✅ window.sharedServices initialized with', Object.keys((window as any).sharedServices).length, 'properties');
}