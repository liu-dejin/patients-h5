import type {
  ConsultOrderPreData,
  ConsultOrderPreParams,
  DoctorPage,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  PartialConsult,
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
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request.get<ConsultOrderPreData>('/patient/consult/order/pre', {
    params
  })
//问诊订单
export const createConsultOrder = (data: PartialConsult) =>
  request.post<{ id: string }>('/patient/consult/order', data)
//支付接口
export const getConsultOrderPayUrl = (params: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request.post<{ payUrl: string }>('/patient/consult/pay', params)
