import type {
  ConsultOrderPreData,
  ConsultOrderPreParams,
  DoctorPage,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  TopDep
} from '@/types/cousult'
import request from '@/utils/request'
//百科文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<KnowledgePage>('/patient/home/knowledge', {
    params
  })
//关注的医生列表
export const getDoctorPage = (params: PageParams) =>
  request.get<DoctorPage>('/home/page/doc', { params })
// 关注/取消关注
export const FollowOrUnfollow = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })
//获取科室
export const getAllDep = () => request.get<TopDep[]>('/dep/all')
// 上传图片的接口
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request.post<Image>('/upload', fd)
}
//预支付信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request.get<ConsultOrderPreData>('/patient/consult/order/pre', {
    params
  })
}
