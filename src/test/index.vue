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
  <br />
  <br />
  <br />
  <br />
  <hr />
  <van-button type="primary">主要按钮</van-button>
  <van-button type="success">成功按钮</van-button>
  <van-button type="default">默认按钮</van-button>
  <van-button type="danger">危险按钮</van-button>
  <van-button type="warning">警告按钮</van-button>
</template>

<style lang="less" scoped></style>
