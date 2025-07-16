<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>

<template>
  <svg aria-hidden="true" class="icon">
    <!-- #icon-文件夹名称-图片名称 -->
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style lang="scss" scoped>
.icon {
  // 相对父级的元素字体大小
  width: 1em;
  height: 1em;
}
</style>
