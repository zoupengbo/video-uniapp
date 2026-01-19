<template>
  <view 
    v-if="globalSkeletonState.isVisible" 
    class="global-skeleton-overlay"
    :style="{ backgroundColor: globalSkeletonState.config.backgroundColor }"
  >
    <view class="global-skeleton-container">
      <!-- 导航栏骨架 -->
      <view class="skeleton-navbar">
        <view class="skeleton-nav-item skeleton-back-btn"></view>
        <view class="skeleton-nav-item skeleton-title"></view>
        <view class="skeleton-nav-item skeleton-menu-btn"></view>
      </view>
      
      <!-- 页面内容骨架 -->
      <view class="skeleton-content">
        <skeleton-screen 
          :elements="currentPageConfig.elements"
          :animated="true"
          :animation-type="globalSkeletonState.config.animationType"
          :animation-speed="globalSkeletonState.config.animationSpeed"
          :skeleton-color="globalSkeletonState.config.skeletonColor"
        />
      </view>
      
      <!-- 底部导航栏骨架 (仅在有tabBar的页面显示) -->
      <view v-if="hasTabBar" class="skeleton-tabbar">
        <view 
          v-for="i in 3" 
          :key="i" 
          class="skeleton-tab-item"
        >
          <view class="skeleton-tab-icon"></view>
          <view class="skeleton-tab-text"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SkeletonScreen from './SkeletonScreen.vue';
import { globalSkeletonState, skeletonManager } from '../utils/skeletonManager';

// 计算当前页面配置
const currentPageConfig = computed(() => {
  return skeletonManager.getPageConfig(globalSkeletonState.currentPage);
});

// 判断是否有底部导航栏
const hasTabBar = computed(() => {
  const tabBarPages = [
    'pages/index/index',
    'pages/add/index', 
    'pages/about/index'
  ];
  return tabBarPages.includes(globalSkeletonState.currentPage);
});
</script>

<style lang="scss" scoped>
.global-skeleton-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
  
  .global-skeleton-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}

// 导航栏骨架
.skeleton-navbar {
  height: 88rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a2a3a;
  
  .skeleton-nav-item {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8rpx;
    animation: pulse 1.5s infinite;
  }
  
  .skeleton-back-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }
  
  .skeleton-title {
    width: 200rpx;
    height: 40rpx;
  }
  
  .skeleton-menu-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }
}

// 内容区域骨架
.skeleton-content {
  flex: 1;
  padding: 30rpx;
  overflow: hidden;
}

// 底部导航栏骨架
.skeleton-tabbar {
  height: 120rpx;
  background-color: #1a2a3a;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  
  .skeleton-tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    
    .skeleton-tab-icon {
      width: 48rpx;
      height: 48rpx;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;
      animation: pulse 1.5s infinite;
    }
    
    .skeleton-tab-text {
      width: 60rpx;
      height: 24rpx;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4rpx;
      animation: pulse 1.5s infinite;
      animation-delay: 0.2s;
    }
  }
}

// 脉冲动画
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

// 响应式适配
@media (prefers-reduced-motion: reduce) {
  .skeleton-nav-item,
  .skeleton-tab-icon,
  .skeleton-tab-text {
    animation: none !important;
  }
}
</style>
