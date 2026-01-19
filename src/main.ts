import { createSSRApp } from "vue";
import App from "./App.vue";
import UniIcons from './components/uni-icons/uni-icons.vue';
import SkeletonScreen from './components/SkeletonScreen.vue';
import PageSkeleton from './components/PageSkeleton.vue';
import GlobalSkeleton from './components/GlobalSkeleton.vue';
import { setupSkeletonInterceptor } from './utils/skeletonManager';

export function createApp() {
  const app = createSSRApp(App);

  // 全局注册组件
  app.component('uni-icons', UniIcons);
  app.component('skeleton-screen', SkeletonScreen);
  app.component('page-skeleton', PageSkeleton);
  app.component('global-skeleton', GlobalSkeleton);

  // 设置骨架屏路由拦截器
  setupSkeletonInterceptor();

  return {
    app,
  };
}
