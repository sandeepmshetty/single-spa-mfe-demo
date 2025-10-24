/**
 * PostHog Analytics Configuration
 *
 * Provides product analytics, feature flags, and session replay
 * across all micro-frontends.
 */

import posthog, { PostHog } from 'posthog-js';

// Environment variables - injected at build time via rollup replace plugin
const POSTHOG_KEY = process.env['NEXT_PUBLIC_POSTHOG_KEY'] || '';
const POSTHOG_HOST = process.env['NEXT_PUBLIC_POSTHOG_HOST'] || 'https://app.posthog.com';
const ENVIRONMENT = process.env['NODE_ENV'] || 'development';

// Check if PostHog is configured
const isPostHogConfigured = Boolean(POSTHOG_KEY);

// PostHog instance
let postHogInstance: PostHog | null = null;

/**
 * Initialize PostHog
 * Call this once at the root of your application
 */
export const initPostHog = (options?: {
  mfeName?: string;
  enableSessionRecording?: boolean;
  enableAutocapture?: boolean;
}) => {
  if (!isPostHogConfigured) {
    console.warn('⚠️ PostHog API key not configured. Analytics disabled.');
    return null;
  }

  if (postHogInstance) {
    console.log('PostHog already initialized');
    return postHogInstance;
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,

      // Capture settings
      autocapture: options?.enableAutocapture ?? true,
      capture_pageview: true,
      capture_pageleave: true,

      // Session recording
      disable_session_recording: !(options?.enableSessionRecording ?? ENVIRONMENT === 'production'),
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[data-private]',
      },

      // Privacy settings
      mask_all_text: false,
      mask_all_element_attributes: false,

      // Performance
      loaded: posthog => {
        if (ENVIRONMENT === 'development') {
          posthog.debug(false); // Set to true for debugging
        }
      },

      // Persistence
      persistence: 'localStorage+cookie',

      // Cross-subdomain tracking
      cross_subdomain_cookie: true,

      // Set properties
      property_blacklist: ['$initial_referrer', '$initial_referring_domain'],
    });

    // Set super properties (sent with every event)
    posthog.register({
      environment: ENVIRONMENT,
      mfe: options?.mfeName || 'shared-library',
      app_version: '1.0.0',
    });

    postHogInstance = posthog;

    console.log('✅ PostHog initialized:', {
      environment: ENVIRONMENT,
      mfe: options?.mfeName,
      host: POSTHOG_HOST,
    });

    return posthog;
  } catch (error) {
    console.error('❌ Failed to initialize PostHog:', error);
    return null;
  }
};

/**
 * Get PostHog instance
 */
export const getPostHog = (): PostHog | null => {
  return postHogInstance || posthog;
};

/**
 * Track a custom event
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Identify a user
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.identify(userId, properties);
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

/**
 * Reset user identity (on logout)
 */
export const resetUser = () => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.reset();
  } catch (error) {
    console.error('Error resetting user:', error);
  }
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.people.set(properties);
  } catch (error) {
    console.error('Error setting user properties:', error);
  }
};

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (flagKey: string): boolean => {
  if (!isPostHogConfigured) {
    return false;
  }

  try {
    return posthog.isFeatureEnabled(flagKey) ?? false;
  } catch (error) {
    console.error('Error checking feature flag:', error);
    return false;
  }
};

/**
 * Get feature flag value (for multivariate flags)
 */
export const getFeatureFlag = (flagKey: string): string | boolean | undefined => {
  if (!isPostHogConfigured) {
    return undefined;
  }

  try {
    return posthog.getFeatureFlag(flagKey);
  } catch (error) {
    console.error('Error getting feature flag:', error);
    return undefined;
  }
};

/**
 * Reload feature flags
 */
export const reloadFeatureFlags = async (): Promise<void> => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    await posthog.reloadFeatureFlags();
  } catch (error) {
    console.error('Error reloading feature flags:', error);
  }
};

/**
 * Listen for feature flag changes
 */
export const onFeatureFlagsChange = (callback: () => void) => {
  if (!isPostHogConfigured) {
    return () => {};
  }

  try {
    posthog.onFeatureFlags(callback);
    return () => {
      // Cleanup if needed
    };
  } catch (error) {
    console.error('Error setting up feature flag listener:', error);
    return () => {};
  }
};

/**
 * Track page view manually
 */
export const trackPageView = (pageName?: string, properties?: Record<string, any>) => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    if (pageName) {
      posthog.capture('$pageview', { page: pageName, ...properties });
    } else {
      posthog.capture('$pageview', properties);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Start session recording
 */
export const startSessionRecording = () => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.startSessionRecording();
  } catch (error) {
    console.error('Error starting session recording:', error);
  }
};

/**
 * Stop session recording
 */
export const stopSessionRecording = () => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.stopSessionRecording();
  } catch (error) {
    console.error('Error stopping session recording:', error);
  }
};

/**
 * Group analytics (for organizations/teams)
 */
export const groupIdentify = (
  groupType: string,
  groupKey: string,
  properties?: Record<string, any>
) => {
  if (!isPostHogConfigured) {
    return;
  }

  try {
    posthog.group(groupType, groupKey, properties);
  } catch (error) {
    console.error('Error identifying group:', error);
  }
};

/**
 * Check if PostHog is configured
 */
export const isPostHogEnabled = (): boolean => {
  return isPostHogConfigured;
};

/**
 * Common event tracking helpers
 */
export const analytics = {
  // User actions
  buttonClick: (buttonName: string, context?: Record<string, any>) => {
    trackEvent('button_clicked', { button_name: buttonName, ...context });
  },

  // Navigation
  navigate: (from: string, to: string) => {
    trackEvent('navigation', { from, to });
  },

  // Forms
  formSubmit: (formName: string, success: boolean, context?: Record<string, any>) => {
    trackEvent('form_submitted', { form_name: formName, success, ...context });
  },

  // Errors
  error: (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
    });
  },

  // Feature usage
  featureUsed: (featureName: string, context?: Record<string, any>) => {
    trackEvent('feature_used', { feature_name: featureName, ...context });
  },
};

export { posthog };
export default {
  init: initPostHog,
  getPostHog,
  trackEvent,
  identifyUser,
  resetUser,
  setUserProperties,
  isFeatureEnabled,
  getFeatureFlag,
  reloadFeatureFlags,
  onFeatureFlagsChange,
  trackPageView,
  startSessionRecording,
  stopSessionRecording,
  groupIdentify,
  isPostHogEnabled,
  analytics,
};
