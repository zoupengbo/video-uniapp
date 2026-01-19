<template>
  <view class="container">
    <!-- 页面骨架屏 -->
    <page-skeleton
      v-if="isInitialLoading"
      type="home"
      :visible="true"
      :count="4"
      :animation-type="'shimmer'"
    />

    <!-- 实际内容 -->
    <template v-else>
      <!-- 顶部搜索栏 -->
      <view class="search-bar">
        <view class="search-box">
          <text class="iconfont icon-search"></text>
          <input type="text" placeholder="搜索内容" placeholder-class="placeholder" v-model="searchText" @confirm="searchContent" />
        </view>
      </view>
    
    <!-- 视频类别区域 -->
    <view class="section-container">
      <view class="section-header">
        <text class="section-title">视频专区</text>
        <view class="view-more" @tap="navigateToVideoList">
          <text>查看更多</text>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
      
      <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
        <view 
          class="category-item" 
          :class="{ active: currentVideoCategory === category.id }"
          v-for="category in videoCategories" 
          :key="category.id"
          @tap="changeVideoCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
      
      <scroll-view scroll-x class="video-scroll" show-scrollbar="false">
        <view 
          class="video-item"
          v-for="video in videoList"
          :key="video.id"
          @tap="playVideo(video)"
        >
          <view class="video-cover">
            <image :src="video.coverUrl" mode="aspectFill"></image>
            <view class="video-duration">{{ formatDuration(video.duration) }}</view>
          </view>
          <text class="video-title">{{ video.title }}</text>
          <text class="video-author">{{ video.author }}</text>
        </view>
      </scroll-view>
      
      <view class="details-button" @tap="navigateToVideoList">
        <text>查看全部视频</text>
      </view>
    </view>
    
    <!-- 文章类别区域 -->
    <view class="section-container">
      <view class="section-header">
        <text class="section-title">文章专区</text>
        <view class="view-more" @tap="navigateToArticleList">
          <text>查看更多</text>
          <text class="iconfont icon-right"></text>
        </view>
      </view>
      
      <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
        <view 
          class="category-item" 
          :class="{ active: currentArticleCategory === category.id }"
          v-for="category in articleCategories" 
          :key="category.id"
          @tap="changeArticleCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
      
      <view class="article-list">
        <view 
          class="article-item"
          v-for="article in articleList"
          :key="article.id"
          @tap="viewArticle(article)"
        >
          <image class="article-cover" :src="article.coverUrl" mode="aspectFill"></image>
          <view class="article-info">
            <text class="article-title">{{ article.title }}</text>
            <text class="article-summary">{{ article.summary }}</text>
            <view class="article-meta">
              <text class="article-author">{{ article.author }}</text>
              <text class="article-date">{{ article.publishDate }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="details-button" @tap="navigateToArticleList">
        <text>查看全部文章</text>
      </view>
    </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useListSkeleton, useGlobalSkeleton } from '../../composables/useSkeleton';
import { onTabItemTap } from '@dcloudio/uni-app';

// 使用骨架屏Hook
const { isInitialLoading, loadInitial } = useListSkeleton({ initialCount: 4 });
const { hideGlobal } = useGlobalSkeleton();

// 搜索
const searchText = ref('');
const searchContent = () => {
  if (searchText.value.trim()) {
    // 执行搜索逻辑
    uni.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  }
};

// 视频分类数据
const videoCategories = ref([
  { id: 'all', name: '推荐' },
  { id: 'movie', name: '电影' },
  { id: 'series', name: '剧集' },
  { id: 'anime', name: '动漫' },
  { id: 'variety', name: '综艺' },
  { id: 'documentary', name: '纪录片' },
]);
const currentVideoCategory = ref('all');

// 切换视频分类
const changeVideoCategory = (categoryId: string) => {
  currentVideoCategory.value = categoryId;
  loadVideosByCategory(categoryId);
};

// 文章分类数据
const articleCategories = ref([
  { id: 'recommend', name: '推荐' },
  { id: 'tech', name: '科技' },
  { id: 'travel', name: '旅行' },
  { id: 'food', name: '美食' },
  { id: 'health', name: '健康' },
  { id: 'fashion', name: '时尚' },
]);
const currentArticleCategory = ref('recommend');

// 切换文章分类
const changeArticleCategory = (categoryId: string) => {
  currentArticleCategory.value = categoryId;
  loadArticlesByCategory(categoryId);
};

// 视频列表数据
const videoList = ref<any[]>([]);

// 加载视频数据
const loadVideosByCategory = async (categoryId: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    videoList.value = Array(6).fill(0).map((_, index) => ({
      id: `${categoryId}-${index}`,
      title: `${categoryId === 'all' ? '推荐' : categoryId} 视频 ${index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      duration: Math.floor(Math.random() * 7200), // 0-2小时的秒数
      author: '视频作者',
      views: Math.floor(Math.random() * 10000000), // 随机播放量
    }));
    
  } catch (error) {
    console.error('加载视频失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  }
};

// 文章列表数据
const articleList = ref<any[]>([]);

// 加载文章数据
const loadArticlesByCategory = async (categoryId: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    articleList.value = Array(4).fill(0).map((_, index) => ({
      id: `${categoryId}-${index}`,
      title: `${categoryId === 'recommend' ? '推荐' : categoryId} 文章 ${index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      summary: '这是文章摘要，简要介绍文章的主要内容，吸引用户点击阅读全文...',
      author: '文章作者',
      publishDate: '2023-06-15',
      views: Math.floor(Math.random() * 10000000), // 随机阅读量
    }));
    
  } catch (error) {
    console.error('加载文章失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  }
};

// 播放视频
const playVideo = (video: any) => {
  uni.navigateTo({
    url: `/pages/video/detail?id=${video.id}`
  });
};

// 查看文章
const viewArticle = (article: any) => {
  // 由于没有文章详情页，需要先创建
  uni.showToast({
    title: '文章详情页开发中',
    icon: 'none'
  });
  // 实际项目中应该是:
  // uni.navigateTo({
  //   url: `/pages/article/detail?id=${article.id}`
  // });
};

// 导航到视频列表页
const navigateToVideoList = () => {
  // 导航到原先的首页，作为视频列表页
  uni.navigateTo({
    url: '/pages/video/list'
  });
};

// 导航到文章列表页
const navigateToArticleList = () => {
  // 导航到文章列表页
  uni.navigateTo({
    url: '/pages/article/list'
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



// 初始化
onMounted(async () => {
  // 隐藏全局骨架屏
  hideGlobal();

  // 使用骨架屏加载数据
  await loadInitial(async () => {
    await Promise.all([
      loadVideosByCategory(currentVideoCategory.value),
      loadArticlesByCategory(currentArticleCategory.value)
    ]);
  });
});

// 点击 TabBar 刷新
onTabItemTap(() => {
  // 滚动到顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });

  // 刷新数据
  uni.showLoading({
    title: '刷新中...'
  });

  Promise.all([
    loadVideosByCategory(currentVideoCategory.value),
    loadArticlesByCategory(currentArticleCategory.value)
  ]).then(() => {
    uni.hideLoading();
  }).catch(() => {
    uni.hideLoading();
  });
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

.section-container {
  margin: 30rpx 0;
  padding: 20rpx;
  background-color: rgba(15, 25, 35, 0.5);
  border-radius: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }
  
  .view-more {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 28rpx;
    
    .iconfont {
      margin-left: 5rpx;
    }
  }
}

.category-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
  
  .category-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin: 0 10rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.1);
    
    &.active {
      color: #fff;
      background-color: #ff9966;
    }
    
    &:first-child {
      margin-left: 0;
    }
  }
}

.video-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
  
  .video-item {
    display: inline-block;
    width: 250rpx;
    margin-right: 20rpx;
    vertical-align: top;
    
    .video-cover {
      position: relative;
      width: 250rpx;
      height: 150rpx;
      border-radius: 12rpx;
      overflow: hidden;
      
      image {
        width: 100%;
        height: 100%;
      }
      
      .video-duration {
        position: absolute;
        right: 10rpx;
        bottom: 10rpx;
        padding: 2rpx 8rpx;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 4rpx;
        font-size: 20rpx;
        color: #fff;
      }
    }
    
    .video-title {
      display: block;
      width: 100%;
      margin-top: 10rpx;
      font-size: 26rpx;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .video-author {
      display: block;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 5rpx;
    }
  }
}

.article-list {
  margin-bottom: 20rpx;
  
  .article-item {
    display: flex;
    margin-bottom: 30rpx;
    
    .article-cover {
      width: 200rpx;
      height: 150rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }
    
    .article-info {
      flex: 1;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      
      .article-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .article-summary {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .article-meta {
        display: flex;
        justify-content: space-between;
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.5);
        margin-top: auto;
      }
    }
  }
}

.details-button {
  background-color: rgba(255, 153, 102, 0.8);
  border-radius: 40rpx;
  padding: 15rpx 0;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  margin-top: 10rpx;
}
</style>
