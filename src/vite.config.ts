import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    port: 8888, // 自定义端口号
    open: true, // 自动打开浏览器
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://127.0.0.1:3000', // 后端服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去除 /api 前缀
        secure: false, // 接受无效证书的 HTTPS
      }
    }
  },
}); 