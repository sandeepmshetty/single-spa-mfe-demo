import { registerApplication } from 'single-spa';
import type { MFEConfig, SystemModule, SharedServices } from '@/types';
import { MFEErrorBoundary } from '../error-boundary';
import { loadingStateManager, navigationManager } from '@/ui';

export class ApplicationRegistry {
  private readonly sharedServices: SharedServices;

  constructor(sharedServices: SharedServices) {
    this.sharedServices = sharedServices;
  }

  registerWelcomeApp(): void {
    registerApplication({
      name: 'welcome',
      app: () =>
        Promise.resolve({
          bootstrap: () => Promise.resolve(),
          mount: () => {
            const welcomeElement = document.getElementById('welcome-section');
            const mfeContainer = document.getElementById('mfe-container');

            if (welcomeElement && mfeContainer) {
              welcomeElement.style.display = 'block';
              mfeContainer.style.display = 'none';
            }

            navigationManager.updateNavigationState('/');
            return Promise.resolve();
          },
          unmount: () => {
            const welcomeElement = document.getElementById('welcome-section');
            const mfeContainer = document.getElementById('mfe-container');

            if (welcomeElement && mfeContainer) {
              welcomeElement.style.display = 'none';
              mfeContainer.style.display = 'block';
            }

            return Promise.resolve();
          },
        }),
      activeWhen: '/',
    });
  }

  registerMFE(config: MFEConfig): void {
    const errorBoundary = new MFEErrorBoundary({
      name: config.name,
      onError: () => loadingStateManager.showError(config.errorMessage),
      fallbackUI: this.createFallbackUI(config.name, config.errorMessage),
    });

    registerApplication({
      name: config.name,
      app: errorBoundary.wrap(() => {
        loadingStateManager.showLoading(`Loading ${config.name}...`);
        return System.import(config.importName).then((module: SystemModule) => {
          console.log(`${config.name} loaded:`, module);
          const lifecycles = module.default || module;
          if (typeof lifecycles === 'function') {
            return lifecycles();
          }
          return {
            bootstrap: lifecycles.bootstrap,
            mount: lifecycles.mount,
            unmount: lifecycles.unmount,
          };
        });
      }),
      activeWhen: config.activeWhen,
      customProps: config.customProps || (() => ({ ...this.sharedServices })),
    });
  }

  registerAllMFEs(): void {
    this.registerWelcomeApp();

    // React MFE - User Management
    this.registerMFE({
      name: 'react-mfe',
      importName: '@single-spa-demo/react-mfe',
      activeWhen: (location: Location) => location.pathname.startsWith('/users'),
      errorMessage: 'Failed to load User Management application',
      customProps: () => ({
        domElement: () => document.getElementById('single-spa-application:react-mfe'),
        ...this.sharedServices,
      }),
    });

    // Vue MFE - Products
    this.registerMFE({
      name: 'vue-mfe',
      importName: '@single-spa-demo/vue-mfe',
      activeWhen: (location: Location) => location.pathname.startsWith('/products'),
      errorMessage: 'Failed to load Products application',
    });

    // Angular MFE - Dashboard
    this.registerMFE({
      name: 'angular-mfe',
      importName: '@single-spa-demo/angular-mfe',
      activeWhen: (location: Location) => location.pathname.startsWith('/dashboard'),
      errorMessage: 'Failed to load Dashboard application',
      customProps: () => ({
        domElementGetter: () => document.getElementById('single-spa-application:angular-mfe'),
        ...this.sharedServices,
      }),
    });
  }

  private createFallbackUI(name: string, errorMessage: string): string {
    const displayName = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 2rem; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h2 style="color: #ef4444; margin-bottom: 0.5rem;">${displayName} Unavailable</h2>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">${errorMessage}</p>
        <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload</button>
      </div>
    `;
  }
}
