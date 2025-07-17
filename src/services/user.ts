import type {
  User,
  CodeType,
  UserInfo,
  PatientList,
  Patient
} from '@/types/user'
import request from '@/utils/request'

//密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request.post<User>('/login/password', { mobile, password })

// 获取手机验证码
export const getSmsCode = (mobile: string, type: CodeType) =>
  request.get<{ code: string }>('/code', { params: { mobile, type } })
// 短信登录接口
export const loginBySms = (mobile: string, code: string) =>
  request.post<User>('/login', { mobile, code })

// 获取用户信息
export const getUserInfo = () => request.get<UserInfo>('/patient/myUser')
// 获取患者列表
export const getPatientList = () => request.get<PatientList>('/patient/mylist')
// 添加患者信息
export const addPatient = (patient: Patient) =>
  request.post('/patient/add', patient)
