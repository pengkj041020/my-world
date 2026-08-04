import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 重要：因为你的仓库名是 my-world，访问地址是 /my-world/
  // 所以 base 必须设置为 '/my-world/'
  base: '/my-world/',
})
