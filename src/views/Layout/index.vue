<script lang="ts" setup></script>

<template>
  <div class="layout-page">
    <!-- 二级路由出口 -->
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/home"
        >首页
        <template #icon="{ active }">
          <!-- 前面封装的雪碧打包 -->
          <cp-icon
            :name="`home-index-${active ? 'active' : 'default'}`"
          ></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article"
        >健康百科
        <template #icon="{ active }">
          <!-- 前面封装的雪碧打包 -->
          <cp-icon
            :name="`home-article-${active ? 'active' : 'default'}`"
          ></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify"
        >消息通知
        <template #icon="{ active }">
          <!-- 前面封装的雪碧打包 -->
          <cp-icon
            :name="`home-notice-${active ? 'active' : 'default'}`"
          ></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user"
        >我的
        <template #icon="{ active }">
          <!-- 前面封装的雪碧打包 -->
          <cp-icon
            :name="`home-mine-${active ? 'active' : 'default'}`"
          ></cp-icon>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  :deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }
      &__text {
        font-size: 11px;
      }
      &:not(.van-tabbar-item--active) {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
