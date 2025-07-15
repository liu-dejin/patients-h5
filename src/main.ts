import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'
// 导入全局样式
import '@/styles/index.scss'

// toast需要单独引入
import { Toast } from 'vant'
const app = createApp(App)

app.use(Toast)
app.use(router)
app.use(pinia)

app.mount('#app')
