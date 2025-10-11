import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: { template: '<div>Vue MFE Running</div>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
