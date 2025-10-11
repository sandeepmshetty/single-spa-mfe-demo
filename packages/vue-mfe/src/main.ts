import { createApp, h } from 'vue';
import singleSpaVue from 'single-spa-vue';
import App from './App.vue';
import router from './router/index';

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
  }
});

export const { bootstrap, mount, unmount } = vueLifecycles;