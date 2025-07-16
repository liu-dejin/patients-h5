import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue')
        }
      ]
    },

    {
      path: '/test',
      name: 'test',
      component: () => import('@/test/index.vue')
    }
  ]
})

// 全局前置导航守卫
router.beforeEach((to) => {
  // 获取token
  const store = useUserStore()
  // 白名单
  const whiteList = ['/login']
  // 如果你没有token并且不在白名单中，就跳转到登录页面
  // user可能 为空对象  故用? 防止error
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})
export default router
