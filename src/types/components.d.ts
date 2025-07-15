/**
 * 为项目全局组件声明类型
 */
import cpNavBar from '@/components/cp-nav-bar.vue'
declare module 'vue' {
  interface GlobalComponents {
    cpNavBar: typeof cpNavBar
  }
}
