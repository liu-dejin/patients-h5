<!-- <script lang="ts" setup>
//计数器
//通过v-model解析 modelValue @update:modelValue
defineProps<{
  modelValue: number
}>()
defineEmits<{
  'update:modelValue': [count: number]
}>()
</script>

<template>
  <div class="cp-radio-btn">
    计数器{{ modelValue }}
    <button @click="$emit('update:modelValue', modelValue + 1)">+1</button>
  </div>
</template>

<style lang="scss" scoped></style> -->
<!-- <script lang="ts" setup>
//计数器
//通过v-model:count解析 count @update:count
defineProps<{
  count: number
}>()
defineEmits<{
  'update:count': [count: number]
}>()
</script>

<template>
  <div class="cp-radio-btn">
    计数器{{ count }}
    <button @click="$emit('update:count', count + 1)">+1</button>
  </div>
</template>

<style lang="scss" scoped></style> -->
<script setup lang="ts">
defineProps<{
  options: {
    label: string
    value: number | string
  }[]
  modelValue?: number | string
}>()
defineEmits<{
  'update:modelValue': [value: number | string]
}>()
</script>

<template>
  <div class="cp-radio-btn">
    <a
      v-for="item in options"
      :key="item.value"
      class="item"
      :class="{ active: item.value === modelValue }"
      href="javascript:;"
      @click="$emit('update:modelValue', item.value)"
      >{{ item.label }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
