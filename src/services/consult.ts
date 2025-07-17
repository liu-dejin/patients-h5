import type { KnowledgePage, KnowledgeParams } from '@/types/cousult'
import request from '@/utils/request'
//百科文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<KnowledgePage>('/patient/home/knowledge', {
    params
  })
