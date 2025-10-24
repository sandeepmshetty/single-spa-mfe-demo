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
  domElementGetter: () => {
    // Try to get from props first, then fallback to ID
    const element = document.getElementById('single-spa-application:vue-mfe');
    console.log('Vue MFE - DOM element:', element);
    if (!element) {
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
