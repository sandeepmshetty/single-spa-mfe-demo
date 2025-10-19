import { registerApplication, start, navigateToUrl } from 'single-spa';
import { MFEErrorBoundary } from './error-boundary';
import { globalErrorHandler } from './global-error-handler';

// Import shared services type
type SharedServices = Window['sharedServices'];

let sharedServices: SharedServices | Record<string, any> = {} as any;

// Initialize shared services
async function initializeSharedServices(): Promise<SharedServices> {
  try {
    const sharedLib = await System.import('@single-spa-demo/shared-library');
    
    // Version compatibility check
    const requiredVersion = '1.0.0';
    if (sharedLib.versionInfo && !sharedLib.versionInfo.compatible(requiredVersion)) {
      console.warn(`Shared library version mismatch. Required: ${requiredVersion}, Found: ${sharedLib.VERSION}`);
    }
    
    sharedServices = {
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
      // Premium services - Supabase
      supabase: sharedLib.supabase,
      supabaseAuthService: sharedLib.supabaseAuthService,
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
      isPostHogEnabled: sharedLib.isPostHogEnabled
    };
    
    // Make services globally available with type safety
    window.sharedServices = sharedServices as SharedServices;
    
    console.log(`🔗 Shared services v${sharedLib.VERSION} initialized:`, Object.keys(sharedServices));
    return sharedServices as SharedServices;
  } catch (error) {
    console.error('Failed to initialize shared services:', error);
    throw error;
  }
}

import { getMFEConfig } from './config';

// Get MFE URLs based on environment
const urls = getMFEConfig();

// Update SystemJS import map dynamically
function updateImportMap() {
  const importMapScript = document.querySelector('script[type="systemjs-importmap"]');
  if (importMapScript) {
    const importMap = JSON.parse(importMapScript.textContent || '{}');
    importMap.imports = {
      ...importMap.imports,
      '@single-spa-demo/react-mfe': urls['react-mfe'],
      '@single-spa-demo/vue-mfe': urls['vue-mfe'],
      '@single-spa-demo/angular-mfe': urls['angular-mfe'],
      '@single-spa-demo/shared-library': urls['shared-library']
    };
    
    importMapScript.textContent = JSON.stringify(importMap, null, 2);
  }
}

// Single-SPA layout configuration - DISABLED (using manual registration instead)
// const routes = constructRoutes(`
//   <single-spa-router mode="hash">
//     <main class="layout-content">
//       <route default>
//         <application name="welcome"></application>
//       </route>
//       <route path="users">
//         <application name="react-mfe"></application>
//       </route>
//       <route path="products">
//         <application name="vue-mfe"></application>
//       </route>
//       <route path="dashboard">
//         <application name="angular-mfe"></application>
//       </route>
//     </main>
//   </single-spa-router>
// `);

// const applications = constructApplications({
//   routes,
//   loadApp({ name }: { name: string }) {
//     console.log(`🔄 Loading application: ${name}`);
//     return System.import(`@single-spa-demo/${name}`);
//   },
// });

// const layoutEngine = constructLayoutEngine({ routes, applications });

// Welcome application (home page)
registerApplication({
  name: 'welcome',
  app: () => Promise.resolve({
    bootstrap: () => Promise.resolve(),
    mount: (props: any) => {
      const welcomeElement = document.getElementById('welcome-section');
      const mfeContainer = document.getElementById('mfe-container');
      
      if (welcomeElement && mfeContainer) {
        welcomeElement.style.display = 'block';
        mfeContainer.style.display = 'none';
      }
      
      updateNavigationState('/');
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

// React MFE - User Management
const reactErrorBoundary = new MFEErrorBoundary({
  name: 'react-mfe',
  onError: (error) => showErrorState('Failed to load User Management application'),
  fallbackUI: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 2rem; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="color: #ef4444; margin-bottom: 0.5rem;">User Management Unavailable</h2>
      <p style="color: #6b7280; margin-bottom: 1.5rem;">The user management module failed to load.</p>
      <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload</button>
    </div>
  `
});

registerApplication({
  name: 'react-mfe',
  app: reactErrorBoundary.wrap(() => {
    showLoadingState('Loading React MFE...');
    return System.import('@single-spa-demo/react-mfe')
      .then((module: any) => {
        console.log('React MFE loaded:', module);
        const lifecycles = module.default || module;
        if (typeof lifecycles === 'function') {
          return lifecycles();
        }
        return {
          bootstrap: lifecycles.bootstrap,
          mount: lifecycles.mount,
          unmount: lifecycles.unmount
        };
      });
  }),
  activeWhen: (location: Location) => location.pathname.startsWith('/users'),
  customProps: () => ({
    domElement: () => document.getElementById('single-spa-application:react-mfe'),
    ...sharedServices
  })
});

// Vue MFE - Products
const vueErrorBoundary = new MFEErrorBoundary({
  name: 'vue-mfe',
  onError: (error) => showErrorState('Failed to load Products application'),
  fallbackUI: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 2rem; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="color: #ef4444; margin-bottom: 0.5rem;">Products Unavailable</h2>
      <p style="color: #6b7280; margin-bottom: 1.5rem;">The products module failed to load.</p>
      <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload</button>
    </div>
  `
});

registerApplication({
  name: 'vue-mfe',
  app: vueErrorBoundary.wrap(() => {
    showLoadingState('Loading Vue MFE...');
    return System.import('@single-spa-demo/vue-mfe')
      .then((module: any) => {
        console.log('Vue MFE loaded:', module);
        const lifecycles = module.default || module;
        if (typeof lifecycles === 'function') {
          return lifecycles();
        }
        return {
          bootstrap: lifecycles.bootstrap,
          mount: lifecycles.mount,
          unmount: lifecycles.unmount
        };
      });
  }),
  activeWhen: (location: Location) => location.pathname.startsWith('/products'),
  customProps: () => ({
    ...sharedServices
  })
});

// Angular MFE - Dashboard
const angularErrorBoundary = new MFEErrorBoundary({
  name: 'angular-mfe',
  onError: (error) => showErrorState('Failed to load Dashboard application'),
  fallbackUI: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 2rem; text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
      <h2 style="color: #ef4444; margin-bottom: 0.5rem;">Dashboard Unavailable</h2>
      <p style="color: #6b7280; margin-bottom: 1.5rem;">The dashboard module failed to load.</p>
      <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload</button>
    </div>
  `
});

registerApplication({
  name: 'angular-mfe',
  app: angularErrorBoundary.wrap(() => {
    showLoadingState('Loading Angular MFE...');
    return System.import('@single-spa-demo/angular-mfe')
      .then((module: any) => {
        console.log('Angular MFE loaded:', module);
        const lifecycles = module.default || module;
        if (typeof lifecycles === 'function') {
          return lifecycles();
        }
        return {
          bootstrap: lifecycles.bootstrap,
          mount: lifecycles.mount,
          unmount: lifecycles.unmount
        };
      });
  }),
  activeWhen: (location: Location) => location.pathname.startsWith('/dashboard'),
  customProps: () => ({
    domElementGetter: () => document.getElementById('single-spa-application:angular-mfe'),
    ...sharedServices
  })
});

// UI State Management
function showLoadingState(message = 'Loading...') {
  const loadingContainer = document.getElementById('loading-container');
  const loadingText = loadingContainer?.querySelector('.loading-text');
  
  if (loadingContainer && loadingText) {
    loadingText.textContent = message;
    loadingContainer.style.display = 'flex';
  }
  
  const mfeContainer = document.getElementById('mfe-container');
  if (mfeContainer) {
    mfeContainer.setAttribute('data-loading', 'true');
  }
}

function hideLoadingState() {
  const loadingContainer = document.getElementById('loading-container');
  if (loadingContainer) {
    loadingContainer.style.display = 'none';
  }
  
  const mfeContainer = document.getElementById('mfe-container');
  if (mfeContainer) {
    mfeContainer.removeAttribute('data-loading');
  }
}

function showErrorState(message: string) {
  hideLoadingState();
  
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.innerHTML = `
      <div class="error-container">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${message}</span>
        <button class="error-close" onclick="this.parentElement.remove()">✕</button>
      </div>
    `;
    errorContainer.style.display = 'block';
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorContainer.style.display !== 'none') {
        errorContainer.style.display = 'none';
      }
    }, 10000);
  }
}

// Navigation Management
function updateNavigationState(pathname: string) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const element = item as HTMLElement;
    element.classList.remove('active');
    
    const route = element.getAttribute('data-route');
    if (
      (route === 'home' && pathname === '/') ||
      (route === 'users' && pathname.startsWith('/users')) ||
      (route === 'products' && pathname.startsWith('/products')) ||
      (route === 'dashboard' && pathname.startsWith('/dashboard'))
    ) {
      element.classList.add('active');
    }
  });
}

// Authentication State Management
function updateAuthState(authState: any) {
  const authStatus = document.getElementById('auth-status');
  const userAvatar = document.getElementById('user-avatar');
  
  if (authStatus && userAvatar) {
    if (authState?.isAuthenticated && authState?.user) {
      authStatus.textContent = authState.user.name;
      userAvatar.textContent = authState.user.name.charAt(0).toUpperCase();
      userAvatar.style.background = 'rgba(16, 185, 129, 0.2)';
    } else {
      authStatus.textContent = 'Sign In';
      userAvatar.textContent = '👤';
      userAvatar.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  }
}

// Health Check System
async function performHealthCheck() {
  const healthDot = document.getElementById('health-dot');
  const healthStatus = document.getElementById('health-status');
  
  if (!healthDot || !healthStatus) return;
  
  try {
    const checks = await Promise.allSettled([
      fetch('/api/health', { method: 'HEAD' }).then(r => r.ok),
      Promise.resolve(System.has('@single-spa-demo/shared-library')),
    ]);
    
    const allHealthy = checks.every(check => 
      check.status === 'fulfilled' && check.value === true
    );
    
    if (allHealthy) {
      healthDot.className = 'health-dot';
      healthStatus.textContent = 'All Systems Operational';
    } else {
      healthDot.className = 'health-dot warning';
      healthStatus.textContent = 'Some Issues Detected';
    }
  } catch (error) {
    healthDot.className = 'health-dot error';
    healthStatus.textContent = 'System Issues';
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('nav-item')) {
      event.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        navigateToUrl(href);
      }
    }
  });
  
  // Auth status click
  const authStatus = document.getElementById('auth-status');
  if (authStatus) {
    authStatus.addEventListener('click', () => {
      if (sharedServices.authService?.isAuthenticated()) {
        // Show user menu or logout
        if (confirm('Do you want to sign out?')) {
          sharedServices.authService.logout();
        }
      } else {
        // Navigate to login or show login modal
        navigateToUrl('/users');
      }
    });
  }
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      
      if (sharedServices.eventBus) {
        sharedServices.eventBus.emit('theme-changed', { 
          theme: isDark ? 'dark' : 'light' 
        });
      }
    });
  }
}

// Single-SPA Event Handlers
function setupSingleSpaEventHandlers() {
  window.addEventListener('single-spa:routing-event', (event) => {
    console.log('🧭 Route change:', window.location.pathname);
    updateNavigationState(window.location.pathname);
    hideLoadingState();
    
    // Toggle welcome section and MFE container based on route
    const welcomeElement = document.getElementById('welcome-section');
    const mfeContainer = document.getElementById('mfe-container');
    
    if (welcomeElement && mfeContainer) {
      if (window.location.pathname === '/') {
        welcomeElement.style.display = 'block';
        mfeContainer.style.display = 'none';
      } else {
        welcomeElement.style.display = 'none';
        mfeContainer.style.display = 'block';
      }
    }
  });

  window.addEventListener('single-spa:app-change', (event: any) => {
    console.log('📱 App change:', event.detail);
    
    const { appsByNewStatus } = event.detail;
    
    if (appsByNewStatus.LOADING_SOURCE_CODE?.length > 0) {
      const appName = appsByNewStatus.LOADING_SOURCE_CODE[0];
      showLoadingState(`Loading ${appName}...`);
    }
    
    if (appsByNewStatus.NOT_MOUNTED?.length > 0 && 
        !appsByNewStatus.LOADING_SOURCE_CODE?.length) {
      hideLoadingState();
    }
  });

  window.addEventListener('single-spa:before-routing-event', () => {
    // Clear any existing errors when navigating
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
  });
}

// Initialize Application
async function initializeApplication() {
  try {
    console.log('🚀 Initializing Shell Application...');
    
    // Initialize global error handler
    globalErrorHandler.init();
    
    // Update import map for current environment
    updateImportMap();
    
    // Initialize shared services
    await initializeSharedServices();
    
    // Set up authentication state listener
    if (sharedServices.authService) {
      sharedServices.authService.onAuthChange(updateAuthState);
      updateAuthState(sharedServices.authService.getAuthState());
    }
    
    // Set up event listeners
    setupEventListeners();
    setupSingleSpaEventHandlers();
    
    // Activate layout engine
    // Layout engine disabled - using manual registration
    // layoutEngine.activate();
    
    // Start Single-SPA
    start({
      urlRerouteOnly: true,
    });
    
    // Initial navigation state
    updateNavigationState(window.location.pathname);
    
    // Start health checks
    performHealthCheck();
    setInterval(performHealthCheck, 30000); // Every 30 seconds
    
    console.log('✅ Shell Application initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize Shell Application:', error);
    showErrorState('Failed to initialize the application. Please refresh the page.');
  }
}

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showErrorState('An unexpected error occurred');
  
  if (sharedServices.logger) {
    sharedServices.logger.error('Global error', {
      message: event.error?.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showErrorState('A system error occurred');
  
  if (sharedServices.logger) {
    sharedServices.logger.error('Unhandled promise rejection', event.reason);
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
  initializeApplication();
}

// Export for debugging
window.shellApp = {
  navigateToUrl,
  sharedServices: () => sharedServices as SharedServices,
  performHealthCheck,
  showLoadingState,
  hideLoadingState,
  showErrorState
};

export default {};