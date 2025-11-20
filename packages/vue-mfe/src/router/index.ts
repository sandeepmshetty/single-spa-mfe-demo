import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: { template: '<div>Vue MFE Running</div>' },
  },
];

export function createRouterInstance(base: string = '/') {
  return createRouter({
    history: createWebHistory(base),
    routes,
  });
}

export default createRouterInstance();
