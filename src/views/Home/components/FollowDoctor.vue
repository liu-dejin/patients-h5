<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import DoctorCard from './DoctorCard.vue'
// import { useWindowSize } from '@vueuse/core'
// const { width } = useWindowSize()
// 组件初始化拿到设备宽度,页面尺寸改变时,组件会重新计算宽度
const width = ref(0)
const setWidth = () => (width.value = window.innerWidth)
onMounted(() => {
  setWidth()
  window.addEventListener('resize', setWidth)
})
onUnmounted(() => {
  window.removeEventListener('resize', setWidth)
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 宽度和卡片一样大  不显示指示器 不循环 -->
      <van-swipe
        :width="(150 / 375) * width"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="i in 5" :key="i">
          <doctor-card></doctor-card>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
