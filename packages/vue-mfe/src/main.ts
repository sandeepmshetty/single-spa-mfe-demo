import { createApp, h } from 'vue';
import singleSpaVue from 'single-spa-vue';
import App from './App.vue';
import router from './router/index';
import { performanceMonitor } from '@single-spa-demo/shared-library';

// Single-SPA Vue lifecycle
const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App),
    router,
  },
  handleInstance: (app: any) => {
    app.use(router);
  },
  // Use domElementGetter to get the container element
  domElementGetter: (props: any) => {
    // Try to get from props first
    if (props.domElement) {
      return props.domElement;
    }
    
    // Fallback to ID
    const element = document.getElementById('single-spa-application:vue-mfe');
    if (!element) {
      // In standalone mode, we might use a different ID
      const standaloneElement = document.getElementById('app');
      if (standaloneElement) return standaloneElement;
      
      throw new Error('Vue MFE container element not found');
    }
    return element;
  },
});

export const bootstrap = async (props: any) => {
  performanceMonitor.init('vue-mfe');
  if (vueLifecycles.bootstrap) {
    return vueLifecycles.bootstrap(props);
  }
  return Promise.resolve();
};

export const mount = vueLifecycles.mount;

export const unmount = async (props: any) => {
  performanceMonitor.cleanup();
  if (vueLifecycles.unmount) {
    return vueLifecycles.unmount(props);
  }
  return Promise.resolve();
};
