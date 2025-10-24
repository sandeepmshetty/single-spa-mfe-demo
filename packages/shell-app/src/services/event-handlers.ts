/**
 * Event Handlers Manager
 * Sets up and manages DOM and Single-SPA event listeners
 */

import { navigateToUrl } from 'single-spa';
import type { SharedServices, AuthState, User } from '@/types';
import { loadingStateManager, navigationManager, authUIManager } from '@/ui';

export class EventHandlersManager {
  private currentAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
  };

  setupDOMEventListeners(sharedServices: SharedServices): void {
    this.setupAuthStateTracking(sharedServices);
    this.setupNavigationClicks();
    this.setupUserMenu(sharedServices);
    this.setupThemeToggle(sharedServices);
  }

  setupSingleSpaEventHandlers(): void {
    this.setupRoutingEvents();
    this.setupAppChangeEvents();
    this.setupBeforeRoutingEvents();
  }

  private setupAuthStateTracking(sharedServices: SharedServices): void {
    if (sharedServices.authStateManager) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sharedServices.authStateManager.subscribe((authState: any) => {
        this.currentAuthState = {
          isAuthenticated: authState.isAuthenticated,
          user: authState.user as User | null,
        };
      });
    }
  }

  private setupNavigationClicks(): void {
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('nav-item')) {
        event.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          navigateToUrl(href);
        }
      }
    });
  }

  private setupUserMenu(sharedServices: SharedServices): void {
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const logoutButton = document.getElementById('logout-button');

    if (!userMenuTrigger || !userMenuDropdown) {
      return;
    }

    let isDropdownOpen = false;

    // Toggle dropdown on click
    userMenuTrigger.addEventListener('click', e => {
      e.stopPropagation();

      if (this.currentAuthState.isAuthenticated && this.currentAuthState.user) {
        isDropdownOpen = !isDropdownOpen;
        userMenuDropdown.classList.toggle('show', isDropdownOpen);
      } else {
        navigateToUrl('/users/login');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      if (isDropdownOpen && !userMenuDropdown.contains(e.target as Node)) {
        isDropdownOpen = false;
        userMenuDropdown.classList.remove('show');
      }
    });

    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener('click', async e => {
        e.stopPropagation();
        try {
          if (sharedServices.supabaseAuthService) {
            await sharedServices.supabaseAuthService.signOut();
          }
          isDropdownOpen = false;
          userMenuDropdown.classList.remove('show');
          console.log('✅ Logged out successfully');
          navigateToUrl('/');
        } catch (error) {
          console.error('Logout error:', error);
          alert('Failed to logout. Please try again.');
        }
      });
    }
  }

  private setupThemeToggle(sharedServices: SharedServices): void {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
      return;
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeToggle.textContent = isDark ? '☀️' : '🌙';

      if (sharedServices.eventBus) {
        sharedServices.eventBus.emit('theme-changed', {
          theme: isDark ? 'dark' : 'light',
        });
      }
    });
  }

  private setupRoutingEvents(): void {
    globalThis.addEventListener('single-spa:routing-event', () => {
      console.log('🧭 Route change:', globalThis.location.pathname);
      navigationManager.updateNavigationState(globalThis.location.pathname);
      loadingStateManager.hideLoading();
    });
  }

  private setupAppChangeEvents(): void {
    globalThis.addEventListener('single-spa:app-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('📱 App change:', customEvent.detail);

      const { appsByNewStatus } = customEvent.detail;

      if (appsByNewStatus.LOADING_SOURCE_CODE?.length > 0) {
        const appName = appsByNewStatus.LOADING_SOURCE_CODE[0];
        loadingStateManager.showLoading(`Loading ${appName}...`);
      }

      if (appsByNewStatus.NOT_MOUNTED?.length > 0 && !appsByNewStatus.LOADING_SOURCE_CODE?.length) {
        loadingStateManager.hideLoading();
      }
    });
  }

  private setupBeforeRoutingEvents(): void {
    globalThis.addEventListener('single-spa:before-routing-event', () => {
      loadingStateManager.clearError();
    });
  }

  setupGlobalErrorHandlers(sharedServices: SharedServices): void {
    globalThis.addEventListener('error', event => {
      console.error('Global error:', event.error);
      loadingStateManager.showError('An unexpected error occurred');

      if (sharedServices.logger) {
        sharedServices.logger.error('Global error', {
          message: event.error?.message,
          stack: event.error?.stack,
          filename: event.filename,
          lineno: event.lineno,
        });
      }
    });

    globalThis.addEventListener('unhandledrejection', event => {
      console.error('Unhandled promise rejection:', event.reason);
      loadingStateManager.showError('A system error occurred');

      if (sharedServices.logger) {
        sharedServices.logger.error('Unhandled promise rejection', event.reason);
      }
    });
  }

  setupAuthStateSubscription(sharedServices: SharedServices): void {
    if (sharedServices.authStateManager) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sharedServices.authStateManager.subscribe((authState: any) => {
        console.log('🔐 Auth state updated:', authState.isAuthenticated, authState.user?.email);
        authUIManager.updateAuthState({
          isAuthenticated: authState.isAuthenticated,
          user: authState.user as User | null,
        });
      });
    }
  }
}

export const eventHandlersManager = new EventHandlersManager();
