import type {
  DoctorPage,
  KnowledgePage,
  KnowledgeParams,
  PageParams
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
