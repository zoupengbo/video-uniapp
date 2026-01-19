<template>
  <view class="page-skeleton" v-if="visible">
    <!-- 视频列表页骨架屏 -->
    <template v-if="type === 'video-list'">
      <view class="skeleton-header">
        <skeleton-screen :elements="headerElements" />
      </view>
      <view class="skeleton-video-grid">
        <view 
          v-for="i in count" 
          :key="i" 
          class="skeleton-video-item"
        >
          <skeleton-screen :elements="videoCardElements" />
        </view>
      </view>
    </template>
    
    <!-- 文章列表页骨架屏 -->
    <template v-else-if="type === 'article-list'">
      <view class="skeleton-header">
        <skeleton-screen :elements="headerElements" />
      </view>
      <view class="skeleton-article-list">
        <view 
          v-for="i in count" 
          :key="i" 
          class="skeleton-article-item"
        >
          <skeleton-screen :elements="articleCardElements" />
        </view>
      </view>
    </template>
    
    <!-- 首页骨架屏 -->
    <template v-else-if="type === 'home'">
      <view class="skeleton-search">
        <skeleton-screen :elements="searchElements" />
      </view>
      <view class="skeleton-categories">
        <skeleton-screen :elements="categoryElements" />
      </view>
      <view class="skeleton-content-list">
        <view 
          v-for="i in count" 
          :key="i" 
          class="skeleton-content-item"
        >
          <skeleton-screen :elements="homeContentElements" />
        </view>
      </view>
    </template>
    
    <!-- 个人中心页骨架屏 -->
    <template v-else-if="type === 'profile'">
      <view class="skeleton-user-header">
        <skeleton-screen :elements="userHeaderElements" />
      </view>
      <view class="skeleton-user-stats">
        <skeleton-screen :elements="userStatsElements" />
      </view>
      <view class="skeleton-menu-list">
        <view 
          v-for="i in 8" 
          :key="i" 
          class="skeleton-menu-item"
        >
          <skeleton-screen :elements="menuItemElements" />
        </view>
      </view>
    </template>
    
    <!-- 通用骨架屏 -->
    <template v-else>
      <view class="skeleton-generic">
        <view 
          v-for="i in count" 
          :key="i" 
          class="skeleton-generic-item"
        >
          <skeleton-screen :elements="genericElements" />
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SkeletonScreen from './SkeletonScreen.vue';

interface Props {
  type: 'video-list' | 'article-list' | 'home' | 'profile' | 'generic';
  visible: boolean;
  count?: number;
  animationType?: 'shimmer' | 'pulse' | 'wave';
  animationSpeed?: string;
}

const props = withDefaults(defineProps<Props>(), {
  count: 6,
  animationType: 'shimmer',
  animationSpeed: '1.5s'
});

// 头部元素配置
const headerElements = computed(() => [
  {
    height: '80rpx',
    width: '100%',
    radius: '40rpx',
    marginBottom: '20rpx'
  }
]);

// 搜索框元素配置
const searchElements = computed(() => [
  {
    height: '80rpx',
    width: '100%',
    radius: '40rpx',
    marginBottom: '30rpx'
  }
]);

// 分类元素配置
const categoryElements = computed(() => [
  {
    height: '60rpx',
    width: '100%',
    radius: '30rpx',
    marginBottom: '30rpx'
  }
]);

// 视频卡片元素配置
const videoCardElements = computed(() => [
  {
    height: '0',
    paddingTop: '56.25%', // 16:9比例
    radius: '12rpx',
    marginBottom: '15rpx'
  },
  {
    height: '26rpx',
    width: '90%',
    marginBottom: '8rpx'
  },
  {
    height: '26rpx',
    width: '60%',
    marginBottom: '8rpx'
  },
  {
    height: '22rpx',
    width: '40%'
  }
]);

// 文章卡片元素配置
const articleCardElements = computed(() => [
  {
    width: '200rpx',
    height: '150rpx',
    radius: '12rpx',
    marginRight: '20rpx'
  },
  {
    height: '30rpx',
    width: '100%',
    marginBottom: '10rpx'
  },
  {
    height: '30rpx',
    width: '80%',
    marginBottom: '10rpx'
  },
  {
    height: '26rpx',
    width: '100%',
    marginBottom: '8rpx'
  },
  {
    height: '26rpx',
    width: '90%',
    marginBottom: '15rpx'
  },
  {
    height: '24rpx',
    width: '60%'
  }
]);

// 首页内容元素配置
const homeContentElements = computed(() => [
  {
    height: '0',
    paddingTop: '56.25%',
    radius: '12rpx',
    marginBottom: '20rpx'
  },
  {
    height: '30rpx',
    width: '90%',
    marginBottom: '10rpx'
  },
  {
    height: '24rpx',
    width: '60%',
    marginBottom: '30rpx'
  }
]);

// 用户头部元素配置
const userHeaderElements = computed(() => [
  {
    width: '120rpx',
    height: '120rpx',
    radius: '50%',
    marginBottom: '20rpx'
  },
  {
    height: '36rpx',
    width: '200rpx',
    marginBottom: '10rpx'
  },
  {
    height: '28rpx',
    width: '150rpx'
  }
]);

// 用户统计元素配置
const userStatsElements = computed(() => [
  {
    height: '80rpx',
    width: '100%',
    radius: '12rpx',
    marginBottom: '20rpx'
  }
]);

// 菜单项元素配置
const menuItemElements = computed(() => [
  {
    width: '60rpx',
    height: '60rpx',
    radius: '12rpx',
    marginRight: '20rpx'
  },
  {
    height: '32rpx',
    width: '200rpx',
    marginBottom: '8rpx'
  },
  {
    height: '24rpx',
    width: '120rpx'
  }
]);

// 通用元素配置
const genericElements = computed(() => [
  {
    height: '40rpx',
    width: '100%',
    marginBottom: '20rpx'
  },
  {
    height: '30rpx',
    width: '80%',
    marginBottom: '20rpx'
  },
  {
    height: '30rpx',
    width: '60%',
    marginBottom: '20rpx'
  }
]);
</script>

<style lang="scss" scoped>
.page-skeleton {
  padding: 30rpx;
  
  .skeleton-header {
    margin-bottom: 30rpx;
  }
  
  .skeleton-search {
    margin-bottom: 30rpx;
  }
  
  .skeleton-categories {
    margin-bottom: 30rpx;
  }
  
  .skeleton-video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .skeleton-video-item {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12rpx;
      padding: 20rpx;
    }
  }
  
  .skeleton-article-list {
    .skeleton-article-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  .skeleton-content-list {
    .skeleton-content-item {
      margin-bottom: 40rpx;
      padding: 20rpx;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12rpx;
    }
  }
  
  .skeleton-user-header {
    text-align: center;
    padding: 40rpx 0;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12rpx;
    margin-bottom: 30rpx;
  }
  
  .skeleton-user-stats {
    margin-bottom: 30rpx;
  }
  
  .skeleton-menu-list {
    .skeleton-menu-item {
      display: flex;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  .skeleton-generic {
    .skeleton-generic-item {
      margin-bottom: 30rpx;
      padding: 20rpx;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 12rpx;
    }
  }
}
</style>
