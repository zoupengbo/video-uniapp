<template>
  <view class="video-list-container">
    <!-- 页面头部 -->
    <view class="header">
      <view class="header-title">视频</view>
      <view class="search-box" @tap="navigateToSearch">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索视频</text>
      </view>
    </view>
    
    <!-- 分类选择器 -->
    <scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
      <view 
        class="category-item" 
        :class="{ active: currentCategory === category.id }" 
        v-for="category in videoCategories" 
        :key="category.id"
        @tap="changeCategory(category.id)"
      >
        {{ category.name }}
      </view>
    </scroll-view>
    
    <!-- 视频列表 -->
    <scroll-view 
      class="video-scroll" 
      scroll-y="true" 
      @scrolltolower="loadMoreVideos"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 页面骨架屏 -->
      <page-skeleton
        v-if="isInitialLoading"
        type="video-list"
        :visible="true"
        :count="6"
        :animation-type="'shimmer'"
      />

      <!-- 视频列表内容 -->
      <view v-else class="video-grid">
        <view 
          class="video-item" 
          v-for="video in videoList" 
          :key="video.id"
          @tap="playVideo(video)"
        >
          <view class="video-cover">
            <image :src="video.coverUrl" mode="aspectFill"></image>
            <view class="video-duration">{{ formatDuration(video.duration) }}</view>
            <view class="progress-bar" v-if="video.progress" :style="{ width: video.progress + '%' }"></view>
          </view>
          <view class="video-title">{{ video.title }}</view>
          <view class="video-stats">
            <text class="author">{{ video.author }}</text>
            <text class="dot">·</text>
            <text class="views">{{ formatViews(video.views) }}播放</text>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-state" v-if="isLoading && videoList.length > 0">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 无数据状态 -->
      <view class="empty-state" v-if="videoList.length === 0 && !isLoading">
        <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无视频</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { useListSkeleton, useGlobalSkeleton } from '../../composables/useSkeleton';

// 使用骨架屏Hook
const { isInitialLoading, isLoadingMore, loadInitial, loadMore, refresh } = useListSkeleton({ initialCount: 6 });
const { hideGlobal } = useGlobalSkeleton();

// 分类数据
const videoCategories = ref([
  { id: 'all', name: '推荐' },
  { id: 'movie', name: '电影' },
  { id: 'series', name: '剧集' },
  { id: 'anime', name: '动漫' },
  { id: 'variety', name: '综艺' },
  { id: 'documentary', name: '纪录片' },
]);
const currentCategory = ref('all');

// 视频列表数据
const videoList = ref<any[]>([]);
const isLoading = ref(false);
const isRefreshing = ref(false);
const page = ref(1);
const pageSize = ref(12);
const hasMore = ref(true);

// 切换分类
const changeCategory = (categoryId: string) => {
  if (currentCategory.value === categoryId) return;
  
  currentCategory.value = categoryId;
  videoList.value = [];
  page.value = 1;
  hasMore.value = true;
  loadVideos();
};

// 加载视频列表
const loadVideos = async () => {
  if (isLoading.value || !hasMore.value) return;
  
  isLoading.value = true;
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟数据
    const newVideos = Array(pageSize.value).fill(0).map((_, index) => ({
      id: `${currentCategory.value}-${(page.value - 1) * pageSize.value + index + 1}`,
      title: `${currentCategory.value === 'all' ? '推荐' : currentCategory.value} 视频 ${(page.value - 1) * pageSize.value + index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      duration: Math.floor(Math.random() * 7200), // 0-2小时的秒数
      author: '视频作者',
      views: Math.floor(Math.random() * 10000000), // 随机播放量
      progress: Math.random() > 0.7 ? Math.floor(Math.random() * 80) : 0, // 30% 概率有播放进度
    }));
    
    videoList.value = [...videoList.value, ...newVideos];
    
    // 模拟是否有更多数据
    hasMore.value = page.value < 5; // 最多5页数据
    page.value++;
    
  } catch (error) {
    console.error('加载视频失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// 加载更多视频
const loadMoreVideos = () => {
  if (hasMore.value) {
    loadVideos();
  }
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  videoList.value = [];
  page.value = 1;
  hasMore.value = true;
  loadVideos();
};

// 播放视频
const playVideo = (video: any) => {
  uni.navigateTo({
    url: `/pages/video/detail?id=${video.id}`
  });
};

// 跳转到搜索页面
const navigateToSearch = () => {
  uni.navigateTo({
    url: '/pages/search/index'
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

// 格式化数字
const formatViews = (views: number) => {
  if (views >= 100000000) {
    return (views / 100000000).toFixed(1) + '亿';
  }
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + '万';
  }
  return views.toString();
};

// 页面加载时执行
onLoad(() => {
  loadVideos();
});
</script>

<style lang="scss">
.video-list-container {
  min-height: 100vh;
  padding-bottom: 30rpx;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
}

.header {
  position: relative;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  
  .header-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #ff9966;
    margin-bottom: 20rpx;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    height: 70rpx;
    padding: 0 30rpx;
    border-radius: 35rpx;
    background-color: rgba(255, 255, 255, 0.1);
    
    .icon-search {
      font-size: 32rpx;
      margin-right: 10rpx;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .search-placeholder {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.category-scroll {
  white-space: nowrap;
  padding: 0 30rpx 20rpx;
  
  .category-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin-right: 20rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.1);
    
    &.active {
      color: #fff;
      background-color: #ff9966;
    }
  }
}

.video-scroll {
  height: calc(100vh - 250rpx);
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
}

.video-item {
  width: calc(50% - 20rpx);
  margin: 10rpx;
  
  .video-cover {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.25%; /* 16:9比例 */
    border-radius: 12rpx;
    overflow: hidden;
    
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
    
    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4rpx;
      background-color: #ff9966;
    }
  }
  
  .video-title {
    font-size: 26rpx;
    line-height: 1.4;
    margin: 10rpx 0 6rpx;
    color: #fff;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .video-stats {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
    
    .dot {
      margin: 0 6rpx;
    }
  }
}

.loading-state {
  text-align: center;
  padding: 30rpx 0;
  
  .loading-text {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style> 