<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/cousult'
import { getKnowledgePage } from '@/services/consult'

const props = defineProps<{
  type: KnowledgeType
}>()

// 加载中状态
const loading = ref(false)
// 看数据是否完全加载
const finished = ref(false)
// 数据列表
const list = ref<KnowledgeList>([])
// 查询参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
// 滚动到底部   加载后台数据
const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  //判断数据是否加载完毕
  if (params.value.current >= res.data.pageTotal) {
    //如果数据加载完毕 finished = true
    finished.value = true
  } else {
    // 没加载完就加载下一页
    params.value.current++
  }
  // 不管加没加数据，关闭loading
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
