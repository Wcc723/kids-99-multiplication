import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useGameSessionStore } from '@/stores/gameSession'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('@/views/PlayView.vue'),
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('@/views/ResultView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const session = useGameSessionStore()
  if (to.name === 'play' && session.status !== 'playing') {
    return { name: 'home' }
  }
  if (to.name === 'result' && session.status !== 'finished') {
    return { name: 'home' }
  }
  return true
})

export default router
