<template>
  <view class="article-detail-container">
    <!-- 文章头部 -->
    <view class="article-header">
      <text class="article-title">{{ articleDetail.title }}</text>
      <view class="article-meta">
        <view class="author-info">
          <image class="author-avatar" :src="articleDetail.authorAvatar" mode="aspectFill"></image>
          <text class="author-name">{{ articleDetail.author }}</text>
        </view>
        <text class="publish-date">{{ articleDetail.publishDate }}</text>
      </view>
      <view class="article-stats">
        <text class="views">{{ formatViews(articleDetail.views) }}阅读</text>
        <text class="comments">{{ articleDetail.comments }}评论</text>
      </view>
    </view>
    
    <!-- 文章内容 -->
    <view class="article-content">
      <image 
        v-if="articleDetail.coverUrl" 
        class="article-cover" 
        :src="articleDetail.coverUrl" 
        mode="widthFix"
      ></image>
      <rich-text class="article-text" :nodes="articleDetail.content"></rich-text>
    </view>
    
    <!-- 点赞收藏操作 -->
    <view class="action-bar">
      <view class="action-item" @tap="handleLike">
        <text class="iconfont icon-like" :class="{ active: isLiked }"></text>
        <text>{{ isLiked ? '已点赞' : '点赞' }}</text>
      </view>
      <view class="action-item" @tap="handleCollect">
        <text class="iconfont icon-collect" :class="{ active: isCollected }"></text>
        <text>{{ isCollected ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-item" @tap="handleComment">
        <text class="iconfont icon-comment"></text>
        <text>评论</text>
      </view>
      <view class="action-item" @tap="handleShare">
        <text class="iconfont icon-share"></text>
        <text>分享</text>
      </view>
    </view>
    
    <!-- 评论区 -->
    <view class="comments-section">
      <view class="section-title">评论 ({{ articleDetail.comments }})</view>
      
      <view v-if="commentList.length === 0" class="no-comments">
        <text>暂无评论，发表第一条评论吧</text>
      </view>
      
      <view v-else class="comment-list">
        <view 
          class="comment-item"
          v-for="comment in commentList"
          :key="comment.id"
        >
          <image class="commenter-avatar" :src="comment.userAvatar" mode="aspectFill"></image>
          <view class="comment-content">
            <view class="commenter-info">
              <text class="commenter-name">{{ comment.userName }}</text>
              <text class="comment-time">{{ comment.time }}</text>
            </view>
            <text class="comment-text">{{ comment.content }}</text>
            <view class="comment-actions">
              <view class="like-action" @tap="likeComment(comment)">
                <text class="iconfont icon-like" :class="{ active: comment.isLiked }"></text>
                <text>{{ comment.likes }}</text>
              </view>
              <view class="reply-action" @tap="replyComment(comment)">
                <text>回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部评论输入框 -->
    <view class="comment-input-area">
      <input 
        type="text" 
        v-model="commentText" 
        placeholder="写下你的评论..." 
        confirm-type="send"
        @confirm="submitComment"
      />
      <button class="send-btn" @tap="submitComment">发送</button>
    </view>
    
    <!-- 相关推荐 -->
    <view class="related-articles">
      <view class="section-title">相关推荐</view>
      
      <view class="related-list">
        <view 
          class="related-item"
          v-for="article in relatedArticles"
          :key="article.id"
          @tap="viewRelatedArticle(article)"
        >
          <image class="related-cover" :src="article.coverUrl" mode="aspectFill"></image>
          <view class="related-info">
            <text class="related-title">{{ article.title }}</text>
            <view class="related-meta">
              <text class="related-author">{{ article.author }}</text>
              <text class="related-views">{{ formatViews(article.views) }}阅读</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 文章ID
const articleId = ref('');

// 是否已点赞
const isLiked = ref(false);
// 是否已收藏
const isCollected = ref(false);
// 评论内容
const commentText = ref('');

// 文章详情数据
const articleDetail = ref({
  id: '',
  title: '加载中...',
  author: '',
  authorAvatar: '',
  publishDate: '',
  views: 0,
  comments: 0,
  coverUrl: '',
  content: ''
});

// 评论列表
const commentList = ref<any[]>([]);

// 相关文章
const relatedArticles = ref<any[]>([]);

// 获取文章详情
const getArticleDetail = async (id: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    articleDetail.value = {
      id,
      title: `文章详情 ${id}`,
      author: '文章作者',
      authorAvatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
      publishDate: '2023-06-15',
      views: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 100),
      coverUrl: `https://picsum.photos/800/400?random=${Math.random()}`,
      content: `
        <p style="font-size: 32rpx; line-height: 1.8; color: #333; margin-bottom: 30rpx;">这是一篇精彩的文章，内容丰富多彩。在这里您可以了解到关于这个主题的方方面面。</p>
        <p style="font-size: 32rpx; line-height: 1.8; color: #333; margin-bottom: 30rpx;">我们将探讨这个领域的最新发展和趋势，以及它对我们日常生活的影响。</p>
        <p style="font-size: 32rpx; line-height: 1.8; color: #333; margin-bottom: 30rpx;">文章的主要内容包括以下几个方面：首先，我们会介绍该领域的基本概念和历史发展；其次，分析当前的热点问题和挑战；最后，展望未来可能的发展方向和机遇。</p>
        <p style="font-size: 32rpx; line-height: 1.8; color: #333; margin-bottom: 30rpx;">希望通过本文，能够让读者对这个话题有更深入的了解和思考。</p>
        <p style="font-size: 32rpx; line-height: 1.8; color: #333; margin-bottom: 30rpx;">感谢您的阅读！</p>
      `.repeat(3) // 重复3次以模拟长文章
    };
    
    // 获取评论
    getComments(id);
    
    // 获取相关文章
    getRelatedArticles(id);
    
  } catch (error) {
    console.error('获取文章详情失败', error);
    uni.showToast({
      title: '获取文章详情失败',
      icon: 'none'
    });
  }
};

// 获取评论
const getComments = async (articleId: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // 模拟数据
    commentList.value = Array(5).fill(0).map((_, index) => ({
      id: `comment-${index}`,
      userName: `用户${index + 1}`,
      userAvatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
      content: `这是第${index + 1}条评论，评论内容可能比较长，需要自动换行显示。`,
      time: '2023-06-16',
      likes: Math.floor(Math.random() * 50),
      isLiked: false
    }));
    
  } catch (error) {
    console.error('获取评论失败', error);
  }
};

// 获取相关文章
const getRelatedArticles = async (currentArticleId: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 模拟数据
    relatedArticles.value = Array(3).fill(0).map((_, index) => ({
      id: `related-${index}`,
      title: `相关文章 ${index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      author: '推荐作者',
      views: Math.floor(Math.random() * 10000),
    }));
    
  } catch (error) {
    console.error('获取相关文章失败', error);
  }
};

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value;
  uni.showToast({
    title: isLiked.value ? '点赞成功' : '已取消点赞',
    icon: 'none'
  });
};

// 处理收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value;
  uni.showToast({
    title: isCollected.value ? '收藏成功' : '已取消收藏',
    icon: 'none'
  });
};

// 处理评论
const handleComment = () => {
  // 聚焦到评论输入框
  uni.pageScrollTo({
    selector: '.comment-input-area',
    duration: 300
  });
};

// 处理分享
const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

// 点赞评论
const likeComment = (comment: any) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

// 回复评论
const replyComment = (comment: any) => {
  commentText.value = `回复 @${comment.userName}：`;
  // 聚焦到评论输入框
  uni.pageScrollTo({
    selector: '.comment-input-area',
    duration: 300
  });
};

// 提交评论
const submitComment = () => {
  if (!commentText.value.trim()) {
    uni.showToast({
      title: '评论内容不能为空',
      icon: 'none'
    });
    return;
  }
  
  // 模拟提交评论
  const newComment = {
    id: `comment-new-${Date.now()}`,
    userName: '当前用户',
    userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: commentText.value,
    time: '刚刚',
    likes: 0,
    isLiked: false
  };
  
  commentList.value.unshift(newComment);
  articleDetail.value.comments++;
  commentText.value = '';
  
  uni.showToast({
    title: '评论成功',
    icon: 'success'
  });
};

// 查看相关文章
const viewRelatedArticle = (article: any) => {
  uni.navigateTo({
    url: `/pages/article/detail?id=${article.id}`
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

// 监听页面加载
onLoad((option) => {
  if (option.id) {
    articleId.value = option.id;
    getArticleDetail(option.id);
  }
});
</script>

<style lang="scss">
.article-detail-container {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
}

.article-header {
  padding: 30rpx;
  background-color: #fff;
  
  .article-title {
    font-size: 40rpx;
    font-weight: bold;
    line-height: 1.4;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .author-info {
      display: flex;
      align-items: center;
      
      .author-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }
      
      .author-name {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .publish-date {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .article-stats {
    display: flex;
    font-size: 24rpx;
    color: #999;
    
    .comments {
      margin-left: 20rpx;
    }
  }
}

.article-content {
  padding: 30rpx;
  background-color: #fff;
  margin-top: 20rpx;
  
  .article-cover {
    width: 100%;
    margin-bottom: 30rpx;
    border-radius: 12rpx;
  }
}

.action-bar {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background-color: #fff;
  margin-top: 20rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
    
    .iconfont {
      font-size: 40rpx;
      margin-bottom: 10rpx;
      
      &.active {
        color: #ff9966;
      }
    }
    
    text {
      font-size: 24rpx;
    }
  }
}

.comments-section {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .no-comments {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
  }
  
  .comment-list {
    .comment-item {
      display: flex;
      margin-bottom: 30rpx;
      
      .commenter-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      
      .comment-content {
        flex: 1;
        
        .commenter-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10rpx;
          
          .commenter-name {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
          }
          
          .comment-time {
            font-size: 24rpx;
            color: #999;
          }
        }
        
        .comment-text {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 10rpx;
        }
        
        .comment-actions {
          display: flex;
          font-size: 24rpx;
          color: #999;
          
          .like-action, .reply-action {
            display: flex;
            align-items: center;
            margin-right: 30rpx;
            
            .iconfont {
              margin-right: 6rpx;
              
              &.active {
                color: #ff9966;
              }
            }
          }
        }
      }
    }
  }
}

.comment-input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  input {
    flex: 1;
    height: 70rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }
  
  .send-btn {
    margin-left: 20rpx;
    background-color: #ff9966;
    color: #fff;
    font-size: 28rpx;
    padding: 0 30rpx;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 35rpx;
  }
}

.related-articles {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .related-list {
    .related-item {
      display: flex;
      margin-bottom: 20rpx;
      
      .related-cover {
        width: 200rpx;
        height: 120rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      
      .related-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .related-title {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .related-meta {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}
</style> 