import { start } from 'single-spa';
import type { SharedServices } from '@/types';
import { globalErrorHandler } from '../global-error-handler';
import { getMFEConfig } from '../config';
import { serviceInitializer } from './service-initializer';
import { ApplicationRegistry } from './application-registry';
import { navigationManager, loadingStateManager } from '@/ui';
import { eventHandlersManager, healthCheckService } from '@/services';

export class LifecycleManager {
  private sharedServices: SharedServices = {};

  async initialize(): Promise<void> {
    try {
      // Phase 1: Core Initialization
      await this.initializeCore();

      // Phase 2: Service Initialization
      await this.initializeServices();

      // Phase 3: Application Registration
      this.registerApplications();

      // Phase 4: Event Handlers Setup
      this.setupEventHandlers();

      // Phase 5: Start Single-SPA
      this.startSingleSPA();

      // Phase 6: Post-Initialization
      this.postInitialization();
    } catch (error) {
      loadingStateManager.showError(
        'Failed to initialize the application. Please refresh the page.'
      );
      throw error;
    }
  }

  private async initializeCore(): Promise<void> {
    // Initialize global error handler
    globalErrorHandler.init();

    // Update SystemJS import map
    this.updateImportMap();
  }

  private async initializeServices(): Promise<void> {
    this.sharedServices = await serviceInitializer.initialize();
  }

  private registerApplications(): void {
    const registry = new ApplicationRegistry(this.sharedServices);
    registry.registerAllMFEs();
  }

  private setupEventHandlers(): void {
    // Setup auth state subscription
    eventHandlersManager.setupAuthStateSubscription(this.sharedServices);

    // Setup DOM event listeners
    eventHandlersManager.setupDOMEventListeners(this.sharedServices);

    // Setup Single-SPA event handlers
    eventHandlersManager.setupSingleSpaEventHandlers();

    // Setup global error handlers
    eventHandlersManager.setupGlobalErrorHandlers(this.sharedServices);
  }

  private startSingleSPA(): void {
    start({
      urlRerouteOnly: true,
    });
  }

  private postInitialization(): void {
    // Initial navigation state
    navigationManager.updateNavigationState(globalThis.location.pathname);

    // Start health checks
    healthCheckService.startPeriodicChecks(this.sharedServices);
  }

  private updateImportMap(): void {
    const urls = getMFEConfig();
    const importMapScript = document.querySelector('script[type="systemjs-importmap"]');

    if (importMapScript) {
      const importMap = JSON.parse(importMapScript.textContent || '{}');
      importMap.imports = {
        ...importMap.imports,
        '@single-spa-demo/react-mfe': urls['react-mfe'],
        '@single-spa-demo/vue-mfe': urls['vue-mfe'],
        '@single-spa-demo/angular-mfe': urls['angular-mfe'],
        '@single-spa-demo/shared-library': urls['shared-library'],
      };

      importMapScript.textContent = JSON.stringify(importMap, null, 2);
    }
  }

  getSharedServices(): SharedServices {
    return this.sharedServices;
  }
}

export const lifecycleManager = new LifecycleManager();
