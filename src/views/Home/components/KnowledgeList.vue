<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
// 加载中状态
const loading = ref(false)
// 看数据是否完全加载
const finished = ref(false)
// 数据列表
const list = ref<number[]>([])
// 滚动到底部   加载后台数据
const onLoad = () => {
  //   模拟加载数据
  const data = [1, 2, 3, 4, 5]
  setTimeout(() => {
    list.value.push(...data)
    if (list.value.length >= 20) {
      finished.value = true
    }
    loading.value = false
  }, 2000)
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
      <knowledge-card v-for="(index, i) in list" :key="i"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
