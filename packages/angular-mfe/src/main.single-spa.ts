import './polyfills';
import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { SharedServicesService } from './app/services/shared-services.service';

if (environment.production) {
  enableProdMode();
}

const eventBusSubscriptions: Array<() => void> = [];

// Single-SPA Angular configuration
const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps: any) => {
    console.log('🚀 Angular MFE: Bootstrapping Dashboard...');
    
    const extraProviders = getSingleSpaExtraProviders();
    
    return platformBrowserDynamic([
      ...extraProviders,
      { provide: 'singleSpaProps', useValue: singleSpaProps }
    ]).bootstrapModule(AppModule)
      .then((moduleRef) => {
        console.log('✅ Angular MFE: Bootstrap complete');
        return moduleRef;
      })
      .catch(err => {
        console.error('❌ Angular MFE: Bootstrap failed', err);
        throw err;
      });
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone,
});

// Custom lifecycle with shared services integration
const customBootstrap = async (props: any) => {
  console.log('🔧 Angular MFE: Custom bootstrap starting...');
  
  // Initialize shared services if available
  if (props.eventBus || props.authService) {
    // Store props globally for service injection
    (window as any).singleSpaProps = props;
    
    // Set up global event listeners
    if (props.eventBus) {
      // Theme changes
      eventBusSubscriptions.push(
        props.eventBus.on('theme-changed', (data: any) => {
        console.log('Angular MFE: Theme changed to', data.theme);
        document.documentElement.setAttribute('data-theme', data.theme);
        
        // Apply Angular Material theme
        const body = document.body;
        if (data.theme === 'dark') {
          body.classList.add('dark-theme');
        } else {
          body.classList.remove('dark-theme');
        }
        })
      );
      
      // Auth state changes
      eventBusSubscriptions.push(
        props.eventBus.on('auth-state-changed', (data: any) => {
          console.log('Angular MFE: Auth state changed', data);
        })
      );
      
      // Cross-MFE data sharing
      eventBusSubscriptions.push(
        props.eventBus.on('user-action', (data: any) => {
          console.log('Angular MFE: User action received', data);
        })
      );
      
      eventBusSubscriptions.push(
        props.eventBus.on('product-view', (data: any) => {
          console.log('Angular MFE: Product view event', data);
          // Update analytics data
        })
      );
    }
  }
  
  // Call original bootstrap
  if (lifecycles.bootstrap) {
    const bootstrapFn = Array.isArray(lifecycles.bootstrap) ? lifecycles.bootstrap[0] : lifecycles.bootstrap;
    await bootstrapFn(props);
  }
  
  console.log('✅ Angular MFE: Custom bootstrap complete');
};

const customMount = async (props: any) => {
  console.log('🔗 Angular MFE: Mounting Dashboard...');
  
  // Resolve DOM element (handle both function and direct element)
  let domElement = props.domElement;
  if (typeof domElement === 'function') {
    domElement = domElement();
  } else if (!domElement) {
    domElement = document.getElementById('single-spa-application:angular-mfe');
  }
  
  console.log('Angular MFE - DOM element:', domElement);
  
  if (domElement && domElement.setAttribute) {
    domElement.setAttribute('data-mfe', 'angular-dashboard');
    domElement.className = 'angular-mfe-container';
  } else {
    console.warn('Angular MFE - DOM element not found or invalid:', domElement);
  }
  
  // Mount the application
  if (lifecycles.mount) {
    const mountFn = Array.isArray(lifecycles.mount) ? lifecycles.mount[0] : lifecycles.mount;
    await mountFn({ ...props, domElement });
  }
  
  // Emit ready event
  if (props.eventBus) {
    props.eventBus.emit('mfe-mounted', {
      name: 'angular-mfe',
      type: 'dashboard-analytics',
      timestamp: new Date().toISOString(),
      features: ['analytics-dashboard', 'user-metrics', 'product-insights', 'real-time-data'],
    });
  }
  
  console.log('✅ Angular MFE: Mount complete');
};

const customUnmount = async (props: any) => {
  console.log('🔌 Angular MFE: Unmounting Dashboard...');
  
  // Cleanup event listeners
  if (props.eventBus) {
    while (eventBusSubscriptions.length) {
      const unsubscribe = eventBusSubscriptions.pop();
      try {
        unsubscribe?.();
      } catch (error) {
        console.warn('Angular MFE: Failed to remove event subscription', error);
      }
    }

    // Emit unmount event
    props.eventBus.emit('mfe-unmounted', {
      name: 'angular-mfe',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Cleanup global props
  delete (window as any).singleSpaProps;
  
  // Cleanup theme classes
  document.body.classList.remove('dark-theme');
  
  // Unmount the application
  if (lifecycles.unmount) {
    const unmountFn = Array.isArray(lifecycles.unmount) ? lifecycles.unmount[0] : lifecycles.unmount;
    await unmountFn(props);
  }
  
  console.log('✅ Angular MFE: Unmount complete');
};

// Export Single-SPA lifecycles
export const bootstrap = customBootstrap;
export const mount = customMount;
export const unmount = customUnmount;

// For standalone development
if (!(window as any).singleSpaNavigate) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error('Angular standalone bootstrap error:', err));
}