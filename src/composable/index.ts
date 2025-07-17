import { FollowOrUnfollow } from '@/services/consult'
import type { FollowType } from '@/types/cousult'
import { ref } from 'vue'

// vue3组合式api封装数据逻辑在一起的函数 组合式函数 useXxx
// composable函数
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await FollowOrUnfollow(item.id, type)
      //修改likeFlag 0 未关注 1 已关注
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}
