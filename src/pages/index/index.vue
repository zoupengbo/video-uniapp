<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input type="text" placeholder="搜索视频" placeholder-class="placeholder" v-model="searchText" @confirm="searchVideos" />
      </view>
    </view>
    
    <!-- 分类选项卡 -->
    <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
      <view 
        class="category-item" 
        :class="{ active: currentCategory === category.id }"
        v-for="category in categories" 
        :key="category.id"
        @tap="changeCategory(category.id)"
      >
        {{ category.name }}
      </view>
    </scroll-view>
    
    <!-- 视频列表 -->
    <scroll-view 
      scroll-y 
      class="video-list"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="loadMore"
    >
      <view class="video-grid">
        <view 
          class="video-card"
          v-for="video in videoList"
          :key="video.id"
          @tap="playVideo(video)"
        >
          <view class="video-cover">
            <image :src="video.coverUrl" mode="aspectFill"></image>
            <view class="video-duration">{{ formatDuration(video.duration) }}</view>
          </view>
          <view class="video-info">
            <text class="video-title">{{ video.title }}</text>
            <view class="video-stats">
              <text class="author">{{ video.author }}</text>
              <text class="views">{{ formatViews(video.views) }}播放</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMoreData">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
  <tabbar></tabbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 引入tabbar组件
import tabbar from '@/components/TabBar.vue'

// 搜索
const searchText = ref('');
const searchVideos = () => {
  if (searchText.value.trim()) {
    // 执行搜索逻辑
    loadVideosByCategory(currentCategory.value, searchText.value);
  }
};

// 分类数据
const categories = ref([
  { id: 'all', name: '推荐' },
  { id: 'movie', name: '电影' },
  { id: 'series', name: '剧集' },
  { id: 'anime', name: '动漫' },
  { id: 'variety', name: '综艺' },
  { id: 'documentary', name: '纪录片' },
]);
const currentCategory = ref('all');

// 切换分类
const changeCategory = (categoryId: string) => {
  currentCategory.value = categoryId;
  videoList.value = [];
  page.value = 1;
  noMoreData.value = false;
  loadVideosByCategory(categoryId);
};

// 视频列表数据
const videoList = ref<any[]>([]);
const loading = ref(false);
const refreshing = ref(false);
const noMoreData = ref(false);
const page = ref(1);
const pageSize = 10;

// 加载视频数据
const loadVideosByCategory = async (categoryId: string, keyword: string = '') => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    // 这里应该调用实际的API
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟数据
    const mockVideos = Array(pageSize).fill(0).map((_, index) => ({
      id: `${categoryId}-${page.value}-${index}`,
      title: `${categoryId === 'all' ? '推荐' : categoryId} 视频 ${page.value}-${index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      duration: Math.floor(Math.random() * 7200), // 0-2小时的秒数
      author: '视频作者',
      views: Math.floor(Math.random() * 10000000), // 随机播放量
    }));
    
    // 模拟没有更多数据的情况
    if (page.value >= 3) {
      noMoreData.value = true;
    }
    
    videoList.value = page.value === 1 
      ? mockVideos 
      : [...videoList.value, ...mockVideos];
    
  } catch (error) {
    console.error('加载视频失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true;
  page.value = 1;
  noMoreData.value = false;
  loadVideosByCategory(currentCategory.value);
};

// 上拉加载更多
const loadMore = () => {
  if (loading.value || noMoreData.value) return;
  page.value++;
  loadVideosByCategory(currentCategory.value);
};

// 播放视频
const playVideo = (video: any) => {
  uni.navigateTo({
    url: `/pages/video/detail?id=${video.id}`
  });
};

// 格式化时长
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 格式化播放量
const formatViews = (views: number) => {
  if (views >= 100000000) {
    return (views / 100000000).toFixed(1) + '亿';
  }
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + '万';
  }
  return views.toString();
};

// 初始化
onMounted(() => {
  loadVideosByCategory(currentCategory.value);
});
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  padding-bottom: 100rpx; /* 为tabbar预留空间 */
}

.search-bar {
  padding: 20rpx 30rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: rgba(26, 42, 58, 0.8);
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 40rpx;
    padding: 10rpx 20rpx;
    
    .iconfont {
      margin-right: 10rpx;
      color: rgba(255, 255, 255, 0.6);
    }
    
    input {
      flex: 1;
      height: 60rpx;
      color: #fff;
    }
    
    .placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.category-scroll {
  white-space: nowrap;
  padding: 20rpx 0;
  background-color: rgba(15, 25, 35, 0.8);
  position: sticky;
  top: 100rpx;
  z-index: 99;
  
  .category-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin: 0 10rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s;
    
    &.active {
      background-color: #ff9966;
      color: #fff;
    }
    
    &:first-child {
      margin-left: 30rpx;
    }
    
    &:last-child {
      margin-right: 30rpx;
    }
  }
}

.video-list {
  height: calc(100vh - 220rpx);
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.video-card {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  
  .video-cover {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.25%; /* 16:9比例 */
    
    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .video-duration {
      position: absolute;
      bottom: 10rpx;
      right: 10rpx;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 4rpx 10rpx;
      border-radius: 6rpx;
      font-size: 20rpx;
    }
  }
  
  .video-info {
    padding: 16rpx;
    
    .video-title {
      font-size: 28rpx;
      line-height: 1.4;
      margin-bottom: 8rpx;
      color: #fff;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .video-stats {
      display: flex;
      justify-content: space-between;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.6);
      
      .author {
        max-width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.loading-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24rpx;
}
</style>
