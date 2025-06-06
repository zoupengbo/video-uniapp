<template>
  <div class="home">
    <div class="title">首页</div>
    <div class="content" v-for="item in videoItems">
      <videoItems :videoData="item" class="video-items"></videoItems>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import VideoItems from "./VideoItems.vue";
const videoItems = reactive([
  {
    user: "小蓝",
    videoPointer: "https://httpbin.org/image/jpeg", // 封面
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Google测试视频
    title: "城市夜景集锦",
    tag: "旅行日记",
    views: 5876,
  },
  {
    user: "小绿",
    videoPointer: "https://picsum.photos/640/360", // 随机封面
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // 真实可播放
    title: "动画短片精选",
    tag: "创意动画",
    views: 11209,
}]);


</script>

<style scoped>
.home {
  margin: 0 4vw;
  padding-top: 15px;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  min-height: 100vh;
  color: #fff;
}
.title {
  font-size: 28px;
  font-weight: 700;
  color: #ff9966;
  margin-bottom: 15px;
}
.video-items {
  margin-top: 0.4rem;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}
.content {
  padding-bottom: 30px;
  display: grid;
  grid-gap: 15px;
}
</style>
