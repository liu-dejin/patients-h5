/**
 * 用户相关ts类型
 */
export type User = {
  token: string
  avatar: string
  mobile: string
  account: string
  id: string
  code: string
}
export type CodeType = 'login' | 'register'
