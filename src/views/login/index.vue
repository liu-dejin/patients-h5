<script lang="ts" setup>
// ================== 📦 导入依赖 ==================
import { ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'vant'
import { showToast, showFailToast, showSuccessToast } from 'vant'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { getSmsCode, loginByPassword, loginBySms } from '@/services/user'
import { useUserStore } from '@/stores'

// ================== 📄 基础状态变量 ==================
const isPass = ref(true) // 是否为密码登录
const agree = ref(false) // 用户协议勾选
const isShowPass = ref(false) // 密码是否明文
const mobile = ref('') // 手机号
const password = ref('') // 密码
const code = ref('') // 验证码

// ================== 📍 初始化模块（路由/用户Store） ==================
const router = useRouter()
const route = useRoute()
const store = useUserStore()

// ================== ⏱ 验证码倒计时逻辑 ==================
const time = ref(0) // 倒计时数字
let timer: number // 定时器对象
const form = ref<FormInstance>() // 表单ref用于校验

const send = async () => {
  if (time.value > 0) return // 防止重复点击
  try {
    await form.value?.validate('mobile') // 校验手机号
    const { data } = await getSmsCode(mobile.value, 'login')
    code.value = data.code
    showToast('验证码发送成功')
    time.value = 60
    timer = setInterval(() => {
      time.value--
      if (time.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    console.error('验证码发送失败:', error)
    showFailToast('验证码发送失败')
  }
}

onUnmounted(() => {
  clearInterval(timer)
})

// ================== 🔐 登录逻辑（密码或验证码） ==================
const login = async () => {
  if (!agree.value) return showFailToast('请勾选用户协议')

  try {
    const res = await (isPass.value
      ? loginByPassword(mobile.value, password.value)
      : loginBySms(mobile.value, code.value))
    store.setUser(res.data)
    showSuccessToast('登录成功')

    const returnUrl = route.query.returnUrl as string
    router.push(returnUrl || '/user')
  } catch (error) {
    console.error('登录失败:', error)
    showFailToast('登录失败')
  }
}

// ================== 📝 其他操作 ==================
const clickRight = () => {
  console.log('点击了注册')
}
</script>

<template>
  <div>
    <!-- 顶部导航 -->
    <cp-nav-bar title="登录" right="注册" @click-right="clickRight" />

    <!-- 登录切换区域 -->
    <div class="login">
      <div class="login-head">
        <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
        <a href="javascript:;">
          <span @click="isPass = !isPass">
            {{ !isPass ? '密码登录' : '短信验证码登录' }}
          </span>
          <van-icon name="arrow" />
        </a>
      </div>
    </div>

    <!-- 登录表单 -->
    <van-form ref="form" @submit="login">
      <van-cell-group inset>
        <!-- 手机号 -->
        <van-field
          v-model="mobile"
          name="mobile"
          placeholder="手机号"
          :rules="mobileRules"
        />

        <!-- 密码登录 -->
        <van-field
          v-if="isPass"
          v-model="password"
          :type="isShowPass ? 'text' : 'password'"
          name="password"
          placeholder="密码"
          :rules="passwordRules"
        >
          <template #button>
            <cp-icon
              :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
              @click="isShowPass = !isShowPass"
            />
          </template>
        </van-field>

        <!-- 验证码登录 -->
        <van-field
          v-else
          v-model="code"
          name="code"
          placeholder="短信验证码"
          :rules="codeRules"
        >
          <template #button>
            <span :class="{ active: time > 0 }" @click="send">
              {{ time > 0 ? `${time}后重新发送` : '获取验证码' }}
            </span>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 协议勾选 -->
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>

      <!-- 登录按钮 -->
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>

      <!-- 忘记密码 -->
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.active {
  color: red;
}
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
}
</style>
