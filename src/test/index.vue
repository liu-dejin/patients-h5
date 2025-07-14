<script lang="ts" setup>
import { useUserStore } from '@/stores'
const store = useUserStore()
const setUser = () => {
  store.setUser({
    token: '123',
    avatar: '123',
    mobile: '123',
    account: '123',
    id: '123'
  })
}
</script>

<template>
  <div>{{ store.user }}</div>
  <button @click="setUser">设置用户</button>
</template>

<style lang="less" scoped></style>
