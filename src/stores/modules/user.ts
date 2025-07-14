import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 用户store
 */
export const useUserStore = defineStore('cp-ser', () => {
  // 全局变量1:登录用户
  // 空对象变量通过as断言指定类型
  const user = ref<User>({} as User)
  // 方法:
  // 1.存储用户信息
  const setUser = (userInfo: User) => {
    user.value = userInfo
  }
  // 2.删除用户信息
  const removeUser = () => {
    user.value = {} as User
  }

  return { user, setUser, removeUser }
})
