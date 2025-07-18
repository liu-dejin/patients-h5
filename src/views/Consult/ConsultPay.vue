<script setup lang="ts">
import {
  createConsultOrder,
  getConsultOrderPayUrl,
  getConsultOrderPre
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/cousult'
import type { Patient } from '@/types/user'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

//获取预支付信息
const payInfo = ref<ConsultOrderPreData>()
const store = useConsultStore()
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  //记录优惠券id
  store.setCoupon(res.data.couponId)
}
//获取患者详情
const patient = ref<Patient>()
const loadPatient = async () => {
  // 类型守卫
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}
//keyof 被用来提取 PartialConsult 类型的所有键 组合成联合类型
type Key = keyof PartialConsult
onMounted(() => {
  // 生成订单需要的信息不完整时候需要提示
  const vaildKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const value = vaildKeys.every((key) => store.consult[key] !== undefined)
  if (!value) {
    return showConfirmDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写,如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  loadData()
  loadPatient()
})

// 同意
const agree = ref(false)
// 生成订单
const show = ref(false)
const loading = ref(false)
const orderId = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请阅读并同意用户协议')
  loading.value = true
  //   发送生成订单的请求
  const res = await createConsultOrder(store.consult)
  loading.value = false
  //清理
  store.clear()
  //记录订单id
  orderId.value = res.data.id
  // 打开抽屉面板
  show.value = true
}
//支付方式
const paymentMethod = ref<0 | 1>()

// 提示1 取消支付将无法获得医生回复,医生接诊名额有限,是否确认关闭
// 提示2 问诊信息不完整请重新填写,如有未支付的问诊订单可在问诊记录中继续支付

// 用户引导
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
const router = useRouter()
const onClose = () => {
  return showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复,医生接诊名额有限,是否确认关闭',
    cancelButtonText: '狠心离开',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      //阻止关闭
      return false
    })
    .catch(() => {
      //阻止不生效
      orderId.value = ''
      router.push('/user/consult')
      // 正常关闭
      return true
    })
}
// 支付
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({
    message: '跳转支付',
    duration: 0
  })
  const res = await getConsultOrderPayUrl({
    orderId: orderId.value,
    paymentMethod: paymentMethod.value,
    payCallback: 'http://localhost:5173/room/'
  })
  window.location.href = res.data.payUrl
}
</script>

<template>
  <div v-if="payInfo && patient" class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
      @click="submit"
    />
    <!-- 支付抽屉控制面板 -->

    <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="onClose"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
  <div v-else class="consult-pay-page">
    <cp-nav-bar title="支付"></cp-nav-bar>
    <!-- 骨架组件 -->
    <van-skeleton title :row="10" style="margin-top: 19px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
