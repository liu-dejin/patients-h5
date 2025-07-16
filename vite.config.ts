import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 按需导入vant 自动注册导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
// 1.导入导包精灵图插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 2.导入路径包
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // vant按需导入 插件
    AutoImport({
      resolvers: [VantResolver()]
    }),
    // vant组件自动注册       components中的组件也会自动注册
    Components({
      resolvers: [VantResolver()],
      // dts: './auto-imports.d.ts'
      dts: false
    }),
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
