<script setup lang="ts">
import { useRouter } from 'vue-router'

// 封装需求：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
//router === 等于vue2的this.$router
const router = useRouter()

// 获取父组件传递的属性
const props = defineProps<{
  title?: string
  right?: string
  back?: () => void
}>()
//子传父 点击注册 index做注册逻辑处理
const emit = defineEmits<{
  'click-right': []
}>()

const onClickLeft = () => {
  if (props.back) return props.back()
  //左侧点击事件=>访问上次的页面
  /**
   * 返回上次访问的页面  可能是不存在
   * 使用router.replace 跳转会覆盖 不能返回
   */
  // 返回的是上一个路由的地址（URL），即用户点击浏览器“返回”按钮时会跳转到的页面
  if (history.state?.back) {
    // 1.存在回跳地址就返回
    router.back()
  } else {
    // 2.不存在就返回首页
    router.push('/')
  }
}
</script>

<template>
  <!-- 内核是vant-nav-bar -->
  <van-nav-bar
    left-arrow
    fixed
    :title="title"
    :right-text="right"
    @click-left="onClickLeft"
    @click-right="emit('click-right')"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
/**::v-deep()样式穿透
样式穿透：::v-deep()  ::v-slotted()  ::v-global()
v2 /deep/
v3 ::v-deep(){}
样式穿透作用：解决样式冲突问题
样式穿透原理：将样式应用到子组件的子元素
什么时候需要?
 */
// //  1.元素身上有data-v 直接拿类名设置
// .van-nav-bar {
//   box-sizing: border-box;
//   border: 2px solid red;
// }
// // 2.没有data-v 需要使用样式穿透
// ::v-deep() {
//   .van-nav-bar__content {
//     background-color: blue;
//   }
// }

::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
