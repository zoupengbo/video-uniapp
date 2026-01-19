<template>
  <div class="home">
    <div class="title">首页</div>
    
    <!-- 骨架屏 -->
    <div v-if="isLoading" class="content">
      <div class="video-items" v-for="i in 2" :key="'skeleton-' + i">
        <skeleton-screen :elements="homeVideoSkeletonElements" />
      </div>
    </div>
    
    <!-- 实际内容 -->
    <div v-else class="content" v-for="item in videoItems">
      <videoItems :videoData="item" class="video-items"></videoItems>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import VideoItems from "./VideoItems.vue";
import SkeletonScreen from "../../components/SkeletonScreen.vue";

// 加载状态
const isLoading = ref(true);

// 首页视频骨架屏元素配置
const homeVideoSkeletonElements = reactive([
  // 用户信息骨架
  {
    height: '16px',
    width: '100px',
    marginTop: '1.6vw',
    marginBottom: '1.6vw'
  },
  // 视频播放器骨架
  {
    height: '0',
    paddingTop: '56.25%', // 16:9比例
    radius: '8px'
  },
  // 标题骨架
  {
    height: '16px',
    width: '80%',
    marginTop: '1.6vw'
  },
  // 视频信息骨架
  {
    height: '13px',
    width: '100%',
    marginTop: '1.6vw'
  }
]);

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

// 模拟数据加载
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
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
