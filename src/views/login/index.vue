<script lang="ts" setup>
const clickRight = () => {
  console.log('点击了注册')
}
</script>

<template>
  <div>
    <cp-nav-bar
      middle="登录"
      right="注册"
      @click-right="clickRight"
    ></cp-nav-bar>
  </div>
</template>

<style lang="scss" scoped></style>
