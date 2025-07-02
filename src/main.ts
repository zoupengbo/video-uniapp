import { createSSRApp } from "vue";
import App from "./App.vue";
import UniIcons from './components/uni-icons/uni-icons.vue';

export function createApp() {
  const app = createSSRApp(App);
  
  // 全局注册 uni-icons 组件
  app.component('uni-icons', UniIcons);
  
  return {
    app,
  };
}
