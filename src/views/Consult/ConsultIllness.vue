<script setup lang="ts">
import { IllnessTime } from '@/enums'
import { uploadImage } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { Consultillness, Image } from '@/types/cousult'
import type { UploaderAfterRead } from 'vant'
import type { UploaderFileListItem } from 'vant/es'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// 选项数据
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '半年以上', value: IllnessTime.More }
]
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '未就诊过', value: 0 }
]
//病情描述对象
const form = ref<Consultillness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})

//上传图片
const fileList = ref<Image[]>([])
// 上传图片逻辑
const onAfterRead: UploaderAfterRead = (item) => {
  //类型守卫
  if (Array.isArray(item)) return
  if (!item.file) return
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      item.url = res.data.url //唯一标识    便于后续删除
      //   同步数据
      form.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
//删除图片逻辑
const onDeleteImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter(
    (pic) => pic.url !== item.url
  )
}
// 按钮是否禁用逻辑
const disabled = computed(
  () =>
    // 满足三者任意一个条件时，禁用提交按钮(disable===true) 全部满足才可以提交
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
)
const store = useConsultStore()
const router = useRouter()
const next = () => {
  if (!form.value.illnessDesc) return showToast('请填写疾病描述')
  if (form.value.illnessTime === undefined)
    return showToast('请选择疾病持续时间')
  if (form.value.consultFlag === undefined) return showToast('请选择是否就诊过')
  // 记录病情
  store.setIllness(form.value)
  // 跳转 携带标识
  router.push('/user/patient?isChange=1')
}
//数据回显
onMounted(() => {
  // 有记录弹提示
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复之前填写的病情信息呢?',
      // 回退关闭 不关闭回退时也有弹窗
      closeOnPopstate: false
    }).then(() => {
      //回显数据
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <!-- 收集信息 -->
    <div class="illness-form">
      <van-field
        v-model="form.illnessDesc"
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn
          v-model="form.illnessTime"
          :options="timeOptions"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn
          v-model="form.consultFlag"
          :options="flagOptions"
        ></cp-radio-btn>
      </div>
      <!-- 上传组件 -->
      <div class="illness-img">
        <van-uploader
          v-model="fileList"
          upload-icon="photo-o"
          upload-text="上传图片"
          :max-size="1024 * 1024 * 5"
          max-count="9"
          :after-read="onAfterRead"
          @delete="onDeleteImg"
        ></van-uploader>
        <p v-if="!fileList.length">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
    </div>
    <!-- 下一步 -->
    <van-button :class="{ disabled }" type="primary" block round @click="next"
      >下一步</van-button
    >
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
  .van-button {
    font-size: 16px;
    margin-bottom: 30px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
