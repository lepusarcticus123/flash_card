// 导入resolve模块
import { resolve } from 'path'
// 导入defineConfig和externalizeDepsPlugin模块
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// 导入vue模块
import vue from '@vitejs/plugin-vue'

// 导出默认配置
export default defineConfig({
  // 主进程配置
  main: {
    // 使用externalizeDepsPlugin插件
    plugins: [externalizeDepsPlugin()]
  },
  // 预加载配置
  preload: {
    // 使用externalizeDepsPlugin插件
    plugins: [externalizeDepsPlugin()]
  },
  // 渲染进程配置
  renderer: {
    // 配置路径别名
    resolve: {
      alias: {
        // 将@renderer指向src/renderer/src目录
        '@renderer': resolve('src/renderer/src')
      }
    },
    // 使用vue插件
    plugins: [vue()]
  }
})
