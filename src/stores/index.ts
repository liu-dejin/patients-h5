import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

//在index.ts 对store仓库统一导出
export * from './modules/consult'
export * from './modules/user'
