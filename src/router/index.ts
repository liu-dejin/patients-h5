import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 导入nProgress
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

nProgress.configure({
  // 没有转圈加载
  showSpinner: false
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: {
        title: '家庭档案'
      }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: {
        title: '极速问诊'
      }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: {
        title: '选择科室'
      }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/Consultillness.vue'),
      meta: {
        title: '病情描述'
      }
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '个人中心'
          }
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
  // 开启进度条
  nProgress.start()
  // 获取token
  const store = useUserStore()
  // 白名单
  const whiteList = ['/login']
  // 如果你没有token并且不在白名单中，就跳转到登录页面
  // user可能 为空对象  故用? 防止error
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})
// 全局后置导航守卫
router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优医问诊`
  // 关闭进度条
  nProgress.done()
})
export default router
