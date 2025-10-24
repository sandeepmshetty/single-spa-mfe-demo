/**
 * Services Barrel Export
 * Organizes all service exports in one place
 */

// Core services
export { EventBus, eventBus } from './event-bus';
export { StorageService, storageService } from './storage-service';
export { ApiClient, apiClient } from './api-client';
export { Logger, logger } from './logger';
export { Utils } from './utils';

// State management
export { SharedState, counterState, counterActions, userState, userActions } from './shared-state';

// Error handling
export { errorLogger } from './error-handling';
export type { IErrorLog } from './error-handling/ErrorLogger';

// Auth services
export { authManager, authGuard } from './auth';
export type { IAuthGuardConfig } from './auth/AuthGuard';
export { AuthStateManager } from './auth/AuthStateManager';
export type { IAuthState, AuthStateChangeCallback } from './auth/AuthStateManager';

// Legacy auth (deprecated)
/** @deprecated Use supabaseAuthService instead */
export { AuthService, authService } from './auth-service';

// Supabase auth
export { authService as supabaseAuthService } from './auth/SupabaseAuth';

// Monitoring
export { performanceMonitor, sentryIntegration } from './monitoring';
export type { IPerformanceMetric, PerformanceRating } from './monitoring/PerformanceMonitor';
export type { ISentryConfig } from './monitoring/SentryIntegration';

// Premium integrations
export * from './config/supabase';
export * from './monitoring/sentry';
export * from './analytics/posthog';

// Types and constants
export * from './types';
export * from './constants';
export { VERSION, versionInfo } from './version';
