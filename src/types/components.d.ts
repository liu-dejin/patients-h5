/**
 * 为项目全局组件声明类型
 */
import cpNavBar from '@/components/cp-nav-bar.vue'
import cpIcon from '@/components/cp-icon.vue'
import CpRadioBtn from '@/components/cp-radio-btn.vue'
declare module 'vue' {
  interface GlobalComponents {
    cpNavBar: typeof cpNavBar
    cpIcon: typeof cpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}
