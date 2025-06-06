<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  // 设计稿宽度 750px，屏幕宽度 375px（iPhone 6/7/8）
// document.documentElement.style.fontSize = (window.innerWidth / 7.5) + 'px';
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* 引入图标字体 */
@import './static/styles/iconfont.css';

/* 全局样式 */
page {
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  color: #fff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 隐藏默认导航栏 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}

/* 通用样式 */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 主题颜色 */
.text-primary {
  color: #ff9966;
}

.bg-primary {
  background-color: #ff9966;
}

.border-primary {
  border-color: #ff9966;
}
</style>
