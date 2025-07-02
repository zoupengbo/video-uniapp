<template>
  <view class="article-list-container">
    <!-- 页面头部 -->
    <view class="header">
      <view class="header-title">文章</view>
      <view class="search-box" @tap="navigateToSearch">
        <text class="iconfont icon-search"></text>
        <text class="search-placeholder">搜索文章</text>
      </view>
    </view>
    
    <!-- 分类选择器 -->
    <scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
      <view 
        class="category-item" 
        :class="{ active: currentCategory === category.id }" 
        v-for="category in articleCategories" 
        :key="category.id"
        @tap="changeCategory(category.id)"
      >
        {{ category.name }}
      </view>
    </scroll-view>
    
    <!-- 文章列表 -->
    <scroll-view 
      class="article-scroll" 
      scroll-y="true" 
      @scrolltolower="loadMoreArticles"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="article-list">
        <view 
          class="article-item" 
          v-for="article in articleList" 
          :key="article.id"
          @tap="viewArticle(article)"
        >
          <view class="article-cover">
            <image :src="article.coverUrl" mode="aspectFill"></image>
          </view>
          <view class="article-content">
            <view class="article-title">{{ article.title }}</view>
            <view class="article-summary">{{ article.summary }}</view>
            <view class="article-stats">
              <text class="author">{{ article.author }}</text>
              <text class="dot">·</text>
              <text class="views">{{ formatViews(article.views) }}阅读</text>
              <text class="dot">·</text>
              <text class="publish-date">{{ article.publishDate }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-state" v-if="isLoading">
        <text class="loading-text">加载中...</text>
      </view>
      
      <!-- 无数据状态 -->
      <view class="empty-state" v-if="articleList.length === 0 && !isLoading">
        <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂无文章</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

// 分类数据
const articleCategories = ref([
  { id: 'recommend', name: '推荐' },
  { id: 'tech', name: '科技' },
  { id: 'travel', name: '旅行' },
  { id: 'food', name: '美食' },
  { id: 'health', name: '健康' },
  { id: 'fashion', name: '时尚' },
  { id: 'culture', name: '文化' },
  { id: 'education', name: '教育' },
]);
const currentCategory = ref('recommend');

// 文章列表数据
const articleList = ref<any[]>([]);
const isLoading = ref(false);
const isRefreshing = ref(false);
const page = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);

// 切换分类
const changeCategory = (categoryId: string) => {
  if (currentCategory.value === categoryId) return;
  
  currentCategory.value = categoryId;
  articleList.value = [];
  page.value = 1;
  hasMore.value = true;
  loadArticles();
};

// 加载文章列表
const loadArticles = async () => {
  if (isLoading.value || !hasMore.value) return;
  
  isLoading.value = true;
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟数据
    const newArticles = Array(pageSize.value).fill(0).map((_, index) => ({
      id: `${currentCategory.value}-${(page.value - 1) * pageSize.value + index + 1}`,
      title: `${currentCategory.value === 'recommend' ? '推荐' : currentCategory.value} 文章 ${(page.value - 1) * pageSize.value + index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      summary: '这是文章摘要，简要介绍文章的主要内容，吸引用户点击阅读全文。本文探讨了相关话题的最新发展和见解...',
      author: '文章作者',
      publishDate: `${Math.floor(Math.random() * 12) + 1}月${Math.floor(Math.random() * 28) + 1}日`,
      views: Math.floor(Math.random() * 10000000), // 随机阅读量
      commentCount: Math.floor(Math.random() * 1000), // 随机评论数
      likeCount: Math.floor(Math.random() * 5000), // 随机点赞数
    }));
    
    articleList.value = [...articleList.value, ...newArticles];
    
    // 模拟是否有更多数据
    hasMore.value = page.value < 5; // 最多5页数据
    page.value++;
    
  } catch (error) {
    console.error('加载文章失败', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

// 加载更多文章
const loadMoreArticles = () => {
  if (hasMore.value) {
    loadArticles();
  }
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  articleList.value = [];
  page.value = 1;
  hasMore.value = true;
  loadArticles();
};

// 查看文章详情
const viewArticle = (article: any) => {
  uni.navigateTo({
    url: `/pages/article/detail?id=${article.id}`
  });
};

// 跳转到搜索页面
const navigateToSearch = () => {
  uni.navigateTo({
    url: '/pages/search/index?type=article'
  });
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
  loadArticles();
});
</script>

<style lang="scss">
.article-list-container {
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

.article-scroll {
  height: calc(100vh - 250rpx);
}

.article-list {
  padding: 0 30rpx;
}

.article-item {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .article-cover {
    width: 200rpx;
    height: 150rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 20rpx;
    flex-shrink: 0;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .article-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #fff;
      margin-bottom: 10rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .article-summary {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 15rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .article-stats {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.5);
      
      .dot {
        margin: 0 6rpx;
      }
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