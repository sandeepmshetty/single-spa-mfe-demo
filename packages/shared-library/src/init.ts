/**
 * Shared Library Initialization
 * Handles setup of all services and global exports
 */

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
import {
  supabase,
  getCurrentSession,
  getCurrentUser,
  signOut as supabaseSignOut,
  isSupabaseConfigured,
} from './config/supabase';
import { authService as supabaseAuthService } from './auth/SupabaseAuth';
import {
  initSentry,
  captureError,
  captureMessage,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  isSentryEnabled,
} from './monitoring/sentry';
import {
  initPostHog,
  trackEvent,
  identifyUser,
  resetUser,
  isFeatureEnabled,
  getFeatureFlag,
  analytics,
  isPostHogEnabled,
} from './analytics/posthog';
import { AuthStateManager } from './auth/AuthStateManager';
import type { ISharedServices } from './global';

/**
 * Initialize shared library services
 */
export function initializeServices(): void {
  logger.info(`🔗 Shared Library v${VERSION} initialized`);

  // Debug: Log premium services availability
  logger.debug('Premium services loaded:', {
    supabase: typeof supabase,
    initSentry: typeof initSentry,
    initPostHog: typeof initPostHog,
    supabaseAuthService: typeof supabaseAuthService,
  });
}

/**
 * Create and initialize AuthStateManager
 */
export function createAuthStateManager(): AuthStateManager {
  const authStateManager = new AuthStateManager(supabaseAuthService, eventBus);
  logger.debug('authStateManager created:', { initialized: !!authStateManager });
  return authStateManager;
}

/**
 * Setup global sharedServices object
 */
export function setupGlobalServices(authStateManager: AuthStateManager): void {
  if (globalThis.window === undefined) {
    logger.warn('Window not available, skipping global services setup');
    return;
  }

  logger.debug('Setting up global sharedServices');

  globalThis.sharedServices = {
    version: VERSION,
    versionInfo,
    eventBus,
    authService, // @deprecated - Use supabaseAuthService instead
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
    authStateManager,
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
    isPostHogEnabled,
  } as any as ISharedServices;

  const serviceCount = Object.keys(globalThis.sharedServices).length;
  logger.info(`✅ globalThis.sharedServices initialized with ${serviceCount} properties`);
}

/**
 * Initialize auth state manager in browser environment
 */
export async function initializeAuthState(authStateManager: AuthStateManager): Promise<void> {
  if (globalThis.window === undefined) {
    return;
  }

  try {
    await authStateManager.initialize();
    logger.info('✅ AuthStateManager initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize AuthStateManager:', error);
  }
}
