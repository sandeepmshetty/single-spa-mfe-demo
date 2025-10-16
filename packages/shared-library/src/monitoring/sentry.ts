/**
 * Sentry Error Tracking Configuration
 * 
 * Provides error tracking, performance monitoring, and user context
 * across all micro-frontends.
 */

import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

// Environment variables
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Check if Sentry is configured
const isSentryConfigured = Boolean(SENTRY_DSN);

/**
 * Initialize Sentry
 * Call this once at the root of your application
 */
export const initSentry = (options?: {
  mfeName?: string;
  release?: string;
  tracesSampleRate?: number;
}) => {
  if (!isSentryConfigured) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/.*\.vercel\.app/,
            /^https:\/\/.*\.supabase\.co/,
          ],
        }),
      ],
      
      // Performance Monitoring
      tracesSampleRate: options?.tracesSampleRate ?? (ENVIRONMENT === 'production' ? 0.1 : 1.0),
      
      // Release tracking
      release: options?.release || 'mfe@1.0.0',
      
      // Tag which MFE this is
      initialScope: {
        tags: {
          mfe: options?.mfeName || 'shared-library',
        },
      },
      
      // Filter out noise
      beforeSend(event, hint) {
        // Don't send errors in development unless explicitly enabled
        if (ENVIRONMENT === 'development') {
          console.log('[Sentry] Would send in production:', event);
          return null;
        }
        
        // Filter out common browser extension errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error) {
            const message = String(error.message);
            if (
              message.includes('Extension context invalidated') ||
              message.includes('chrome-extension://') ||
              message.includes('moz-extension://')
            ) {
              return null;
            }
          }
        }
        
        return event;
      },
      
      // Don't capture console logs as breadcrumbs in production
      beforeBreadcrumb(breadcrumb, hint) {
        if (ENVIRONMENT === 'production' && breadcrumb.category === 'console') {
          return null;
        }
        return breadcrumb;
      },
    });

    console.log('✅ Sentry initialized:', {
      environment: ENVIRONMENT,
      mfe: options?.mfeName,
    });
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
};

/**
 * Capture an error manually
 */
export const captureError = (
  error: Error,
  context?: {
    level?: Sentry.SeverityLevel;
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) => {
  if (!isSentryConfigured) return;

  Sentry.captureException(error, {
    level: context?.level || 'error',
    tags: context?.tags,
    extra: context?.extra,
  });
};

/**
 * Capture a message manually
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info'
) => {
  if (!isSentryConfigured) return;
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
  [key: string]: any;
}) => {
  if (!isSentryConfigured) return;
  
  const { id, email, username, ...extraFields } = user;
  Sentry.setUser({
    id,
    email,
    username,
    ...extraFields,
  });
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  if (!isSentryConfigured) return;
  Sentry.setUser(null);
};

/**
 * Add custom breadcrumb
 */
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}) => {
  if (!isSentryConfigured) return;
  
  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || 'custom',
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
    timestamp: Date.now() / 1000,
  });
};

/**
 * Start a new transaction for performance monitoring
 */
export const startTransaction = (
  name: string,
  operation: string = 'navigation'
) => {
  if (!isSentryConfigured) return null;
  
  return Sentry.startTransaction({
    name,
    op: operation,
  });
};

/**
 * Set tag for filtering errors
 */
export const setTag = (key: string, value: string) => {
  if (!isSentryConfigured) return;
  Sentry.setTag(key, value);
};

/**
 * Set extra context data
 */
export const setExtra = (key: string, value: any) => {
  if (!isSentryConfigured) return;
  Sentry.setExtra(key, value);
};

/**
 * React Error Boundary utility
 * Use with your own error boundary or wrap components
 */
export const withErrorBoundary = (component: any, fallback?: any) => {
  // This is a placeholder - implement with React error boundary if needed
  return component;
};

/**
 * Check if Sentry is configured
 */
export const isSentryEnabled = (): boolean => {
  return isSentryConfigured;
};

export { Sentry };
export default {
  init: initSentry,
  captureError,
  captureMessage,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  startTransaction,
  setTag,
  setExtra,
  withErrorBoundary,
  isSentryEnabled,
};
