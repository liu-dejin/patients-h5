import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores'
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  //  基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器 携带token =>发请求之前
instance.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // 响应成功但 code不是10000 业务逻辑失败
    if (res.data?.code !== 10000) {
      showToast(res.data?.message)
      return Promise.reject(res.data)
    }
    // 业务逻辑成功 返回数据 作为axios成功的结果
    return res.data
  },
  (err) => {
    // 处理401错误
    if (err.response.status === 401) {
      // 删除用户信息
      const store = useUserStore()
      // router.currentRoute.value.fullPath 当前页面完整地址(带参数)
      store.removeUser()
      // 重新登录后跳转回上次访问的页面  增加用户体验
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
  }
)

export default instance
