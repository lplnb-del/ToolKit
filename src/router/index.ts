import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: () => import('@/views/FavoritesView.vue'),
        },
        {
          path: 'recent',
          name: 'recent',
          component: () => import('@/views/RecentView.vue'),
        },
        {
          path: 'category/:category',
          name: 'category',
          component: () => import('@/views/CategoryView.vue'),
        },
        {
          path: 'all-tools',
          name: 'all-tools',
          component: () => import('@/views/AllToolsView.vue'),
        },
        {
          path: 'tool/:category/:id',
          name: 'tool',
          component: () => import('@/views/ToolView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
