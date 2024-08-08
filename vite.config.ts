import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {ElectronDevPlugin} from "./plugins/vite.electron.dev";
import {ElectronBuildPlugin} from "./plugins/vite.electron.build";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
      ElectronDevPlugin(),  // 注册插件
      ElectronBuildPlugin()
  ],
  base: "./",  // 默认是绝对路径，修改为相对路径，否则会白屏
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
