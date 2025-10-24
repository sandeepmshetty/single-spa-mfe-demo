/**
 * Service Initializer - Manages shared services initialization
 * Implements Singleton pattern for shared services
 */

import type { SharedServices } from '@/types';

class ServiceInitializer {
  private static instance: ServiceInitializer;
  private services: SharedServices = {};
  private initialized = false;

  private constructor() {}

  static getInstance(): ServiceInitializer {
    if (!ServiceInitializer.instance) {
      ServiceInitializer.instance = new ServiceInitializer();
    }
    return ServiceInitializer.instance;
  }

  async initialize(): Promise<SharedServices> {
    if (this.initialized) {
      return this.services;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sharedLib = (await System.import('@single-spa-demo/shared-library')) as any;

      // Version compatibility check
      const requiredVersion = '1.0.0';
      if (sharedLib.versionInfo && !sharedLib.versionInfo.compatible(requiredVersion)) {
        console.warn(
          `Shared library version mismatch. Required: ${requiredVersion}, Found: ${sharedLib.VERSION}`
        );
      }

      this.services = this.mapServices(sharedLib);

      // Make services globally available
      (globalThis as Record<string, unknown>).sharedServices = this.services;

      this.initialized = true;
      console.log(
        `🔗 Shared services v${sharedLib.VERSION} initialized:`,
        Object.keys(this.services)
      );

      return this.services;
    } catch (error) {
      console.error('Failed to initialize shared services:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapServices(sharedLib: any): SharedServices {
    return {
      version: sharedLib.VERSION,
      versionInfo: sharedLib.versionInfo,
      eventBus: sharedLib.eventBus,
      authService: sharedLib.authService,
      storageService: sharedLib.storageService,
      apiClient: sharedLib.apiClient,
      logger: sharedLib.logger,
      utils: sharedLib.Utils,
      counterState: sharedLib.counterState,
      counterActions: sharedLib.counterActions,
      userState: sharedLib.userState,
      userActions: sharedLib.userActions,
      errorLogger: sharedLib.errorLogger,
      authManager: sharedLib.authManager,
      authGuard: sharedLib.authGuard,
      performanceMonitor: sharedLib.performanceMonitor,
      sentryIntegration: sharedLib.sentryIntegration,
      // Premium services - Supabase
      supabase: sharedLib.supabase,
      supabaseAuthService: sharedLib.supabaseAuthService,
      authStateManager: sharedLib.authStateManager,
      getCurrentSession: sharedLib.getCurrentSession,
      getCurrentUser: sharedLib.getCurrentUser,
      supabaseSignOut: sharedLib.supabaseSignOut,
      isSupabaseConfigured: sharedLib.isSupabaseConfigured,
      // Premium services - Sentry
      initSentry: sharedLib.initSentry,
      captureError: sharedLib.captureError,
      captureMessage: sharedLib.captureMessage,
      setUserContext: sharedLib.setUserContext,
      clearUserContext: sharedLib.clearUserContext,
      addBreadcrumb: sharedLib.addBreadcrumb,
      isSentryEnabled: sharedLib.isSentryEnabled,
      // Premium services - PostHog
      initPostHog: sharedLib.initPostHog,
      trackEvent: sharedLib.trackEvent,
      identifyUser: sharedLib.identifyUser,
      resetUser: sharedLib.resetUser,
      isFeatureEnabled: sharedLib.isFeatureEnabled,
      getFeatureFlag: sharedLib.getFeatureFlag,
      analytics: sharedLib.analytics,
      isPostHogEnabled: sharedLib.isPostHogEnabled,
    };
  }

  getServices(): SharedServices {
    return this.services;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const serviceInitializer = ServiceInitializer.getInstance();
