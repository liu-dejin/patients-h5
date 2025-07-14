<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
// 导入封装request
import request from '@/utils/request'
import { onMounted } from 'vue'
import { showToast } from 'vant'
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

// 获取当前页面地址
const route = useRoute()
console.log('当前路由对象', route)

// 401test
// const getUser = async () => {
//   const res = await request.get('/patient/myUser')
//   console.log(res)
// }
onMounted(() => {
  // getUser()
  login()
})
const login = async () => {
  const res = await request.post('/login/password', {
    mobile: '13211112222',
    // 密码 abc123456 测试：出现非10000的情况
    password: 'abc12345'
  })
  showToast(res.statusText)
  console.log('登录成功', res)
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
