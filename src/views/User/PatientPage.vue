<script setup lang="ts">
import {
  addPatient,
  delPatient,
  editPatient,
  getPatientList
} from '@/services/user'
import type { Patient, PatientList } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { idCardRules, nameRules } from '@/utils/rules'
import type { FormInstance } from 'vant'
//组件挂载完毕,获取数据
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
  // console.log(list.value)
}
onMounted(() => {
  loadList()
})
//选项数据
const options = [
  { label: '男', value: 0 },
  {
    label: '女',
    value: 1
  }
]
const show = ref(false)
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 表单数据
const patient = ref<Patient>({
  ...initPatient
})
const showPopup = (item?: Patient) => {
  if (item) {
    //回填表单
    const { id, name, idCard, gender, defaultFlag } = item
    patient.value = { id, name, idCard, gender, defaultFlag }
  } else {
    //清空校验报错
    form.value?.resetValidation()
    // 重置表单
    patient.value = { ...initPatient }
  }
  show.value = true
}

// 支持复选框 1/0=>true/false
const defaultFlag = computed({
  get: () => (patient.value.defaultFlag === 1 ? true : false),
  set: (value) => (patient.value.defaultFlag = value ? 1 : 0)
})
// 提交
const form = ref<FormInstance>()
const onSubmit = async () => {
  // 表单整体校验 validate进行校验
  await form.value?.validate()
  //性别校验
  //取出身份证倒数第二位, %2之后  1男 0女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '性别与身份证不匹配\n你确认提交吗'
    })
  }
  // 提交后台 添加/编辑
  // console.log(patient.value)

  if (patient.value.id) {
    await editPatient(patient.value)
  } else {
    await addPatient(patient.value)
  }
  // 成功:关闭添加患者界面,加载患者列表,成功提示
  show.value = false
  loadList()
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
}
// 删除患者
const remove = async () => {
  if (patient.value.id) {
    //确认框,删除请求,关闭,加载,提示
    await showConfirmDialog({
      title: '温馨提示',
      message: `确定要删除${patient.value.name}患者吗?`
    })
    await delPatient(patient.value.id)
    show.value = false
    loadList()
    showSuccessToast('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="'家庭档案'"></cp-nav-bar>
    <div class="patient-list">
      <div v-for="item in list" :key="item.id" class="patient-item">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6}).+(.{4})$/, '$1********$2')
          }}</span>
          <span>{{ item.gender }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)">
          <cp-icon name="user-edit" />
        </div>
        <div v-if="item.defaultFlag === 1" class="tag">默认</div>
      </div>

      <div v-if="list.length < 6" class="patient-add" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
      <!-- popup组件 -->
      <van-popup v-model:show="show" position="right">
        <cp-nav-bar
          :back="() => (show = false)"
          :title="patient.id ? '编辑患者' : '添加患者'"
          right-text="保存"
          @click-right="onSubmit"
        ></cp-nav-bar>
        <van-form ref="form" autocomplete="off">
          <van-field
            v-model="patient.name"
            label="真实姓名"
            placeholder="请输入真实姓名"
            :rules="nameRules"
          />
          <van-field
            v-model="patient.idCard"
            :rules="idCardRules"
            label="身份证号"
            placeholder="请输入身份证号"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <cp-radio-btn
                v-model="patient.gender"
                :options="options"
              ></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox v-model="defaultFlag" :icon-size="18" round />
            </template>
          </van-field>
        </van-form>
        <!-- 删除按钮 -->
        <van-action-bar v-if="patient.id">
          <van-action-bar-button text="删除" @click="remove" />
        </van-action-bar>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}

.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
</style>
