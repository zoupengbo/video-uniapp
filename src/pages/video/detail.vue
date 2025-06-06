<template>
  <view class="video-detail-container">
    <!-- 视频播放区域 -->
    <view class="video-player-wrapper">
      <VideoPlayer 
        :videoSrc="videoDetail.videoUrl" 
        :posterUrl="videoDetail.coverUrl" 
      />
    </view>
    
    <!-- 视频信息 -->
    <view class="video-info-section">
      <view class="video-title">{{ videoDetail.title }}</view>
      <view class="video-stats">
        <text class="views">{{ formatViews(videoDetail.views) }}播放</text>
        <text class="publish-time">{{ videoDetail.publishTime }}</text>
      </view>
      
      <!-- 作者信息 -->
      <view class="author-info">
        <image class="author-avatar" :src="videoDetail.authorAvatar" mode="aspectFill"></image>
        <view class="author-detail">
          <text class="author-name">{{ videoDetail.author }}</text>
          <text class="author-fans">{{ formatViews(videoDetail.fans) }}粉丝</text>
        </view>
        <button class="follow-btn" :class="{ followed: isFollowed }" @tap="toggleFollow">
          {{ isFollowed ? '已关注' : '关注' }}
        </button>
      </view>
      
      <!-- 视频描述 -->
      <view class="video-description" @tap="toggleDescExpand">
        <text :class="{ 'expanded': isDescExpanded }">{{ videoDetail.description }}</text>
        <view class="expand-btn" v-if="videoDetail.description && videoDetail.description.length > 100">
          {{ isDescExpanded ? '收起' : '展开' }}
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-item" @tap="handleLike">
          <text class="iconfont icon-like" :class="{ active: isLiked }"></text>
          <text>{{ formatViews(videoDetail.likes) }}</text>
        </view>
        <view class="action-item" @tap="handleCollect">
          <text class="iconfont icon-collect" :class="{ active: isCollected }"></text>
          <text>收藏</text>
        </view>
        <view class="action-item" @tap="handleComment">
          <text class="iconfont icon-comment"></text>
          <text>{{ formatViews(videoDetail.comments) }}</text>
        </view>
        <view class="action-item" @tap="handleShare">
          <text class="iconfont icon-share"></text>
          <text>分享</text>
        </view>
      </view>
    </view>
    
    <!-- 推荐视频列表 -->
    <view class="recommend-section">
      <view class="section-title">相关推荐</view>
      <view class="recommend-list">
        <view 
          class="recommend-item"
          v-for="video in recommendVideos"
          :key="video.id"
          @tap="playRecommendVideo(video)"
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
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import VideoPlayer from '@/components/VideoPlayer.vue';

// 视频ID
const videoId = ref('');

// 是否已关注
const isFollowed = ref(false);
// 是否已点赞
const isLiked = ref(false);
// 是否已收藏
const isCollected = ref(false);
// 是否展开描述
const isDescExpanded = ref(false);

// 视频详情数据
const videoDetail = ref({
  id: '',
  title: '加载中...',
  videoUrl: '',
  coverUrl: '',
  views: 0,
  likes: 0,
  comments: 0,
  publishTime: '',
  author: '',
  authorAvatar: '',
  fans: 0,
  description: ''
});

// 推荐视频列表
const recommendVideos = ref<any[]>([]);

// 获取视频详情
const getVideoDetail = async (id: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    videoDetail.value = {
      id,
      title: `视频详情 ${id}`,
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4', // 示例视频URL
      coverUrl: `https://picsum.photos/600/400?random=${Math.random()}`,
      views: Math.floor(Math.random() * 10000000),
      likes: Math.floor(Math.random() * 100000),
      comments: Math.floor(Math.random() * 10000),
      publishTime: '2023-06-15',
      author: '视频作者',
      authorAvatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
      fans: Math.floor(Math.random() * 1000000),
      description: '这是一段视频描述。'.repeat(10) // 重复10次模拟长文本
    };
    
    // 获取推荐视频
    getRecommendVideos(id);
    
  } catch (error) {
    console.error('获取视频详情失败', error);
    uni.showToast({
      title: '获取视频详情失败',
      icon: 'none'
    });
  }
};

// 获取推荐视频
const getRecommendVideos = async (currentVideoId: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟数据
    recommendVideos.value = Array(10).fill(0).map((_, index) => ({
      id: `recommend-${index}`,
      title: `推荐视频 ${index + 1}`,
      coverUrl: `https://picsum.photos/300/200?random=${Math.random()}`,
      duration: Math.floor(Math.random() * 7200), // 0-2小时的秒数
      author: '推荐作者',
      views: Math.floor(Math.random() * 10000000), // 随机播放量
    }));
    
  } catch (error) {
    console.error('获取推荐视频失败', error);
  }
};

// 切换关注状态
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value;
  uni.showToast({
    title: isFollowed.value ? '已关注' : '已取消关注',
    icon: 'none'
  });
};

// 切换描述展开状态
const toggleDescExpand = () => {
  isDescExpanded.value = !isDescExpanded.value;
};

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value;
  videoDetail.value.likes += isLiked.value ? 1 : -1;
};

// 处理收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value;
  uni.showToast({
    title: isCollected.value ? '已收藏' : '已取消收藏',
    icon: 'none'
  });
};

// 处理评论
const handleComment = () => {
  uni.showToast({
    title: '评论功能开发中',
    icon: 'none'
  });
};

// 处理分享
const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

// 播放推荐视频
const playRecommendVideo = (video: any) => {
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

// 页面加载
onLoad((options) => {
  if (options.id) {
    videoId.value = options.id;
    getVideoDetail(options.id);
  }
});
</script>

<style lang="scss">
.video-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%);
}

.video-player-wrapper {
  width: 100%;
  height: 422rpx; // 16:9比例，适应大部分手机
}

.video-info-section {
  padding: 20rpx 30rpx;
  
  .video-title {
    font-size: 36rpx;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 16rpx;
    color: #fff;
  }
  
  .video-stats {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20rpx;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    margin: 30rpx 0;
    
    .author-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .author-detail {
      flex: 1;
      
      .author-name {
        font-size: 28rpx;
        color: #fff;
        margin-bottom: 6rpx;
      }
      
      .author-fans {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .follow-btn {
      background-color: #ff9966;
      color: #fff;
      font-size: 24rpx;
      padding: 10rpx 30rpx;
      border-radius: 40rpx;
      border: none;
      
      &.followed {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  
  .video-description {
    margin: 20rpx 0;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    
    text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      
      &.expanded {
        -webkit-line-clamp: initial;
      }
    }
    
    .expand-btn {
      color: #ff9966;
      margin-top: 10rpx;
      font-size: 24rpx;
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;
    padding: 20rpx 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 24rpx;
      
      .iconfont {
        font-size: 40rpx;
        margin-bottom: 8rpx;
        
        &.active {
          color: #ff9966;
        }
      }
    }
  }
}

.recommend-section {
  padding: 20rpx 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #fff;
  }
  
  .recommend-list {
    .recommend-item {
      display: flex;
      margin-bottom: 30rpx;
      
      .video-cover {
        position: relative;
        width: 240rpx;
        height: 135rpx;
        border-radius: 12rpx;
        overflow: hidden;
        margin-right: 20rpx;
        
        image {
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
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .video-title {
          font-size: 28rpx;
          line-height: 1.4;
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
          
          .author {
            margin-right: 20rpx;
          }
        }
      }
    }
  }
}
</style> 